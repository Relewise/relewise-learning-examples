import { readFile } from 'node:fs/promises';
import { UserFactory } from '@relewise/client';
import { tracker, CURRENCY, DEMO_USER_ID } from '../../config/relewiseConfig.js';
import { ProductData } from '../../types/interfaces.js';

export default async function basicTrackingExample() {
    const user = UserFactory.byTemporaryId(DEMO_USER_ID);
    const productId = '0bc52835-3346-4b53-9b82-1ae6355eb3f1'; // Bose Noise Cancelling Headphones 700
    const file = new URL('../../../product_data/product_data_example.json', import.meta.url);
    const products: ProductData[] = JSON.parse(await readFile(file, 'utf8'));
    const product = products.find((item) => item.unique_id === productId);
    const price = product?.sales_price.find((item) => item.currency === CURRENCY);
    if (!price) {
        throw new Error(`The sample product has no price in ${CURRENCY}.`);
    }

    await tracker.trackProductCategoryView({
        idPath: ['5', '5_1'], // Hi-Fi > Headphones, as imported from the catalog.
        user,
    });
    await tracker.trackProductView({ productId, user });

    // Send the full cart whenever it changes, rather than just the added item.
    const lineItems = [{ productId, quantity: 2, lineTotal: price.amount * 2 }];
    const subtotal = { amount: price.amount * 2, currency: CURRENCY };
    await tracker.trackCart({ user, lineItems, subtotal, cartName: 'default' });

    // Real orders use the shop's stable order number. Each demo run creates a new purchase.
    await tracker.trackOrder({
        user,
        orderNumber: `learning-${Date.now()}`,
        lineItems,
        subtotal,
        cartName: 'default',
    });

    console.log(`Tracked a category view, product view, cart and order for ${DEMO_USER_ID}.`);
    // Relewise search already tracks search terms. trackSearchTerm is for an external search engine.
}
