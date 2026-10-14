# Relewise quickstart

Follow one product integration from catalog import to search and recommendations. The examples use the same catalog and demo user throughout, following the [official implementation steps](https://docs.relewise.com/docs/developer/implementation-steps.html).

## 1. Set up the project

Use Node.js 22 or newer and npm. Run all commands from the generated project directory. If you are working from the repository's `template/` directory instead, run `npm install --ignore-scripts` and copy `.env.local` to `.env` first.

Edit `.env`:

```dotenv
RELEWISE_DATASET_ID=your-dataset-id
RELEWISE_API_KEY=your-api-key
RELEWISE_SERVER_URL=your-dataset-server-url
LANGUAGE=en-gb
CURRENCY=EUR
```

Copy the dataset ID and its actual server URL from My Relewise. The server URL belongs to the dataset; do not choose a different URL to switch between testing and production. Use a dedicated learning dataset because the import and tracking lessons write sample data.

Use an API key with the permissions needed by the examples you run: search and recommendations for reading results, tracking for behavioral events, and integration permissions for importing products. These examples run in Node.js. Keep keys with write permissions on the server; do not copy this `.env` or its key into browser code. See [getting started](https://docs.relewise.com/docs/developer/getting-started.html) for credentials and permissions.

List available examples without making an API request:

```sh
npm run dev -- --help
```

You can run the TypeScript source or the compiled JavaScript:

```sh
npm run dev -- termBasedSearchExample "headphones"
npm run build
npm start -- termBasedSearchExample "headphones"
```

Wait until you have imported products and checked the search index below before expecting search results. A command that fails exits unsuccessfully; empty results are a different outcome and need checking against the catalog and request.

## 2. Import the catalog

```sh
npm run dev -- productImportExample
```

Read [productImportExample.ts](src/examples/import/productImportExample.ts) alongside [product_data_example.json](product_data/product_data_example.json). The catalog contains 274 products. The importer maps stable product IDs, multilingual names, brands, category paths, prices, and stock to product updates, then sends batches through the SDK. The remaining description and image fields are used in the optional custom-data lesson.

The core examples operate on products. This catalog does not import variants. If your integration uses variants, import their IDs and properties before using them in tracking, filters, or facets.

The catalog uses language labels such as `en-gb`, `da-dk`, and `nl`, with prices in multiple currencies. It also uses language labels to distinguish markets for stock. In this sample, the numeric `<language>_StockLevel` data value (for example, `en-gb_StockLevel`) is the availability source; the search examples require it to be greater than zero. This is a sample data convention, not a general rule that language and market are the same thing. Price currency is selected independently: the defaults use English text and `en-gb` stock with EUR prices. Choose a language and currency present in the imported data.

In My Relewise, inspect an imported product. Compare its ID, display name, category path, price, and `en-gb_StockLevel` with the source JSON. The import updates the supplied products. It does not retire other products already in your dataset.

## 3. Check the search index

Open the search index for the dataset in My Relewise. Check the Products section and start with `DisplayName` as a searchable field. Add `BrandDisplayName` and `CategoryDisplayName` if you want terms to match brands and category names. Keep descriptions at a lower weight when adding them. Configure the languages used by your catalog and save the changes.

For category entity searches, also configure the Product Categories section. Category search and product search have separate entity settings. The [search index guide](https://docs.relewise.com/docs/bestpractices/search-index.html) explains weights, languages, and matching options.

Verify a product name that exists in your catalog, such as `headphones`, through the term search example. If there are no results, inspect the index, requested language and currency, and the product's stock for that language. An empty result alone does not verify a working search setup.

## 4. Track behavior with consistent IDs

```sh
npm run dev -- basicTrackingExample
```

Read [basicTrackingExample.ts](src/examples/tracking/basicTrackingExample.ts). It sends a product view, a category view, a cart, and an order using IDs from the imported catalog. The explicit sample cart contains two headphones at EUR 379.99 each, for a total of EUR 759.98. This cart stays in EUR regardless of the search currency in `.env`; in your application, use the cart's actual amounts and currency together. These are real tracking events in your learning dataset; rerunning the lesson sends more events.

Tracking, search, and recommendations explicitly use the shared `DEMO_USER_ID` constant to identify the temporary user `learning-user`. This makes the connection between an identified user's behavior and later requests visible. Use this fixed ID only for the lesson; assigning every visitor the same ID would merge their behavior.

In your application, use an anonymous user when the visitor is not identified for tracking. Use a stable temporary ID for a consenting visitor who is not logged in, and a stable authenticated ID for a logged-in customer where tracking is permitted. A temporary ID should persist across visits and orders, not be regenerated for each request. When the visitor logs in, link the temporary and authenticated identities as described in the [user documentation](https://docs.relewise.com/docs/tracking/user.html). Logging in does not replace your application's consent decisions.

A Relewise search already records its search term. Product-search click attribution relies on the identified user's search and a subsequent view of a returned product. Track a product view when the user visits the product, rather than recording a separate invented click event. Explicit search-term tracking is for searches performed outside Relewise. See [search analytics](https://docs.relewise.com/docs/myrelewise/search-analytics.html).

For browser implementations, the SDK's tracking methods accept `keepalive: true` in their request options so a request can continue when the page unloads. It does not guarantee delivery and is unnecessary for these Node.js commands. See [client-side tracking](https://docs.relewise.com/docs/developer/sdks/ts/tracking/client-side-tracking.html) and the [SDK keepalive change](https://github.com/Relewise/relewise-sdk-javascript/pull/203). Use browser-appropriate credentials, not the integration key used by the import lessons.

## 5. Search products and categories

```sh
npm run dev -- termBasedSearchExample "headphones"
npm run dev -- categoryBasedSearchExample "5"
npm run dev -- searchCategoryExample "Hi-Fi"
```

Read the corresponding files in [src/examples/search](src/examples/search):

| Example | What it teaches |
| --- | --- |
| `termBasedSearchExample` | Product search by term, with facets and pagination |
| `categoryBasedSearchExample` | A product listing page: products filtered to a category |
| `searchCategoryExample` | Category entities matching a name, for navigation |

Category `5` is Hi-Fi in the sample catalog. A category entity response is not a list of products. Use the product listing example to populate a category page with products.

Follow the builder in each file: request settings identify the user and display location; filters select eligible products; facets describe choices within the result set. For pagination or filtering experiments, change the relevant builder call directly and inspect the response. See [product search](https://docs.relewise.com/docs/developer/sdks/ts/search/product-search.html) for further examples.

## 6. Request recommendations

```sh
npm run dev -- popularProductsExample
npm run dev -- purchasedWithProductExample
```

The [popular products example](src/examples/recommendations/popularProductsExample.ts) requests popular products. The [purchased-with example](src/examples/recommendations/purchasedWithProductExample.ts) supplies a product ID from the catalog to request complementary products. Both examples use the same stock filter as search to exclude unavailable products.

A newly imported catalog has little behavioral history. Results may be empty, and running one sample journey does not guarantee a visible ranking change or a purchased-together relationship. Inspect the request, eligible products, and available behavior before expecting useful recommendations. See the [recommendation examples](https://docs.relewise.com/docs/developer/sdks/ts/recommendations/product-recommendations.html).

## 7. Keep products up to date

The initial import also shows the shape of subsequent product updates. For a simple experiment, change a supplied product's price in the JSON, rerun the import, and inspect that product in My Relewise.

For an application, distinguish two jobs:

- A delta import sends products that changed since the last successful synchronization.
- A full synchronization sends the whole catalog and separately handles products that are no longer present.

Choose the update kind deliberately. `ReplaceProvidedProperties` replaces properties supplied by the update; `UpdateAndAppend` can retain existing collection values. Neither means that products missing from the feed are removed. Read the [entity integration guide](https://docs.relewise.com/docs/developer/sdks/ts/integrations/entity-integration.html) before adapting this to your catalog lifecycle. Automatic disabling and deletion are outside this starter import.

## Optional lessons

### Favorites

After importing the catalog and completing basic tracking and search, run:

```sh
npm run dev -- favoritesExample add
npm run dev -- favoritesExample list
npm run dev -- favoritesExample remove
```

Read [favoritesExample.ts](src/examples/tracking/favoritesExample.ts). `add` marks the sample Bose headphones as a favorite for `learning-user`; `remove` sets `isFavorite` to `false`. Both then search the same user's favorites. `list` only searches, and running without an argument defaults to `add`. These commands change engagement state in your learning dataset. If a change is not visible immediately, run `list` again after processing has caught up.

The request uses an engagement filter and selects `userEngagement` so each result includes its favorite state. It shows the first ten favorites without a stock filter: saving an item is separate from whether it is currently in stock. This lesson does not implement a storefront or change recommendation ranking.

Favorites require a temporary or authenticated user ID. Anonymous users have no saved favorites; the API can fall back to popular products. In an application, check `userIsAnonymous(user)` and show an empty favorites state instead of issuing this request for an anonymous visitor. See [user engagement](https://docs.relewise.com/docs/tracking/user-engagement.html).

### Custom product data

After the core catalog import, run:

```sh
npm run dev -- customDataImportExample
```

Read [customDataImportExample.ts](src/examples/import/customDataImportExample.ts) to see two custom data types: multilingual descriptions and string image URLs. It updates those fields on the same products without replacing their names, prices, categories, or stock. In My Relewise, inspect the product's `Description` and `Image` data values. To search descriptions, also configure `Description` in the search index; importing a field alone does not make it searchable.

### Historical orders

```sh
npm run dev -- historicalDataImportExample
```

Read [historicalDataImportExample.ts](src/examples/import/historicalDataImportExample.ts) and its sample JSON first. These fictional orders use the sample catalog prices in each order's currency. A line total already includes quantity; the order subtotal sums those line totals once. Real historical imports must use the amount actually paid, not today's catalog price. This lesson uses separate sample customer identities rather than the core demo user.

Plan real historical imports around go-live and avoid overlapping them with orders already tracked live. Rerunning the lesson is not an idempotent synchronization. A custom field containing an old order date does not itself backdate tracking or establish historical weighting. Consult the [historic order import guide](https://docs.relewise.com/docs/howto/historic-order-import.html) before importing real orders.

### External profile data

```sh
npm run dev -- cdpPersonalizedSearchExample "learning-user" "headphones"
```

The optional [CDP example](src/examples/search/cdpPersonalizedSearchExample.ts) adds a relevance modifier for the sample profile's preferred brand, Bose. It prints that modifier so you can inspect the request. A boost does not guarantee a different result order. It is separate from personalization based on behavior tracked by Relewise. Read its request and sample profile before running it; it does not connect to a real customer data platform.

## Before adapting the examples

Keep the product and category IDs consistent across import, tracking, and requests. Replace the fixed demo identity with your application's identity and consent handling. Choose credentials appropriate to each server or browser component. Then validate the full flow against your own catalog and dataset. These examples teach the SDK calls; they do not implement a complete storefront or production synchronization service.
