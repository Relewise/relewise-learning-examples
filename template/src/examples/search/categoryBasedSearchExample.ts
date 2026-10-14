import { ProductSearchBuilder, UserFactory } from '@relewise/client';
import { searcher, LANGUAGE, CURRENCY, DEMO_USER_ID } from '../../config/relewiseConfig.js';

// A product listing page searches products in a category, without a search term.
export default async function runCategoryBasedSearchExample(categoryId = '5') {
    const request = new ProductSearchBuilder({
        language: LANGUAGE,
        currency: CURRENCY,
        displayedAtLocation: 'Category Page',
        user: UserFactory.byTemporaryId(DEMO_USER_ID),
    })
        .setSelectedProductProperties({ displayName: true, pricing: true, brand: true })
        .pagination((pagination) => pagination.setPage(1).setPageSize(12))
        .facets((facets) => facets.addBrandFacet().addSalesPriceRangeFacet('Product'))
        .filters((filters) =>
            filters
                // Ancestor includes products in subcategories too.
                .addProductCategoryIdFilter('Ancestor', categoryId)
                .addProductDataFilter(`${LANGUAGE}_StockLevel`, (conditions) =>
                    conditions.addGreaterThanCondition(0),
                ),
        )
        // Keep relevance as the secondary sort when prices are equal.
        .sorting((sorting) =>
            sorting.sortByProductAttribute('SalesPrice', 'Ascending', (then) =>
                then.sortByProductRelevance(),
            ),
        )
        .build();

    const response = await searcher.searchProducts(request);
    console.log('Products in category:', response?.results);
    console.log('Facets:', response?.facets);
}
