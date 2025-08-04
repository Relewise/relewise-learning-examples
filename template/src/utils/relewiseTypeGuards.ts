import {
    ProductCategorySearchResponse,
    ProductRecommendationResponse,
    ProductSearchResponse,
    SearchTermPredictionResponse,
} from '@relewise/client';

export function isProductSearchResponse(resp: unknown): resp is ProductSearchResponse {
    return (
        typeof resp === 'object' &&
        resp !== null &&
        'results' in resp &&
        Array.isArray((resp as ProductSearchResponse).results)
    );
}

export function isSearchTermPredictionResponse(
    resp: unknown,
): resp is SearchTermPredictionResponse {
    return (
        typeof resp === 'object' &&
        resp !== null &&
        'predictions' in resp &&
        Array.isArray((resp as SearchTermPredictionResponse).predictions)
    );
}

export function isProductRecommendationResponse(
    resp: unknown,
): resp is ProductRecommendationResponse {
    return (
        typeof resp === 'object' &&
        resp !== null &&
        'recommendations' in resp &&
        Array.isArray((resp as ProductRecommendationResponse).recommendations)
    );
}

/**
 * Checks if the given response is a ProductCategorySearchResponse.
 */
export function isProductCategorySearchResponse(
    resp: unknown,
): resp is ProductCategorySearchResponse {
    return (
        typeof resp === 'object' &&
        resp !== null &&
        'results' in resp &&
        Array.isArray((resp as ProductCategorySearchResponse).results)
    );
}
