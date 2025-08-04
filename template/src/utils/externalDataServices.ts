/**
 * External Data Services
 *
 * Mock services for simulating external data sources like CDP, Weather API, etc.
 * In a real implementation, these would call actual external APIs.
 */

import {
    CDPUserProfile,
    WeatherContext,
    SocialTrends,
    MLModelScores,
} from '../types/externalData.js';

/**
 * Mock CDP service - simulates Customer Data Platform integration
 */
export class MockCDPService {
    static async getUserProfile(userId: string): Promise<CDPUserProfile | null> {
        // Simulate API call delay
        await new Promise((resolve) => globalThis.setTimeout(resolve, 100));

        // Mock different user profiles based on userId with real product data
        const profiles: Record<string, CDPUserProfile> = {
            user_1: {
                userId: 'user_1',
                brandAffinityScores: {
                    Bose: 0.9,
                    Sony: 0.8,
                    JBL: 0.6,
                },
                top3Brands: ['Bose', 'Sony', 'JBL'],
                brandAffinityMultiplier: 1.5,
                preferredPriceRange: { min: 100, max: 500, currency: 'EUR' },
                spendingPatternMultiplier: 1.3,
                recentlyViewedButNotPurchased: [
                    '00198c54-6c62-4e08-be40-a539963985d0',
                    '01563025-4bc4-4dfd-971a-308017905f80',
                ],
                lifetimeValue: 2500,
                purchaseFrequency: 'high',
                lastPurchaseDate: new Date('2024-12-15'),
                preferredCategories: ['Hi-Fi', 'Headphones'],
                shippingCostThreshold: 15,
                nearestWarehouse: 'EU_CENTRAL',
                campaignIds: ['summer-sale-2024', 'audiophile-special'],
            },
            user_2: {
                userId: 'user_2',
                brandAffinityScores: {
                    Samsung: 0.9,
                    LG: 0.8,
                    Philips: 0.7,
                },
                top3Brands: ['Samsung', 'LG', 'Philips'],
                brandAffinityMultiplier: 1.4,
                preferredPriceRange: { min: 200, max: 1500, currency: 'EUR' },
                spendingPatternMultiplier: 1.1,
                recentlyViewedButNotPurchased: ['072489c7-9f66-4d14-89d0-408830099c9c'],
                lifetimeValue: 1800,
                purchaseFrequency: 'medium',
                lastPurchaseDate: new Date('2024-11-20'),
                preferredCategories: ['Monitors', 'Computers and accessories'],
                shippingCostThreshold: 5,
                nearestWarehouse: 'EU_WEST',
                campaignIds: ['tech-week-2024', 'monitor-deals'],
            },
            user_3: {
                userId: 'user_3',
                brandAffinityScores: {
                    Logitech: 0.9,
                    HP: 0.8,
                    Dell: 0.7,
                },
                top3Brands: ['Logitech', 'HP', 'Dell'],
                brandAffinityMultiplier: 1.2,
                preferredPriceRange: { min: 50, max: 300, currency: 'EUR' },
                spendingPatternMultiplier: 1.0,
                recentlyViewedButNotPurchased: [
                    '09b201eb-eb4d-46d5-bb40-da2d443b8406',
                    '0bc52835-3346-4b53-9b82-1ae6355eb3f1',
                ],
                lifetimeValue: 1200,
                purchaseFrequency: 'medium',
                lastPurchaseDate: new Date('2024-12-01'),
                preferredCategories: ['Peripherals', 'Computers and accessories'],
                shippingCostThreshold: 10,
                nearestWarehouse: 'EU_NORTH',
                campaignIds: ['accessories-bundle', 'ergonomic-week'],
            },
        };

        return profiles[userId] || null;
    }
}

/**
 * Mock Weather service - simulates weather API integration
 */
export class MockWeatherService {
    static async getCurrentWeather(): Promise<WeatherContext> {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 50));

        // Mock weather based on season/location
        const weatherConditions = ['hot', 'cold', 'rainy', 'snowy', 'mild'] as const;
        const randomCondition =
            weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

        return {
            category: randomCondition,
            temperature: randomCondition === 'hot' ? 35 : randomCondition === 'cold' ? -5 : 20,
            conditions: [randomCondition],
            boostMultiplier:
                randomCondition === 'hot' ? 1.6 : randomCondition === 'cold' ? 1.8 : 1.2,
        };
    }
}

/**
 * Mock Social Trends service - simulates social media API integration
 */
export class MockSocialTrendsService {
    static async getTrendingProducts(): Promise<SocialTrends> {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 200));

        return {
            trendingProductIds: ['prod_trending_1', 'prod_trending_2', 'prod_trending_3'],
            trendingBrands: ['Nike', 'Apple', 'Samsung'],
            trendingCategories: ['Tech', 'Sports', 'Fashion'],
            confidenceScore: 0.85,
        };
    }
}

/**
 * Mock ML Model service - simulates machine learning model predictions
 */
export class MockMLModelService {
    static async getProductScores(productIds: string[]): Promise<MLModelScores[]> {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 150));

        return productIds.map((productId) => ({
            productId,
            recommendationScore: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
            churnReductionScore: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
            sentimentScore: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
            popularityScore: Math.random(),
            conversionProbability: Math.random() * 0.6 + 0.3, // 0.3 to 0.9
        }));
    }
}
