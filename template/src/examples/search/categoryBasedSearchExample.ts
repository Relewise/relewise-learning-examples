/**
 * Example: Category-Based Product Search for Product Listing Pages (PLP)
 *
 * This file demonstrates how to implement category-based product search for Product Listing Pages
 * using the Relewise TypeScript SDK.
 *
 * Key Features:
 * - Category-specific product filtering and search
 * - Category hierarchy navigation with breadcrumbs
 * - Category-relevant facets (brands, specs, pricing within category)
 * - Supports pagination and sorting options
 * - Optional term filtering within category
 * - Designed for Product Listing Page (PLP) implementations
 *
 * Usage:
 * 1. Ensure your `.env` file contains RELEWISE_DATASET_ID, RELEWISE_API_KEY, and RELEWISE_SERVER_URL.
 * 2. Build with `npx tsc` and run with `node dist/categoryBasedSearchExample.js` or import/run from `index.ts`.
 * 3. Use this as a reference for implementing category pages and PLP functionality.
 *
 * For more, see:
 * - https://github.com/Relewise/relewise-sdk-javascript
 * - Project's .github/copilot-instructions.md
 */

import dotenv from 'dotenv';
dotenv.config();

import { ProductSearchBuilder, SearchCollectionBuilder, DataValueFactory } from '@relewise/client';
import { isProductSearchResponse } from '../../utils/relewiseTypeGuards.js';
import { searcher, createSettings } from '../../config/relewiseConfig.js';

/**
 * Performs a category-based product search suitable for Product Listing Pages (PLP).
 *
 * @param {Object} params - Search parameters
 * @param {string[]} params.categoryPath - Array of category IDs representing the hierarchy path
 * @param {string} [params.term] - Optional search term to filter within category
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.pageSize=24] - Number of products per page (typical for PLP)
 * @param {string} [params.sortBy='Relevance'] - Sort option: 'Relevance', 'Price_Asc', 'Price_Desc', 'Name'
 * @returns {Promise<{products: any, categoryInfo: any}>} - The search response with category context
 */
export async function searchProductsByCategory({
    categoryPath,
    term,
    page = 1,
    pageSize = 24,
    sortBy = 'Relevance',
}: {
    categoryPath: string[];
    term?: string;
    page?: number;
    pageSize?: number;
    sortBy?: 'Relevance' | 'Price_Asc' | 'Price_Desc' | 'Name';
}) {
    // Prepare shared settings for all requests
    const settings = createSettings('Category PLP');

    // Create a collection builder to batch multiple requests
    const coll = new SearchCollectionBuilder(settings);

    // Build the category-based product search request
    const productBuilder = new ProductSearchBuilder(settings)
        .setSelectedProductProperties({
            displayName: true,
            pricing: true,
            categoryPaths: true,
            brand: true,
        })
        .pagination((p) => p.setPage(page).setPageSize(pageSize))
        .facets((f) =>
            f
                .addBrandFacet()
                .addSalesPriceRangeFacet('Product')
                .addVariantSpecificationFacet('Size')
                .addVariantSpecificationFacet('Color')
                .addProductDataBooleanValueFacet('OnSale', 'Product'),
        )
        // Filter by category hierarchy
        .filters((fb) => {
            // Add category path filter - using 'Ancestor' to match products in any subcategory
            fb.addProductCategoryIdFilter('Ancestor', categoryPath);

            // Exclude sold-out products
            fb.addProductDataFilter(
                'SoldOut',
                (cb) => cb.addEqualsCondition(DataValueFactory.string('false')),
                false,
                false,
                true,
            );

            return fb;
        });

    // Add optional term filtering within category
    if (term && term.trim()) {
        productBuilder.setTerm(term.trim());
    }

    // Apply sorting
    switch (sortBy) {
        case 'Price_Asc':
            productBuilder.sorting((s) => s.sortByProductAttribute('SalesPrice', 'Ascending'));
            break;
        case 'Price_Desc':
            productBuilder.sorting((s) => s.sortByProductAttribute('SalesPrice', 'Descending'));
            break;
        case 'Name':
            productBuilder.sorting((s) => s.sortByProductAttribute('DisplayName', 'Ascending'));
            break;
        case 'Relevance':
        default:
            productBuilder.sorting((s) => s.sortByProductRelevance('Descending'));
            break;
    }

    coll.addRequest(productBuilder.build());

    // Send the batch request to Relewise
    const batchResponse = await searcher.batch(coll.build());
    const responses = batchResponse?.responses ?? [];

    // Return the response with category context
    return {
        products: responses[0] ?? null,
        categoryInfo: {
            categoryPath,
            currentCategory: categoryPath[categoryPath.length - 1],
            breadcrumbs: categoryPath,
            appliedTerm: term,
            sortBy,
            page,
            pageSize,
        },
    };
}

/**
 * Helper function to create category breadcrumbs for navigation
 */
export function createCategoryBreadcrumbs(
    categoryPath: string[],
    categoryNames?: Record<string, string>,
) {
    return categoryPath.map((categoryId, index) => ({
        id: categoryId,
        name: categoryNames?.[categoryId] || `Category ${categoryId}`,
        path: categoryPath.slice(0, index + 1),
        isLast: index === categoryPath.length - 1,
    }));
}

/**
 * Helper function to build category filter URLs for PLP navigation
 */
export function buildCategoryUrl(
    basePath: string,
    categoryPath: string[],
    additionalParams?: Record<string, string>,
) {
    const params = new URLSearchParams();

    // Add category path
    if (categoryPath.length > 0) {
        params.set('category', categoryPath.join('/'));
    }

    // Add additional parameters (page, sort, filters, etc.)
    if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
    }

    return `${basePath}?${params.toString()}`;
}

/**
 * Default export: Runs a sample category-based search and logs results.
 *
 * This function demonstrates typical PLP usage with category filtering,
 * pagination, and sorting options.
 */
export default async function runCategoryBasedSearchExample(categoryIdArg?: string) {
    // Use provided category ID or default to Hi-Fi category from sample data
    const categoryId = categoryIdArg || '5';
    const categoryPath = [categoryId]; // For nested categories: ['1', '5', '10']

    console.log('🏷️  Category-Based Product Search Example');
    console.log('==========================================');
    console.log(`Category Path: ${categoryPath.join(' > ')}`);
    console.log('');

    try {
        // Example 1: Basic category search
        console.log('📋 Basic Category Search:');
        const basicResults = await searchProductsByCategory({
            categoryPath,
            page: 1,
            pageSize: 12,
            sortBy: 'Relevance',
        });

        if (isProductSearchResponse(basicResults.products)) {
            console.log(`✅ Found ${basicResults.products.hits} products in category`);
            console.log(
                `📄 Showing page ${basicResults.categoryInfo.page} (${basicResults.categoryInfo.pageSize} per page)`,
            );

            // Display first few products
            const products = basicResults.products.results?.slice(0, 3) || [];
            products.forEach((product: any, index: number) => {
                console.log(
                    `   ${index + 1}. ${product.displayName || 'Unnamed Product'} - ${product.salesPrice || 'No price'}`,
                );
            });

            // Display available facets
            if (basicResults.products.facets?.items?.length) {
                console.log('\n🔍 Available Facets:');
                basicResults.products.facets.items.forEach((facet: any) => {
                    console.log(`   - ${facet.field}: ${facet.available?.length || 0} options`);
                });
            }
        } else {
            console.log('❌ No products found in this category');
        }

        // Example 2: Category search with term filtering
        console.log('\n🔍 Category Search with Term Filter:');
        const termResults = await searchProductsByCategory({
            categoryPath,
            term: 'wireless',
            page: 1,
            pageSize: 12,
            sortBy: 'Relevance',
        });

        if (isProductSearchResponse(termResults.products)) {
            console.log(
                `✅ Found ${termResults.products.hits} products matching "wireless" in category`,
            );
        } else {
            console.log('❌ No products found matching "wireless" in this category');
        }

        // Example 3: Category search with price sorting
        console.log('\n💰 Category Search Sorted by Price (Low to High):');
        const priceResults = await searchProductsByCategory({
            categoryPath,
            page: 1,
            pageSize: 5,
            sortBy: 'Price_Asc',
        });

        if (isProductSearchResponse(priceResults.products)) {
            console.log(`✅ Found ${priceResults.products.hits} products sorted by price`);
            const products = priceResults.products.results?.slice(0, 3) || [];
            products.forEach((product: any, index: number) => {
                const price = product.salesPrice ? `€${product.salesPrice}` : 'No price';
                console.log(
                    `   ${index + 1}. ${product.displayName || 'Unnamed Product'} - ${price}`,
                );
            });
        }

        // Example 4: Demonstrate breadcrumb generation
        console.log('\n🧭 Category Breadcrumbs:');
        const breadcrumbs = createCategoryBreadcrumbs(categoryPath, {
            '5': 'Hi-Fi',
            '10': 'Headphones',
            '15': 'Wireless Headphones',
        });

        const breadcrumbText = breadcrumbs
            .map((crumb) => (crumb.isLast ? `**${crumb.name}**` : crumb.name))
            .join(' > ');
        console.log(`   ${breadcrumbText}`);

        // Example 5: Demonstrate URL building for PLP navigation
        console.log('\n🔗 PLP Navigation URLs:');
        console.log(`   Category Page: ${buildCategoryUrl('/products', categoryPath)}`);
        console.log(
            `   With Search: ${buildCategoryUrl('/products', categoryPath, { q: 'wireless', page: '1' })}`,
        );
        console.log(
            `   Sorted by Price: ${buildCategoryUrl('/products', categoryPath, { sort: 'price_asc', page: '1' })}`,
        );
    } catch (error) {
        console.error('❌ Category search failed:', error);
        console.log('\nTroubleshooting:');
        console.log('1. Verify category ID exists in your imported data');
        console.log('2. Check My Relewise admin panel → Entities → Product Categories');
        console.log('3. Ensure search index includes category fields');
        console.log('4. Try with category ID "5" (Hi-Fi) from sample data');
    }
}

// Handle direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
    const categoryId = process.argv[2];
    runCategoryBasedSearchExample(categoryId).catch(console.error);
}
