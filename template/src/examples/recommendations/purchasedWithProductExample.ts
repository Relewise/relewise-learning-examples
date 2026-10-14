import { PurchasedWithProductBuilder, UserFactory } from '@relewise/client';
import { recommender, LANGUAGE, CURRENCY, DEMO_USER_ID } from '../../config/relewiseConfig.js';

export default async function runPurchasedWithProductExample(
    productId = '0bc52835-3346-4b53-9b82-1ae6355eb3f1',
) {
    const request = new PurchasedWithProductBuilder({
        language: LANGUAGE,
        currency: CURRENCY,
        displayedAtLocation: 'Product Details Page',
        user: UserFactory.byTemporaryId(DEMO_USER_ID),
    })
        .product({ productId })
        .setNumberOfRecommendations(8)
        .setSelectedProductProperties({ displayName: true, pricing: true })
        .filters((filters) =>
            filters.addProductDataFilter(`${LANGUAGE}_StockLevel`, (conditions) =>
                conditions.addGreaterThanCondition(0),
            ),
        )
        .build();

    const response = await recommender.recommendPurchasedWithProduct(request);
    // This catalog ID is in stock. Co-purchase results also need order history.
    console.log('Products purchased together:', response?.recommendations);
}
