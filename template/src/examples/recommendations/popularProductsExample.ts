import { PopularProductsBuilder } from '@relewise/client';
import { recommender, createSettings, LANGUAGE } from '../../config/relewiseConfig.js';

export default async function runPopularProductsExample() {
    const request = new PopularProductsBuilder(createSettings('Front Page'))
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
    console.log('Popular products:', response?.recommendations);
    return response?.recommendations;
}
