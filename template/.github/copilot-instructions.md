# Copilot Instructions for AI Agents

## Project Overview
- This is a TypeScript project with a simple entry point at `src/index.ts`.
- The project is designed to integrate with the Relewise MCP server for product recommendations, personalization, and search.
- All Relewise-related queries should use the MCP server at https://mcp.relewise.com.

## Key Files & Structure
- `src/index.ts`: Main entry point. Example code and integration logic should be placed here.
- `package.json`/`tsconfig.json`: Standard Node/TypeScript configuration.

## Integration Patterns
- Use the official Relewise TypeScript/JS SDK for all Relewise API interactions.
- Always authenticate using the dataset ID and API key (do not hardcode secrets; use environment variables or config files).
- For search, recommendation, or personalization, instantiate the appropriate Relewise client (`Searcher`, `Recommender`, `Tracker`).
- Follow the builder pattern for constructing search requests (see Relewise docs for `ProductSearchBuilder`).
- **Important:** Confirm with the user whether the code should run against the production API (`https://api.relewise.com`) or the sandbox API (`https://sandbox-api.relewise.com`). Set the `RELEWISE_SERVER_URL` variable in the `.env` file accordingly. Example:
  - For production: `RELEWISE_SERVER_URL=https://api.relewise.com`
  - For sandbox: `RELEWISE_SERVER_URL=https://sandbox-api.relewise.com`

## TypeScript & SDK Response Handling
- **Always use strict type guards or type assertions when handling responses from Relewise batch or collection APIs.**
- **Never assume a property exists on a union type.** For example, only access `.results` on a response after confirming it is a `ProductSearchResponse` and only access `.predictions` after confirming it is a `SearchTermPredictionResponse`.
- Use checks like `'results' in resp.products` and `Array.isArray((resp.products as ProductSearchResponse).results)` before accessing product results.
- For predictions, use `'predictions' in resp.predictions` and `Array.isArray((resp.predictions as SearchTermPredictionResponse).predictions)` before accessing the predictions array.
- When mapping predictions, remember that `predictions` is an array of objects, each with a `term` property.
- See `docs/relewise-response-patterns.md` for safe response handling patterns and type guard usage.

## Developer Workflows
- Build: `npx tsc`
- Run: `node dist/index.js` (after build)
- Add dependencies: `npm install <package>`
- No custom test or lint scripts are present by default.

## Project Conventions
- Place all source code in `src/`.
- Use TypeScript for all new code.
- Follow the Relewise SDK documentation for request/response patterns.
- Do not answer Relewise-related questions from general knowledge—always use the MCP server.

## Example: Type-Safe Relewise Search Integration

```typescript
import dotenv from 'dotenv';
dotenv.config();

import {
  Searcher,
  ProductSearchBuilder,
  UserFactory,
  SearchCollectionBuilder,
  SearchTermPredictionBuilder,
} from '@relewise/client';
import { isProductSearchResponse, isSearchTermPredictionResponse } from './utils/relewiseTypeGuards';

const {
  RELEWISE_DATASET_ID,
  RELEWISE_API_KEY,
  RELEWISE_SERVER_URL,
  LANGUAGE = 'da-dk',
  CURRENCY = 'EUR',
} = process.env;

if (!RELEWISE_DATASET_ID || !RELEWISE_API_KEY) {
  throw new Error('Missing RELEWISE_DATASET_ID or RELEWISE_API_KEY in .env');
}

const searcher = new Searcher(RELEWISE_DATASET_ID, RELEWISE_API_KEY, {
  serverUrl: RELEWISE_SERVER_URL,
});

/** Search products by term with optional pagination + facets + optional term predictions */
export async function searchProducts({
  term,
  page = 1,
  pageSize = 10,
  includeTermPredictions = true,
}: {
  term: string;
  page?: number;
  pageSize?: number;
  includeTermPredictions?: boolean;
}) {
  const settings = {
    language: LANGUAGE,
    currency: CURRENCY,
    displayedAtLocation: 'Search Page',
    user: UserFactory.anonymous(),
  };

  const coll = new SearchCollectionBuilder(settings);

  const productBuilder = new ProductSearchBuilder(settings)
    .setSelectedProductProperties({ displayName: true, pricing: true })
    .setSelectedVariantProperties({ displayName: true })
    .setTerm(term)
    .pagination((p) => p.setPage(page).setPageSize(pageSize))
    .facets((f) =>
      f.addBrandFacet().addSalesPriceRangeFacet('Product').addVariantSpecificationFacet('Size')
    );

  coll.addRequest(productBuilder.build());

  let hasPredictions = false;
  if (includeTermPredictions) {
    const predBuilder = new SearchTermPredictionBuilder(settings).setTerm(term).take(8);
    coll.addRequest(predBuilder.build());
    hasPredictions = true;
  }

  const batchResponse = await searcher.batch(coll.build());
  const responses = batchResponse?.responses ?? [];

  // Use type guards to extract the correct types
  const products = isProductSearchResponse(responses[0]) ? responses[0].results ?? [] : [];
  const facets = isProductSearchResponse(responses[0]) ? responses[0].facets ?? null : null;
  const predictions = hasPredictions && isSearchTermPredictionResponse(responses[1])
    ? responses[1].predictions?.map((p) => p.term) ?? []
    : [];

  // Log for demonstration
  console.log('Products:', products);
  if (facets) {
    console.log('Facets:', facets);
  }
  if (hasPredictions) {
    console.log('Predictions:', predictions);
  }

  // Return the results for further use
  return {
    products,
    facets,
    predictions: hasPredictions ? predictions : undefined,
  };
}
```

## References

- For SDK usage, consult the official Relewise documentation.
- Always check the actual SDK type definitions in your project before accessing properties on response objects.
