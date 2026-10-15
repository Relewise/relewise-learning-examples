import { ProductSearchBuilder, UserFactory } from '@relewise/client';
import {
    tracker,
    searcher,
    LANGUAGE,
    CURRENCY,
    DEMO_USER_ID,
} from '../../config/relewiseConfig.js';

export default async function favoritesExample(action = 'add') {
    if (action !== 'add' && action !== 'remove' && action !== 'list') {
        throw new Error('Use favoritesExample add, remove or list.');
    }

    // Favorites belong to an identified user. Use the same identity when tracking and searching.
    const user = UserFactory.byTemporaryId(DEMO_USER_ID);
    const productId = '0bc52835-3346-4b53-9b82-1ae6355eb3f1'; // Bose Noise Cancelling Headphones 700

    if (action !== 'list') {
        await tracker.trackProductEngagement({
            user,
            product: { productId },
            engagement: { isFavorite: action === 'add' },
        });
        console.log(`Set isFavorite to ${action === 'add'} for ${productId}.`);
    }

    const request = new ProductSearchBuilder({
        language: LANGUAGE,
        currency: CURRENCY,
        displayedAtLocation: 'Favorites Page',
        user,
    })
        .setSelectedProductProperties({ displayName: true, pricing: true, userEngagement: true })
        .pagination((pagination) => pagination.setPage(1).setPageSize(10))
        .filters((filters) => filters.addProductEngagementFilter({ isFavorite: true }))
        .build();

    const response = await searcher.searchProducts(request);
    console.log('Favorites (first page):');
    console.dir(response?.results, { depth: null });
}
