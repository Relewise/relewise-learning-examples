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

## Example Usage

Instead of embedding full code examples here, see the following files in the `src/` directory for up-to-date, runnable examples:

- `src/searchExample.ts`: Demonstrates a type-safe product search using the Relewise SDK, including term predictions and facets.
- `src/popularProductsExample.ts`: Shows how to request popular product recommendations with strict type guards and builder patterns.
- `src/productImportExample.ts`: Provides an example of importing product data into Relewise.

Each example is fully documented and follows the integration patterns described in this instructions file.

> For details, open the relevant file in your editor or view it in your repository.

## References

- For SDK usage, consult the official Relewise documentation.
- Always check the actual SDK type definitions in your project before accessing properties on response objects.

## Relewise SDK Source Code Reference

- The official Relewise TypeScript/JavaScript SDK is open source and available at: https://github.com/Relewise/relewise-sdk-javascript
- When to consult the SDK codebase:
    - If the official documentation is unclear, incomplete, or you need to understand the exact behavior of a builder, method, or type.
    - When you encounter unexpected behavior, errors, or need to verify the accepted values for builder methods (e.g., `basedOn` for `PopularProductsBuilder`).
    - To see the latest implementation details, available builder methods, or type definitions that may not be fully documented elsewhere.
- How to use the SDK codebase:
    - Browse the `src/` directory for all builder classes, request/response types, and utility functions.
    - Use the GitHub search to find method signatures, accepted values, and comments directly in the code (e.g., search for `basedOn` in `popularProductsBuilder.ts`).
    - Review the commit history for recent changes or bug fixes that may affect your integration.
- Where to look:
    - Builders: `packages/client/src/builders/`
    - Data contracts (types): `packages/client/src/models/data-contracts.ts`
    - Example usage: The README and test files in the SDK repo.

> **Tip:** Always prefer the SDK source code for the most up-to-date and precise information about method signatures, accepted values, and type safety, especially when the documentation or type definitions are ambiguous.
