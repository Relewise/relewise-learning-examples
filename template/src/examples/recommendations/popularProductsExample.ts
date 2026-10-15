import { PopularProductsBuilder, UserFactory } from '@relewise/client';
import { recommender, LANGUAGE, CURRENCY, DEMO_USER_ID } from '../../config/relewiseConfig.js';

export default async function runPopularProductsExample() {
    const request = new PopularProductsBuilder({
        language: LANGUAGE,
        currency: CURRENCY,
        displayedAtLocation: 'Front Page',
        user: UserFactory.byTemporaryId(DEMO_USER_ID),
    })
        .setNumberOfRecommendations(8)
        .setSelectedProductProperties({ displayName: true, pricing: true })
        .basedOn('MostPurchased')
        .sinceMinutesAgo(30 * 24 * 60)
        .filters((filters) =>
            filters.addProductDataFilter(`${LANGUAGE}_StockLevel`, (conditions) =>
                conditions.addGreaterThanCondition(0),
            ),
        )
        .build();

    const response = await recommender.recommendPopularProducts(request);
    // A new dataset may have no recommendations until it has enough purchase activity.
    console.log('Popular products:');
    console.dir(response?.recommendations, { depth: null });
    return response?.recommendations;
}
