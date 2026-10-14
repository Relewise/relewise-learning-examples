import { PurchasedWithProductBuilder } from '@relewise/client';
import { recommender, createSettings, LANGUAGE } from '../../config/relewiseConfig.js';

export async function getPurchasedWithProductRecommendations(productId: string, take = 8) {
    const request = new PurchasedWithProductBuilder(createSettings('Product Details Page'))
        .product({ productId })
        .setNumberOfRecommendations(take)
        .setSelectedProductProperties({ displayName: true, pricing: true })
        .filters((filters) =>
            filters.addProductDataFilter(`${LANGUAGE}_StockLevel`, (conditions) =>
                conditions.addGreaterThanCondition(0),
            ),
        )
        .build();

    const response = await recommender.recommendPurchasedWithProduct(request);
    return response?.recommendations;
}

export default async function runPurchasedWithProductExample(
    productId = '0bc52835-3346-4b53-9b82-1ae6355eb3f1',
) {
    const recommendations = await getPurchasedWithProductRecommendations(productId);
    // This ID is in the sample catalog. Co-purchase results also need order history.
    console.log('Products purchased together:', recommendations);
}
