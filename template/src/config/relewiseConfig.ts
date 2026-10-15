import 'dotenv/config';
import { Searcher, Recommender, Tracker } from '@relewise/client';
import { Integrator } from '@relewise/integrations';

const { RELEWISE_DATASET_ID, RELEWISE_API_KEY, RELEWISE_SERVER_URL } = process.env;

if (!RELEWISE_DATASET_ID || !RELEWISE_API_KEY || !RELEWISE_SERVER_URL) {
    throw new Error('Set RELEWISE_DATASET_ID, RELEWISE_API_KEY and RELEWISE_SERVER_URL in .env.');
}

export const LANGUAGE = process.env.LANGUAGE || 'en-gb';
export const CURRENCY = process.env.CURRENCY || 'EUR';
// Use this shared fictional identity only for the lesson, not for real visitors.
export const DEMO_USER_ID = 'learning-user';

const clientOptions = { serverUrl: RELEWISE_SERVER_URL };
export const searcher = new Searcher(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);
export const recommender = new Recommender(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);
export const tracker = new Tracker(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);
export const integrator = new Integrator(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);

export { RELEWISE_DATASET_ID, RELEWISE_API_KEY, RELEWISE_SERVER_URL };
