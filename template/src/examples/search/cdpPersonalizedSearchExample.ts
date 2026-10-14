import { ProductSearchBuilder, UserFactory } from '@relewise/client';
import { searcher, createSettings, LANGUAGE, DEMO_USER_ID } from '../../config/relewiseConfig.js';

// An example of a profile supplied by a CDP. The brand ID matches our imported catalog.
const profile = { preferredBrandId: 'bose', brandWeight: 1.5 };

export async function searchWithCDPPersonalization({
    userId,
    term,
}: {
    userId: string;
    term: string;
}) {
    const settings = createSettings('CDP Search Page', UserFactory.byTemporaryId(userId));
    const request = new ProductSearchBuilder(settings)
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
    return searcher.searchProducts(request);
}

export default async function runCDPPersonalizedSearchExample(
    userId = DEMO_USER_ID,
    term = 'headphones',
) {
    // The fixed profile demonstrates request construction, not a real CDP lookup.
    // A boost can affect ranking, but does not guarantee a different result order.
    const response = await searchWithCDPPersonalization({ userId, term });
    console.log('Products:', response?.results);
}
