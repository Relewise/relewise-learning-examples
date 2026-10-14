import { ProductCategorySearchBuilder } from '@relewise/client';
import { searcher, createSettings } from '../../config/relewiseConfig.js';

// This returns category entities, for example links in a search overlay.
// Use categoryBasedSearchExample to retrieve the products within a category.
export async function searchProductCategories({
    term,
    page = 1,
    pageSize = 10,
}: {
    term: string;
    page?: number;
    pageSize?: number;
}) {
    const request = new ProductCategorySearchBuilder(createSettings('Search Overlay'))
        .setTerm(term)
        .setSelectedCategoryProperties({ displayName: true, paths: true })
        .pagination((pagination) => pagination.setPage(page).setPageSize(pageSize))
        .build();

    return searcher.searchProductCategories(request);
}

export default async function runCategorySearchExample(term = 'Hi-Fi') {
    const response = await searchProductCategories({ term });
    console.log('Categories:', response?.results);
}
