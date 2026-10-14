import { ProductSearchBuilder } from '@relewise/client';
import { searcher, createSettings, LANGUAGE } from '../../config/relewiseConfig.js';

export default async function runTermBasedSearchExample(term = 'headphones') {
    const request = new ProductSearchBuilder(createSettings('Search Page'))
        .setTerm(term)
        .setSelectedProductProperties({ displayName: true, pricing: true, brand: true })
        .pagination((pagination) => pagination.setPage(1).setPageSize(10))
        // Pass a brand ID to addBrandFacet(['bose']) to select that facet value.
        .facets((facets) => facets.addBrandFacet().addSalesPriceRangeFacet('Product'))
        // The sample imports one numeric stock field per language/market.
        .filters((filters) =>
            filters.addProductDataFilter(`${LANGUAGE}_StockLevel`, (conditions) =>
                conditions.addGreaterThanCondition(0),
            ),
        )
        .build();

    const response = await searcher.searchProducts(request);
    console.log('Products:', response?.results);
    console.log('Facets:', response?.facets);
}
