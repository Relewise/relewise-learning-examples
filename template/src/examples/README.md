# Example map

Follow [QUICKSTART.md](../../QUICKSTART.md) for setup and the order to run these examples. Commands run from the project root with `npm run dev -- <example>` or, after building, `npm start -- <example>`.

| Example | Source | Role in the journey |
| --- | --- | --- |
| `productImportExample` | [Product import](import/productImportExample.ts) | Map the supplied catalog to product updates |
| `basicTrackingExample` | [Behavioral tracking](tracking/basicTrackingExample.ts) | Track catalog IDs with the shared demo user |
| `termBasedSearchExample` | [Term search](search/termBasedSearchExample.ts) | Search products with facets and pagination |
| `categoryBasedSearchExample` | [Product listing](search/categoryBasedSearchExample.ts) | Find products in a category |
| `searchCategoryExample` | [Category search](search/searchCategoryExample.ts) | Find category entities by name |
| `popularProductsExample` | [Popular products](recommendations/popularProductsExample.ts) | Request popular products |
| `purchasedWithProductExample` | [Purchased with](recommendations/purchasedWithProductExample.ts) | Request products bought with a catalog product |
| `historicalDataImportExample` | [Historical orders](import/historicalDataImportExample.ts) | Optional: map existing orders to tracking events |
| `cdpPersonalizedSearchExample` | [External preference](search/cdpPersonalizedSearchExample.ts) | Optional: apply a sample profile's brand preference |

Shared configuration lives in `src/config/relewiseConfig.ts`. Keep the SDK request in the example so readers can understand it without following a chain of wrappers.
