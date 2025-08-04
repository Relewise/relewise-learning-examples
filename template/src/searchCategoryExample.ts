/**
 * Example: Type-Safe Product Category Search with Relewise SDK
 *
 * This file demonstrates how to perform a product category search using the Relewise TypeScript SDK.
 *
 * Key Features:
 * - Uses the builder pattern (`ProductCategorySearchBuilder`, `SearchCollectionBuilder`) for request construction.
 * - Supports pagination and facets.
 * - Handles responses with strict type guards for safety.
 * - Designed for clarity and as a template for category search scenarios.
 *
 * Usage:
 * 1. Ensure your `.env` file contains RELEWISE_DATASET_ID, RELEWISE_API_KEY, and RELEWISE_SERVER_URL.
 * 2. Build with `npx tsc` and run with `node dist/searchCategoryExample.js` or import/run from `index.ts`.
 * 3. Use this as a reference for implementing category search features.
 *
 * For more, see:
 * - https://github.com/Relewise/relewise-sdk-javascript
 * - Project's .github/copilot-instructions.md
 */

import dotenv from 'dotenv';
dotenv.config();

import {
    Searcher,
    ProductCategorySearchBuilder,
    UserFactory,
    SearchCollectionBuilder,
} from '@relewise/client';
import { isProductCategorySearchResponse } from './utils/relewiseTypeGuards.js';

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

// Instantiate the Relewise search client
const searcher = new Searcher(RELEWISE_DATASET_ID, RELEWISE_API_KEY, {
    serverUrl: RELEWISE_SERVER_URL,
});

/**
 * Performs a product category search using the Relewise SDK.
 *
 * @param {Object} params - Search parameters
 * @param {string} params.term - The search term
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.pageSize=20] - Number of categories per page
 * @returns {Promise<any>} - The category search response
 */
export async function searchProductCategories({
    term,
    page = 1,
    pageSize = 20,
}: {
    term: string;
    page?: number;
    pageSize?: number;
}) {
    // Prepare shared settings for all requests

    const settings = {
        language: LANGUAGE,
        currency: CURRENCY,
        displayedAtLocation: 'Category Search Page',
        user: UserFactory.anonymous(),
    };

    // Create a collection builder to batch requests (if needed)
    const coll = new SearchCollectionBuilder(settings);

    // Build the product category search request
    const categoryBuilder = new ProductCategorySearchBuilder(settings)
        .setTerm(term)
        .pagination((p) => p.setPage(page).setPageSize(pageSize))
        .facets((f) => {
            // Facet by immediate parent category (shows counts for each parent)
            f.addCategoryFacet('ImmediateParent');
            // Facet by category hierarchy (shows counts for ancestors)
            f.addProductCategoryHierarchyFacet('Ancestors');
        });

    coll.addRequest(categoryBuilder.build());

    // Send the batch request to Relewise MCP
    const batchResponse = await searcher.batch(coll.build());
    const responses = batchResponse?.responses ?? [];

    // Return the first response for further type-safe handling
    return responses[0] ?? null;
}

/**
 * Default export: Runs a sample category search and logs results.
 *
 * This function can be run directly or imported from `index.ts`.
 * It demonstrates safe handling and output of categories and facets.
 */
export default async function runCategorySearchExample(termArg?: string) {
    const term = termArg || 'Some Category Term';

    const resp = await searchProductCategories({
        term,
        page: 1,
        pageSize: 10,
    });

    // Output categories and facets (type-safe)
    if (resp && isProductCategorySearchResponse(resp)) {
        if ('results' in resp) {
            console.log('Categories:', resp.results);
        }
        if ('facets' in resp && resp.facets) {
            console.log('Facets:', resp.facets);
        }
    } else {
        console.log('No categories found.');
    }
}
