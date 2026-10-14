import { ProductSearchBuilder, UserFactory } from '@relewise/client';
import { searcher, LANGUAGE, CURRENCY, DEMO_USER_ID } from '../../config/relewiseConfig.js';

export default async function runCDPPersonalizedSearchExample(
    userId = DEMO_USER_ID,
    term = 'headphones',
) {
    // A fixed sample profile, not a real CDP lookup. The brand matches our catalog.
    const profile = { preferredBrandId: 'bose', brandWeight: 1.5 };
    const request = new ProductSearchBuilder({
        language: LANGUAGE,
        currency: CURRENCY,
        displayedAtLocation: 'CDP Search Page',
        user: UserFactory.byTemporaryId(userId),
    })
        .setTerm(term)
        .setSelectedProductProperties({ displayName: true, pricing: true, brand: true })
        .pagination((pagination) => pagination.setPage(1).setPageSize(10))
        .filters((filters) =>
            filters.addProductDataFilter(`${LANGUAGE}_StockLevel`, (conditions) =>
                conditions.addGreaterThanCondition(0),
            ),
        )
        // Boost this brand without excluding the other matching products.
        .relevanceModifiers((modifiers) =>
            modifiers.addBrandIdRelevanceModifier(profile.preferredBrandId, profile.brandWeight),
        )
        .build();

    console.log('Brand relevance modifier:', request.relevanceModifiers);
    // A boost can affect ranking, but does not guarantee a different result order.
    const response = await searcher.searchProducts(request);
    console.log('Products:', response?.results);
}
