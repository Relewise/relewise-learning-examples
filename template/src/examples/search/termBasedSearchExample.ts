/**
 * Example: Term-Based Product Search with Relewise SDK
 *
 * This file demonstrates how to perform a term-based product search using the Relewise TypeScript SDK.
 *
 * Key Features:
 * - Uses the builder pattern (`ProductSearchBuilder`, `SearchCollectionBuilder`) for request construction.
 * - Supports pagination, facets, and search term predictions in a single batch request.
 * - Handles all responses with strict type guards for safety and future-proofing.
 * - Designed for clarity, extensibility, and as a template for other search scenarios.
 *
 * Usage:
 * 1. Ensure your `.env` file contains RELEWISE_DATASET_ID, RELEWISE_API_KEY, and RELEWISE_SERVER_URL.
 * 2. Build with `npx tsc` and run with `node dist/termBasedSearchExample.js` or import/run from `index.ts`.
 * 3. Use this as a reference for implementing other Relewise-powered search or prediction features.
 *
 * For more, see:
 * - https://github.com/Relewise/relewise-sdk-javascript
 * - Project's .github/copilot-instructions.md
 */

import dotenv from 'dotenv';
dotenv.config();

import {
    ProductSearchBuilder,
    SearchCollectionBuilder,
    SearchTermPredictionBuilder,
    DataValueFactory,
} from '@relewise/client';
import {
    isProductSearchResponse,
    isSearchTermPredictionResponse,
} from '../../utils/relewiseTypeGuards.js';
import { searcher, createSettings } from '../../config/relewiseConfig.js';

/**
 * Performs a product search with optional term predictions using the Relewise SDK.
 *
 * @param {Object} params - Search parameters
 * @param {string} params.term - The search term
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.pageSize=20] - Number of products per page
 * @param {boolean} [params.includeTermPredictions=true] - Whether to include search term predictions
 * @returns {Promise<{products: any, predictions: any}>} - The search and prediction responses
 */
export async function searchProducts({
    term,
    page = 1,
    pageSize = 20,
    includeTermPredictions = true,
}: {
    term: string;
    page?: number;
    pageSize?: number;
    includeTermPredictions?: boolean;
}) {
    // Prepare shared settings for all requests
    const settings = createSettings('Search Page');

    // Create a collection builder to batch multiple requests
    const coll = new SearchCollectionBuilder(settings);

    // Build the product search request
    const productBuilder = new ProductSearchBuilder(settings)
        .setSelectedProductProperties({ displayName: true, pricing: true })
        .setTerm(term)
        .pagination((p) => p.setPage(page).setPageSize(pageSize))
        .facets((f) =>
            f
                .addBrandFacet()
                .addSalesPriceRangeFacet('Product')
                .addVariantSpecificationFacet('Size'),
        )
        // Exclude sold-out products using a product data filter
        .filters((fb) =>
            fb.addProductDataFilter(
                'SoldOut',
                (cb) => cb.addEqualsCondition(DataValueFactory.string('false')),
                false,
                false,
                true,
            ),
        );

    coll.addRequest(productBuilder.build());

    // Optionally add a search term prediction request
    let hasPredictions = false;
    if (includeTermPredictions) {
        const predBuilder = new SearchTermPredictionBuilder(settings).setTerm(term).take(8);
        coll.addRequest(predBuilder.build());
        hasPredictions = true;
    }

    // Send the batch request to Relewise MCP
    const batchResponse = await searcher.batch(coll.build());
    const responses = batchResponse?.responses ?? [];

    // Return both responses for further type-safe handling
    return hasPredictions
        ? { products: responses[0] ?? null, predictions: responses[1] ?? null }
        : { products: responses[0] ?? null, predictions: undefined };
}

/**
 * Default export: Runs a sample term-based search and logs results.
 *
 * This function can be run directly or imported from `index.ts`.
 * It demonstrates safe handling and output of products, facets, and predictions.
 */
export default async function runTermBasedSearchExample(termArg?: string) {
    const term = termArg || 'Some Search Term';

    const resp = await searchProducts({
        term,
        page: 1,
        pageSize: 10,
        includeTermPredictions: true,
    });

    // Output products and facets (type-safe)
    if (isProductSearchResponse(resp.products)) {
        console.log('Products:', resp.products.results);
        if (resp.products.facets) {
            console.log('Facets:', resp.products.facets);
        }
    } else {
        console.log('No products found.');
    }

    // Output predictions (type-safe)
    if (isSearchTermPredictionResponse(resp.predictions)) {
        console.log(
            'Predictions:',
            resp.predictions.predictions?.map((p) => p.term),
        );
    } else if (resp.predictions) {
        console.log('Predictions:', resp.predictions);
    }
}
