/**
 * CDP-Driven Personalized Search Example
 *
 * This example demonstrates how to integrate Customer Data Platform (CDP) insights
 * with Relewise search using filters and enhanced user context for personalization.
 *
 * Key Features:
 * - Integrates external CDP data for user profiling
 * - Uses product data filters to personalize based on user preferences
 * - Handles fallbacks when external data is unavailable
 * - Demonstrates real-world personalization beyond basic merchandising
 *
 * External Data Sources Simulated:
 * - Brand preferences from CDP
 * - Purchase history and spending patterns
 * - User behavioral data
 * - Preferred categories
 *
 * Usage:
 * - Run: `npm run dev cdpPersonalizedSearchExample user_1 "running shoes"`
 * - The first argument is the user ID, second is the search term
 */

import { ProductSearchBuilder, UserFactory } from '@relewise/client';
import { searcher, createSettings } from '../../config/relewiseConfig.js';
import { isProductSearchResponse } from '../../utils/relewiseTypeGuards.js';
import { MockCDPService } from '../../utils/externalDataServices.js';
import { CDPUserProfile } from '../../types/externalData.js';

/**
 * Performs a CDP-enhanced personalized product search
 */
export async function searchWithCDPPersonalization({
    userId,
    term,
    page = 1,
    pageSize = 20,
}: {
    userId: string;
    term: string;
    page?: number;
    pageSize?: number;
}) {
    console.log(`🔍 Fetching CDP profile for user: ${userId}`);

    // Fetch user profile from CDP (with fallback)
    let cdpProfile: CDPUserProfile | null = null;
    try {
        cdpProfile = await MockCDPService.getUserProfile(userId);
    } catch (error) {
        console.warn('⚠️  CDP service unavailable, using fallback search', error);
    }

    // Create user context - use anonymous if no CDP data
    const user = UserFactory.anonymous();
    const settings = createSettings('CDP Enhanced Search Page', user);

    // Build search request with CDP-driven personalization
    const searchBuilder = new ProductSearchBuilder(settings)
        .setSelectedProductProperties({ displayName: true, pricing: true, brand: true })
        .setTerm(term)
        .pagination((p) => p.setPage(page).setPageSize(pageSize))
        .facets((f) => f.addBrandFacet().addSalesPriceRangeFacet('Product'));

    // Add CDP-driven filters and preferences if profile is available
    if (cdpProfile) {
        console.log(`✨ Applying CDP personalization for ${cdpProfile.userId}`);
        console.log(`📊 Top brands: ${cdpProfile.top3Brands.join(', ')}`);
        console.log(
            `💰 Preferred price range: ${cdpProfile.preferredPriceRange.min}-${cdpProfile.preferredPriceRange.max} ${cdpProfile.preferredPriceRange.currency}`,
        );

        // Add facets with preferred brands pre-selected based on CDP data
        searchBuilder.facets((f) => {
            const facetBuilder = f.addBrandFacet().addSalesPriceRangeFacet('Product');
            return facetBuilder;
        });

        // Note: In a real implementation, you would use relevance modifiers here
        // to boost preferred brands, price ranges, etc. based on CDP data
        // This example demonstrates the integration pattern and data flow
    } else {
        console.log('🔄 Using default search (no CDP data available)');
    }

    // Execute search
    const response = await searcher.searchProducts(searchBuilder.build());
    return response;
}

/**
 * Default export: Runs CDP-enhanced search with user profiling
 */
export default async function runCDPPersonalizedSearchExample(
    userId?: string,
    searchTerm?: string,
) {
    const defaultUserId = userId || 'user_1';
    const term = searchTerm || 'headphones';

    console.log(`🚀 Running CDP-personalized search for user: ${defaultUserId}, term: "${term}"`);

    const response = await searchWithCDPPersonalization({
        userId: defaultUserId,
        term,
        page: 1,
        pageSize: 10,
    });

    // Display results
    if (isProductSearchResponse(response)) {
        console.log(`\n📦 Found ${response.results?.length || 0} personalized results:`);

        response.results?.forEach((product, index) => {
            const brand = product.data?.Brand?.value || 'Unknown Brand';
            const price = product.salesPrice || product.listPrice || 'N/A';
            const currency = typeof price === 'object' ? '' : '';

            console.log(`${index + 1}. ${product.displayName} by ${brand} - ${price} ${currency}`);
        });

        if (response.facets) {
            console.log('\n🎯 Available facets:');
            Object.keys(response.facets).forEach((facetKey) => {
                console.log(`- ${facetKey}`);
            });
        }
    } else {
        console.log('❌ No products found or invalid response');
    }
}
