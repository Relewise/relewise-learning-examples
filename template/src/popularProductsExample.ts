/**
 * Example: Popular Products Recommendation with Relewise SDK
 *
 * This file demonstrates how to use the Relewise TypeScript SDK to request popular product recommendations.
 *
 * Key Concepts:
 * - Uses the builder pattern (`PopularProductsBuilder`) to construct a request.
 * - Authenticates using environment variables (never hardcoded secrets).
 * - Handles the response with strict type guards for safety.
 * - Can be used as a template for other recommendation or search scenarios.
 *
 * Usage:
 * 1. Ensure you have a `.env` file with RELEWISE_DATASET_ID, RELEWISE_API_KEY, and RELEWISE_SERVER_URL set.
 * 2. Run `npx tsc` to build, then `node dist/popularProductsExample.js` to execute.
 * 3. Use this pattern for other Relewise requests (e.g., personalized, trending, or similar products).
 *
 * For more details, see:
 * - https://github.com/Relewise/relewise-sdk-javascript
 * - Project's .github/copilot-instructions.md
 */

import dotenv from 'dotenv';
dotenv.config();

// Import Relewise SDK classes and type guards
import { PopularProductsBuilder } from '@relewise/client';
import { isProductRecommendationResponse } from './utils/relewiseTypeGuards.js';
import { recommender, createSettings } from './config/relewiseConfig.js';

/**
 * Runs a popular products recommendation request using the Relewise SDK.
 *
 * - Builds a request for the most popular products (e.g., for a frontpage carousel).
 * - Uses the builder pattern for clarity and extensibility.
 * - Handles the response with a strict type guard.
 *
 * @returns {Promise<Array>} Array of recommended products.
 */
async function runPopularProductsExample() {
    // Build the request using the builder pattern
    // Demonstrates use of basedOn and sinceMinutesAgo
    const builder = new PopularProductsBuilder(createSettings('Frontpage'))
        .setNumberOfRecommendations(8) // How many products to recommend
        .setSelectedProductProperties({ displayName: true, pricing: true }) // Which product fields to include
        // Use basedOn to recommend popular products by purchase or view count
        .basedOn('MostPurchased') // or 'MostViewed' for most viewed products
        // Use sinceMinutesAgo to limit popularity calculation to recent activity (e.g., last 1440 minutes = 24 hours)
        .sinceMinutesAgo(1440);

    const request = builder.build();

    // Log the request for debugging and transparency
    console.log('PopularProductsRequest:', JSON.stringify(request, null, 2));

    // Send the request to Relewise and await the response
    const response = await recommender.recommendPopularProducts(request);

    // Use a type guard to safely access recommendations
    if (response && isProductRecommendationResponse(response)) {
        const recommendations = response.recommendations ?? [];
        console.log('Popular product recommendations:', recommendations);
        return recommendations;
    } else {
        console.warn('Response was not a ProductRecommendationResponse:', response);
        return [];
    }
}

// Export the function for use in other modules or scripts
export default runPopularProductsExample;
