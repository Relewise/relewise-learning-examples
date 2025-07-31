import { ProductSearchResponse, SearchTermPredictionResponse } from '@relewise/client';

export function isProductSearchResponse(resp: unknown): resp is ProductSearchResponse {
  return (
    typeof resp === 'object' &&
    resp !== null &&
    'results' in resp &&
    Array.isArray((resp as ProductSearchResponse).results)
  );
}

export function isSearchTermPredictionResponse(resp: unknown): resp is SearchTermPredictionResponse {
  return (
    typeof resp === 'object' &&
    resp !== null &&
    'predictions' in resp &&
    Array.isArray((resp as SearchTermPredictionResponse).predictions)
  );
}