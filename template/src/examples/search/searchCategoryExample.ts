import { ProductCategorySearchBuilder, UserFactory } from '@relewise/client';
import { searcher, LANGUAGE, CURRENCY, DEMO_USER_ID } from '../../config/relewiseConfig.js';

// This returns category entities, for example links in a search overlay.
// Use categoryBasedSearchExample to retrieve the products within a category.
export default async function runCategorySearchExample(term = 'Hi-Fi') {
    const request = new ProductCategorySearchBuilder({
        language: LANGUAGE,
        currency: CURRENCY,
        displayedAtLocation: 'Search Overlay',
        user: UserFactory.byTemporaryId(DEMO_USER_ID),
    })
        .setTerm(term)
        .setSelectedCategoryProperties({ displayName: true, paths: true })
        .pagination((pagination) => pagination.setPage(1).setPageSize(10))
        .build();

    const response = await searcher.searchProductCategories(request);
    console.log('Categories:', response?.results);
}
