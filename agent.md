# Copilot Instructions for AI Agents

## Project Overview

- This is a TypeScript project with a simple entry point at `src/index.ts`.
- The project is designed to integrate with the Relewise's platform for product recommendations, personalization, and search.
- **CRITICAL:** For any specific SDK usage, method signatures, or API patterns, ALWAYS verify against the official SDK source code FIRST before providing examples.
- All Relewise-related questions, doubts or clarifications regarding the Relewise Typescript SDK, classes, types etc. should be validated using this process:

### SDK Verification Process (MANDATORY)

1. **First**: Search the official SDK repository at https://github.com/Relewise/relewise-sdk-javascript for actual method signatures and usage patterns
2. **Second**: Consult the Relewise MCP server at https://mcp.relewise.com for high-level guidance
3. **Third**: Check the official Relewise documentation (https://docs.relewise.com) for conceptual understanding
4. **Fourth**: Use the examples provided in the `src/` directory of this project as implementation templates
5. **Always**: Validate any code examples against the actual SDK source before providing them

### Critical SDK Knowledge Base

**Historical Data Import Limitations (VERIFIED):**
- The `Trackable` interface only contains: `$type: string` and `custom?: Record<string, string | null>`
- Order, Cart and Product interfaces use `data?: Record<string, DataValue>` for structured custom data
- NO timestamp fields exist in `Trackable` interface - no `utcTime`, `timestamp`, or similar
- `tracker.trackOrder()` method signature does NOT include a `utcTime` parameter
- `integrator.batch()` accepts `Trackable[]` but cannot preserve historical timestamps
- All imported orders via SDK are timestamped with current import time, NOT historical dates
- Historical dates can be preserved using `data: { 'HistoricOrderDate': DataValueFactory.string(dateISO) }` for recommendation weighting
- For true historical timestamp weighing, users must contact Relewise support

**Method Signatures (VERIFIED):**
- `tracker.trackOrder()`: Parameters are `{ user, subtotal, orderNumber, lineItems, cartName?, trackingNumber?, data? }`
- `integrator.batch()`: Parameters are `(trackable: Trackable[], options?: RelewiseRequestOptions)`
- `Trackable` types include: `Order`, `ProductView`, `Cart`, etc. but without timestamp capabilities
- `Order`, `Cart` and `Product` use `data?: Record<string, DataValue>` field for custom data, accessed via `DataValueFactory`

**Field Usage Patterns (VERIFIED):**
- **`custom` field**: Available on `Trackable` base interface as `Record<string, string | null>` for simple string metadata
- **`data` field**: Available on `Order`, `Cart`, `Product`, etc. as `Record<string, DataValue>` for typed custom data
- **DataValueFactory**: Required for `data` field values - use `.string()`, `.number()`, `.boolean()`, `.multilingual()`, etc.
- **Historical Order Dates**: Use `data: { 'HistoricOrderDate': DataValueFactory.string(isoDate) }` NOT `custom`

### Common Pitfalls to Avoid

- **Never assume API signatures** - always verify in the SDK source code
- **Never use builder patterns** that don't exist in the actual SDK (e.g., `ProductDataRelevanceModifierBuilder`)
- **Always check import requirements** by looking at the actual SDK exports
- **Verify parameter types and order** from the source, not from assumptions
- **NEVER add `utcTime` or timestamp parameters** to `trackOrder()` calls - this parameter does not exist
- **NEVER claim historical timestamp support** via `integrator.batch()` - the SDK cannot preserve historical dates
- **Use `data` field correctly**: For Order/Cart/Product custom data, use `data: { 'key': DataValueFactory.string(value) }`, not `custom`
- **Don't confuse field types**: `custom` is for simple strings, `data` is for typed values via DataValueFactory
- **Always import DataValueFactory**: Required when using the `data` field in orders, carts, products, etc.
- **Always clarify SDK limitations** when discussing historical data import

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

## Example Usage

Instead of embedding full code examples here, see the following files in the `src/examples/` directory for up-to-date, runnable examples:

### Search Examples

- `src/examples/search/searchExample.ts`: Demonstrates basic product search with facets and term predictions
- `src/examples/search/searchCategoryExample.ts`: Category hierarchy search with faceted browsing
- `src/examples/search/cdpPersonalizedSearchExample.ts`: **Advanced CDP integration with commented relevance modifier examples using correct SDK syntax**

### Recommendation Examples

- `src/examples/recommendations/popularProductsExample.ts`: Popular product recommendations with real product data
- `src/examples/recommendations/purchasedWithProductExample.ts`: Collaborative filtering recommendations

### Import Examples

- `src/examples/import/productImportExample.ts`: Product data import with real data from `product_data/` folder
- `src/examples/import/historicalDataImportExample.ts`: Historical order import with proper `HistoricOrderDate` data field usage

### Shared Configuration

- `src/config/relewiseConfig.ts`: Centralized configuration eliminating boilerplate across all examples

Each example is fully documented, uses real product data, and follows verified integration patterns.

> **Important:** The CDP search example contains extensive commented relevance modifier examples with correct SDK syntax. These have been verified against the actual SDK source code.

## References

- For SDK usage, consult the official Relewise documentation.
- Always check the actual SDK type definitions in your project before accessing properties on response objects.

## Relewise SDK Source Code Reference

- The official Relewise TypeScript/JavaScript SDK is open source and available at: https://github.com/Relewise/relewise-sdk-javascript
- **MANDATORY USAGE**: Always search the SDK repository BEFORE providing any specific API usage examples
- When to consult the SDK codebase:
    - **Always** when providing method signatures, builder patterns, or API examples
    - If the official documentation is unclear, incomplete, or you need to understand the exact behavior of a builder, method, or type.
    - When you encounter unexpected behavior, errors, or need to verify the accepted values for builder methods (e.g., `basedOn` for `PopularProductsBuilder`).
    - To see the latest implementation details, available builder methods, or type definitions that may not be fully documented elsewhere.
- How to use the SDK codebase:
    - Browse the `packages/client/src` directory for all builder classes, request/response types, and utility functions.
    - Use the GitHub search to find method signatures, accepted values, and comments directly in the code (e.g., search for `basedOn` in `popularProductsBuilder.ts`).
    - Review the commit history for recent changes or bug fixes that may affect your integration.
- Where to look:
    - Builders: `packages/client/src/builders/` (especially `relevanceModifierBuilder.ts`, `searchBuilder.ts`)
    - Data contracts (types): `packages/client/src/models/data-contracts.ts`
    - Example usage: The README and test files in the SDK repo.

### Specific Examples of Required Source Code Verification

- **Relevance Modifiers**: Always check `packages/client/src/builders/relevanceModifierBuilder.ts` for exact method signatures
- **Search Builders**: Verify patterns in `packages/client/src/builders/` directory
- **Data Types**: Check `packages/client/src/models/data-contracts.ts` for type definitions
- **Factory Methods**: Look for `ValueSelectorFactory`, `DataValueFactory`, etc. usage patterns

> **Critical:** Never assume builder patterns or method signatures exist without verifying in the actual SDK source code. Many intuitive patterns (like `ProductDataRelevanceModifierBuilder`) do not exist in the actual SDK.

### Example Verification Workflow

1. **User asks for relevance modifier example**
2. **FIRST**: Search `github_repo` for `addProductDataRelevanceModifier` in `Relewise/relewise-sdk-javascript`
3. **Find actual signature**: `addProductDataRelevanceModifier(key, conditions, multiplierSelector, ...)`
4. **Verify imports needed**: `ConditionBuilder`, `DataValueFactory`, `ValueSelectorFactory`
5. **THEN provide accurate example** based on real SDK code
6. **Reference the source location** for the user's verification
