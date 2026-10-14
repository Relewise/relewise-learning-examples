import 'dotenv/config';
import { Searcher, Recommender, Tracker, UserFactory } from '@relewise/client';
import { Integrator } from '@relewise/integrations';

const { RELEWISE_DATASET_ID, RELEWISE_API_KEY, RELEWISE_SERVER_URL } = process.env;

if (!RELEWISE_DATASET_ID || !RELEWISE_API_KEY || !RELEWISE_SERVER_URL) {
    throw new Error('Set RELEWISE_DATASET_ID, RELEWISE_API_KEY and RELEWISE_SERVER_URL in .env.');
}

export const LANGUAGE = process.env.LANGUAGE || 'en-gb';
export const CURRENCY = process.env.CURRENCY || 'EUR';
export const DEMO_USER_ID = 'learning-user';

const clientOptions = { serverUrl: RELEWISE_SERVER_URL };
export const searcher = new Searcher(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);
export const recommender = new Recommender(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);
export const tracker = new Tracker(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);
export const integrator = new Integrator(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);

// The tutorial uses one fictional user so tracking and service requests can be connected.
// Real sites choose a user identity according to consent and their login/session state.
export function createSettings(
    displayedAtLocation: string,
    user = UserFactory.byTemporaryId(DEMO_USER_ID),
) {
    return { language: LANGUAGE, currency: CURRENCY, displayedAtLocation, user };
}

export { RELEWISE_DATASET_ID, RELEWISE_API_KEY, RELEWISE_SERVER_URL };
