/**
 * Example: Type-Safe Product Category Search with Relewise SDK
 *
 * This file demonstrates how to perform a product category search using the Relewise TypeScript SDK.
 *
 * Key Features:
 * - Uses the builder pattern (`ProductCategorySearchBuilder`) for request construction.
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

import { ProductCategorySearchBuilder } from '@relewise/client';
import { isProductCategorySearchResponse } from '../../utils/relewiseTypeGuards.js';
import { searcher, createSettings } from '../../config/relewiseConfig.js';

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
    Id,
}: {
    Id: string;
    page?: number;
    pageSize?: number;
}) {
    // Prepare shared settings for all requests
    const settings = createSettings('Category Search Page');

    // Build the product category search request
    const categoryBuilder = new ProductCategorySearchBuilder(settings)
        .setSelectedCategoryProperties({ displayName: true })
        .filters((f) => {
            f.addProductCategoryIdFilter('ImmediateParentOrItsParent', [Id]);
        })
        .facets((f) =>
            f.addProductCategoryHierarchyFacet('Descendants', [], { displayName: true }),
        );

    // Send the request directly to Relewise
    const response = await searcher.searchProductCategories(categoryBuilder.build());

    // Return the response for further type-safe handling
    return response ?? null;
}

/**
 * Default export: Runs a sample category search and logs results.
 *
 * This function can be run directly or imported from `index.ts`.
 * It demonstrates safe handling and output of categories and facets.
 */
export default async function runCategorySearchExample(categoryId?: string) {
    const Id = categoryId || '1';

    const resp = await searchProductCategories({
        Id,
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
