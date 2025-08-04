/**
 * External Data Integration Types
 *
 * Types for integrating external data sources (CDP, ML models, etc.) with Relewise search
 */

export interface CDPUserProfile {
    userId: string;
    temporaryId?: string;
    brandAffinityScores: {
        [brandName: string]: number; // 0.0 to 1.0 score
    };
    top3Brands: string[];
    brandAffinityMultiplier: number; // 1.0 to 2.0
    preferredPriceRange: {
        min: number;
        max: number;
        currency: string;
    };
    spendingPatternMultiplier: number;
    recentlyViewedButNotPurchased: string[]; // product IDs
    lifetimeValue: number;
    purchaseFrequency: 'low' | 'medium' | 'high';
    lastPurchaseDate: Date;
    preferredCategories: string[];
    shippingCostThreshold: number;
    nearestWarehouse: string;
    campaignIds?: string[]; // Active campaign IDs for this user
}

export interface WeatherContext {
    category: 'hot' | 'cold' | 'rainy' | 'snowy' | 'mild';
    temperature: number;
    conditions: string[];
    boostMultiplier: number;
}

export interface SocialTrends {
    trendingProductIds: string[];
    trendingBrands: string[];
    trendingCategories: string[];
    confidenceScore: number;
}

export interface LocalEvents {
    categories: string[]; // event types that might drive product demand
    startDate: Date;
    endDate: Date;
    estimatedAttendance: number;
}

export interface MLModelScores {
    productId: string;
    recommendationScore: number; // 0.0 to 1.0
    churnReductionScore: number; // 0.0 to 1.0
    sentimentScore: number; // 0.0 to 1.0
    popularityScore: number; // 0.0 to 1.0
    conversionProbability: number; // 0.0 to 1.0
}

export interface ExternalDataContext {
    cdpProfile?: CDPUserProfile;
    weather?: WeatherContext;
    socialTrends?: SocialTrends;
    localEvents?: LocalEvents;
    mlScores?: MLModelScores[];
}
