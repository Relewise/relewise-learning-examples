import { ProductSearchBuilder } from '@relewise/client';
import { searcher, createSettings, LANGUAGE } from '../../config/relewiseConfig.js';

export async function searchProducts({
    term,
    page = 1,
    pageSize = 10,
}: {
    term: string;
    page?: number;
    pageSize?: number;
}) {
    const request = new ProductSearchBuilder(createSettings('Search Page'))
        .setTerm(term)
        .setSelectedProductProperties({ displayName: true, pricing: true, brand: true })
        .pagination((pagination) => pagination.setPage(page).setPageSize(pageSize))
        // Pass a brand ID to addBrandFacet(['bose']) to select that facet value.
        .facets((facets) => facets.addBrandFacet().addSalesPriceRangeFacet('Product'))
        // The sample imports one numeric stock field per language/market.
        .filters((filters) =>
            filters.addProductDataFilter(`${LANGUAGE}_StockLevel`, (conditions) =>
                conditions.addGreaterThanCondition(0),
            ),
        )
        .build();

    return searcher.searchProducts(request);
}

export default async function runTermBasedSearchExample(term = 'headphones') {
    const response = await searchProducts({ term });
    console.log('Products:', response?.results);
    console.log('Facets:', response?.facets);
}
