import dotenv from 'dotenv';
dotenv.config();

import {
  Searcher,
  ProductSearchBuilder,
  UserFactory,
  SearchCollectionBuilder,
  SearchTermPredictionBuilder,
} from '@relewise/client';
import { isProductSearchResponse, isSearchTermPredictionResponse } from './utils/relewiseTypeGuards';

const {
  RELEWISE_DATASET_ID,
  RELEWISE_API_KEY,
  RELEWISE_SERVER_URL,
  LANGUAGE = 'da-dk',
  CURRENCY = 'EUR',
} = process.env;

if (!RELEWISE_DATASET_ID || !RELEWISE_API_KEY) {
  throw new Error('Missing RELEWISE_DATASET_ID or RELEWISE_API_KEY in .env');
}

const searcher = new Searcher(RELEWISE_DATASET_ID, RELEWISE_API_KEY, {
  serverUrl: RELEWISE_SERVER_URL,
});

/** Search products by term with optional pagination + facets + optional term predictions */
export async function searchProducts({
  term,
  page = 1,
  pageSize = 20,
  includeTermPredictions = true,
}: {
  term: string;
  page?: number;
  pageSize?: number;
  includeTermPredictions?: boolean;
}) {
  const settings = {
    language: LANGUAGE,
    currency: CURRENCY,
    displayedAtLocation: 'Search Page',
    user: UserFactory.anonymous(),
  };

  const coll = new SearchCollectionBuilder(settings);

  const productBuilder = new ProductSearchBuilder(settings)
    .setSelectedProductProperties({ displayName: true, pricing: true })
    .setSelectedVariantProperties({ displayName: true })
    .setTerm(term)
    .pagination((p) => p.setPage(page).setPageSize(pageSize))
    .facets((f) =>
      f.addBrandFacet().addSalesPriceRangeFacet('Product').addVariantSpecificationFacet('Size')
    );

  coll.addRequest(productBuilder.build());

  let hasPredictions = false;
  if (includeTermPredictions) {
    const predBuilder = new SearchTermPredictionBuilder(settings).setTerm(term).take(8);
    coll.addRequest(predBuilder.build());
    hasPredictions = true;
  }

  const batchResponse = await searcher.batch(coll.build());
  const responses = batchResponse?.responses ?? [];

  return hasPredictions
    ? { products: responses[0] ?? null, predictions: responses[1] ?? null }
    : { products: responses[0] ?? null, predictions: undefined };
}

/** Default export: makes it runnable from index.ts */
export default async function runSearchExample(termArg?: string) {
  const term = termArg || '<ADD-YOUR-SEARCHTERM HERE>';

  const resp = await searchProducts({ term, page: 1, pageSize: 10, includeTermPredictions: true });

  // Output products and facets (type-safe)
  if (isProductSearchResponse(resp.products)) {
    console.log('Products:', resp.products.results);
    if (resp.products.facets) {
      console.log('Facets:', resp.products.facets);
    }
  } else {
    console.log('No products found.');
  }

  // Output predictions (type-safe)
  if (isSearchTermPredictionResponse(resp.predictions)) {
    console.log('Predictions:', resp.predictions.predictions?.map((p) => p.term));
  } else if (resp.predictions) {
    console.log('Predictions:', resp.predictions);
  }
}