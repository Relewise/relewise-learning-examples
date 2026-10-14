import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

// Only fictional configuration is used here. Every SDK send below is mocked.
process.env.RELEWISE_DATASET_ID = '00000000-0000-0000-0000-000000000001';
process.env.RELEWISE_API_KEY = 'test-only';
process.env.RELEWISE_SERVER_URL = 'https://example.invalid';
process.env.LANGUAGE = 'en-gb';
process.env.CURRENCY = 'EUR';
const config = await import('../template/dist/config/relewiseConfig.js');
const { buildProductUpdate, default: importProducts } =
    await import('../template/dist/examples/import/productImportExample.js');
const { buildHistoricalOrder, default: importOrders } =
    await import('../template/dist/examples/import/historicalDataImportExample.js');
const { default: trackJourney } =
    await import('../template/dist/examples/tracking/basicTrackingExample.js');
const { searchProducts } =
    await import('../template/dist/examples/search/termBasedSearchExample.js');
const { searchProductsByCategory } =
    await import('../template/dist/examples/search/categoryBasedSearchExample.js');
const { searchWithCDPPersonalization } =
    await import('../template/dist/examples/search/cdpPersonalizedSearchExample.js');
const { default: popularProducts } =
    await import('../template/dist/examples/recommendations/popularProductsExample.js');
const { default: purchasedWithProducts } =
    await import('../template/dist/examples/recommendations/purchasedWithProductExample.js');
const products = JSON.parse(
    await readFile(
        new URL('../template/product_data/product_data_example.json', import.meta.url),
        'utf8',
    ),
);
const orders = JSON.parse(
    await readFile(
        new URL('../template/product_data/historical_orders_example.json', import.meta.url),
        'utf8',
    ),
);

test('catalog mapping keeps prices unique and stock consistent with the sample market', () => {
    assert.equal(products.length, 274);
    for (const product of products) {
        for (const prices of [product.sales_price, product.list_price]) {
            assert.equal(new Set(prices.map((price) => price.currency)).size, prices.length);
        }
        const update = buildProductUpdate(product, 123);
        const availability = product.availability.find((item) => item.language === 'en-gb');
        assert.equal(update.product.data['en-gb_StockLevel'].value, availability.number);
        assert.equal(update.product.data.ImportedAt.value, 123);
    }
});

test('historical totals sum extended line totals once and all products exist', () => {
    const productIds = new Set(products.map((product) => product.unique_id));
    const source = orders.find((order) => order.orderNumber === 'ORD-SE-002');
    assert.equal(source.lineItems[0].quantity, 2);
    assert.equal(buildHistoricalOrder(source).subtotal.amount, 4559.8);
    for (const order of orders) {
        assert.ok(order.lineItems.every((line) => productIds.has(line.productId)));
        assert.equal(
            buildHistoricalOrder(order).subtotal.amount,
            order.lineItems.reduce((total, line) => total + line.lineTotal, 0),
        );
    }
});

test('imports stop on SDK failure instead of retrying or reporting success', async (t) => {
    const send = t.mock.method(config.integrator, 'batch', async () => {
        throw new Error('Batch rejected');
    });
    await assert.rejects(importProducts(), /Batch rejected/);
    await assert.rejects(importOrders(), /Batch rejected/);
    assert.equal(send.mock.callCount(), 2);
});

test('tracking uses the imported product, category and shared identity with matching totals', async (t) => {
    const events = [];
    for (const method of [
        'trackProductCategoryView',
        'trackProductView',
        'trackCart',
        'trackOrder',
    ]) {
        t.mock.method(config.tracker, method, async (request) => {
            events.push(request);
        });
    }
    await trackJourney();
    assert.equal(events.length, 4);
    assert.ok(events.every((event) => event.user.temporaryId === config.DEMO_USER_ID));
    assert.deepEqual(events[0].idPath, ['5', '5_1']);
    const product = products.find((item) => item.unique_id === events[1].productId);
    assert.ok(product);
    assert.ok(product.availability.find((item) => item.language === 'en-gb').number > 0);
    assert.equal(events[1].variantId, undefined);
    assert.equal(product.mainCategory.id, events[0].idPath[0]);
    assert.equal(product.mainCategory.subCategory.id, events[0].idPath[1]);
    const price = product.sales_price.find((item) => item.currency === 'EUR').amount;
    for (const event of events.slice(2)) {
        assert.equal(event.lineItems[0].productId, product.unique_id);
        assert.equal(event.lineItems[0].variantId, undefined);
        assert.equal(event.subtotal.amount, price * event.lineItems[0].quantity);
        assert.equal(event.lineItems[0].lineTotal, event.subtotal.amount);
    }
});

test('search requests select in-stock products, preserve paging and apply a real optional brand boost', async (t) => {
    const requests = [];
    t.mock.method(config.searcher, 'searchProducts', async (request) => {
        requests.push(request);
        return { results: [] };
    });
    await searchProducts({ term: 'headphones', page: 2 });
    await searchProductsByCategory({ categoryId: '5' });
    await searchWithCDPPersonalization({ userId: config.DEMO_USER_ID, term: 'headphones' });
    assert.equal(requests[0].skip, 10);
    for (const request of requests) {
        assert.equal(request.user.temporaryId, config.DEMO_USER_ID);
        const stock = request.filters.items.find((filter) => filter.key === 'en-gb_StockLevel');
        assert.ok(stock);
        assert.equal(stock.negated, false);
        assert.equal(stock.filterOutIfKeyIsNotFound, true);
        assert.match(stock.conditions.items[0].$type, /GreaterThanCondition/);
        assert.equal(stock.conditions.items[0].value, 0);
    }
    const modifier = requests[2].relevanceModifiers.items[0];
    assert.ok(products.some((product) => product.brand.id === modifier.brandId));
    assert.equal(modifier.brandId, 'bose');
    assert.equal(modifier.ifProductIsBrandMultiplyWeightBy, 1.5);
});

test('recommendations use the same identified user and a catalog product', async (t) => {
    let popular;
    let purchased;
    t.mock.method(config.recommender, 'recommendPopularProducts', async (request) => {
        popular = request;
        return { recommendations: [] };
    });
    t.mock.method(config.recommender, 'recommendPurchasedWithProduct', async (request) => {
        purchased = request;
        return { recommendations: [] };
    });
    await popularProducts();
    await purchasedWithProducts();
    assert.equal(popular.user.temporaryId, config.DEMO_USER_ID);
    assert.equal(purchased.user.temporaryId, config.DEMO_USER_ID);
    const product = products.find(
        (item) => item.unique_id === purchased.productAndVariantId.productId,
    );
    assert.ok(product.availability.find((item) => item.language === 'en-gb').number > 0);
    for (const request of [popular, purchased]) {
        const stock = request.filters.items.find((filter) => filter.key === 'en-gb_StockLevel');
        assert.equal(stock.filterOutIfKeyIsNotFound, true);
        assert.match(stock.conditions.items[0].$type, /GreaterThanCondition/);
        assert.equal(stock.conditions.items[0].value, 0);
    }
});

test('source and built runners load examples and fail clearly when configuration is missing', () => {
    const directory = fileURLToPath(new URL('../template/', import.meta.url));
    const env = {
        ...process.env,
        RELEWISE_DATASET_ID: '',
        RELEWISE_API_KEY: '',
        RELEWISE_SERVER_URL: '',
    };
    for (const entry of [['dist/index.js'], ['--loader', 'ts-node/esm', 'src/index.ts']]) {
        const help = spawnSync(process.execPath, [...entry, '--help'], {
            cwd: directory,
            env,
            encoding: 'utf8',
        });
        assert.equal(help.status, 0, help.stderr);
        assert.match(help.stdout, /productImportExample/);
        const failed = spawnSync(process.execPath, [...entry, 'termBasedSearchExample'], {
            cwd: directory,
            env,
            encoding: 'utf8',
        });
        assert.equal(failed.status, 1, failed.stderr);
        assert.match(failed.stderr, /Set RELEWISE_DATASET_ID/);
        assert.doesNotMatch(failed.stderr, /ERR_UNSUPPORTED_ESM_URL_SCHEME/);
    }
});
