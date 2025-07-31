# Relewise SDK: Common Response Patterns

## Product Search

**Type:** `ProductSearchResponse`

```typescript
{
  results?: ProductResult[] | null;
  facets?: ProductFacetResult | null;
  // ...other fields
}
```

**How to safely access products:**
```typescript
import { isProductSearchResponse } from '../src/utils/relewiseTypeGuards';

if (isProductSearchResponse(response)) {
  const products = response.results;
  // Use products array
}
```

## Search Term Prediction

**Type:** `SearchTermPredictionResponse`

```typescript
{
  predictions?: SearchTermPredictionResult[] | null;
  // ...other fields
}
```

**How to safely access predictions:**
```typescript
import { isSearchTermPredictionResponse } from '../src/utils/relewiseTypeGuards';

if (isSearchTermPredictionResponse(response)) {
  const predictions = response.predictions;
  // Use predictions array
}
```

## General Tips

- Always use type guards before accessing properties on union types.
- When in doubt, log the full response and compare with the SDK type definitions.