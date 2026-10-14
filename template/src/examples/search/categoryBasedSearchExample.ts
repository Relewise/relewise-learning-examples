import { ProductSearchBuilder } from '@relewise/client';
import { searcher, createSettings, LANGUAGE } from '../../config/relewiseConfig.js';

// A product listing page searches products in a category, without a search term.
export async function searchProductsByCategory({
    categoryId,
    page = 1,
    pageSize = 12,
}: {
    categoryId: string;
    page?: number;
    pageSize?: number;
}) {
    const request = new ProductSearchBuilder(createSettings('Category Page'))
        .setSelectedProductProperties({ displayName: true, pricing: true, brand: true })
        .pagination((pagination) => pagination.setPage(page).setPageSize(pageSize))
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

    return searcher.searchProducts(request);
}

export default async function runCategoryBasedSearchExample(categoryId = '5') {
    const response = await searchProductsByCategory({ categoryId });
    console.log('Products in category:', response?.results);
    console.log('Facets:', response?.facets);
}
