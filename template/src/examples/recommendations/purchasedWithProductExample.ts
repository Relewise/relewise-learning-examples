/**
 * Example: "Purchased With Product" Recommendations with Relewise SDK
 *
 * This file demonstrates how to request product recommendations for items frequently purchased together with a given product.
 *
 * Key Features:
 * - Uses the builder pattern (`PurchasedWithProductBuilder`) for request construction.
 * - Demonstrates context-based recommendations (using a specific product ID).
 * - Handles responses with strict type guards for safety.
 * - Designed for clarity and as a template for other context-based recommendation scenarios.
 *
 * Usage:
 * 1. Ensure your `.env` file contains RELEWISE_DATASET_ID, RELEWISE_API_KEY, and RELEWISE_SERVER_URL.
 * 2. Build with `npx tsc` and run with `node dist/purchasedWithProductExample.js` or import/run from `index.ts`.
 * 3. Use this as a reference for implementing context-based recommendations.
 *
 * For more, see:
 * - https://github.com/Relewise/relewise-sdk-javascript
 * - Project's .github/copilot-instructions.md
 */

import dotenv from 'dotenv';
dotenv.config();

import { PurchasedWithProductBuilder } from '@relewise/client';
import { isProductRecommendationResponse } from '../../utils/relewiseTypeGuards.js';
import { recommender, createSettings } from '../../config/relewiseConfig.js';

/**
 * Requests recommendations for products frequently purchased with the given product.
 *
 * @param {string} productId - The product ID to base recommendations on
 * @param {number} [take=8] - Number of recommendations to return
 * @returns {Promise<any[]>} - The recommended products
 */
export async function getPurchasedWithProductRecommendations(productId: string, take: number = 8) {
    // Set up the builder and specify the context product using .product({ productId })
    const builder = new PurchasedWithProductBuilder(createSettings('Product Detail Page'))
        .product({ productId })
        .setNumberOfRecommendations(take)
        .setSelectedProductProperties({ displayName: true, pricing: true });

    const request = builder.build();
    const response = await recommender.recommendPurchasedWithProduct(request);

    if (isProductRecommendationResponse(response) && Array.isArray(response.recommendations)) {
        return response.recommendations;
    }
    return [];
}

/**
 * Default export: Runs a sample recommendation and logs results.
 *
 * This function can be run directly or imported from `index.ts`.
 * It demonstrates safe handling and output of recommended products.
 */
export default async function runPurchasedWithProductExample(productIdArg?: string) {
    const productId = productIdArg || '00198c54-6c62-4e08-be40-a539963985d0'; // Real product ID from actual data
    const recommendations = await getPurchasedWithProductRecommendations(productId);
    if (Array.isArray(recommendations) && recommendations.length > 0) {
        console.log('Purchased With Product Recommendations:', recommendations);
    } else {
        console.log('No recommendations found.');
    }
}
