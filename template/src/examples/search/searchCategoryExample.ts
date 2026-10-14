import { ProductCategorySearchBuilder } from '@relewise/client';
import { searcher, createSettings } from '../../config/relewiseConfig.js';

// This returns category entities, for example links in a search overlay.
// Use categoryBasedSearchExample to retrieve the products within a category.
export default async function runCategorySearchExample(term = 'Hi-Fi') {
    const request = new ProductCategorySearchBuilder(createSettings('Search Overlay'))
        .setTerm(term)
        .setSelectedCategoryProperties({ displayName: true, paths: true })
        .pagination((pagination) => pagination.setPage(1).setPageSize(10))
        .build();

    const response = await searcher.searchProductCategories(request);
    console.log('Categories:', response?.results);
}
