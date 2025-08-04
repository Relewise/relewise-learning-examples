/**
 * Shared Relewise Configuration
 *
 * This file provides shared configuration and client instances for all Relewise examples.
 * It centralizes environment variable loading, validation, and client instantiation.
 *
 * Usage:
 * ```typescript
 * import { searcher, recommender, integrator, LANGUAGE, CURRENCY } from './config/relewiseConfig.js';
 * ```
 */

import 'dotenv/config';
import { Searcher, Recommender, UserFactory } from '@relewise/client';
import { Integrator } from '@relewise/integrations';

// Load and validate environment variables
const { RELEWISE_DATASET_ID, RELEWISE_API_KEY, RELEWISE_SERVER_URL } = process.env;

export const LANGUAGE = process.env.LANGUAGE || 'da-dk';
export const CURRENCY = process.env.CURRENCY || 'EUR';

if (!RELEWISE_DATASET_ID || !RELEWISE_API_KEY) {
    throw new Error('Missing RELEWISE_DATASET_ID or RELEWISE_API_KEY in .env');
}

// Client configuration options
const clientOptions = {
    serverUrl: RELEWISE_SERVER_URL,
};

// Pre-configured client instances
export const searcher = new Searcher(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);
export const recommender = new Recommender(RELEWISE_DATASET_ID, RELEWISE_API_KEY, clientOptions);

// Integrator for product imports (requires serverUrl)
if (!RELEWISE_SERVER_URL) {
    throw new Error('Missing RELEWISE_SERVER_URL in .env - required for Integrator');
}
export const integrator = new Integrator(RELEWISE_DATASET_ID, RELEWISE_API_KEY, {
    serverUrl: RELEWISE_SERVER_URL,
});

/**
 * Creates standard settings object for Relewise requests
 *
 * @param displayedAtLocation - Where the request is being made from (e.g., 'Search Page', 'Product Page')
 * @param user - User context (defaults to anonymous user)
 * @returns Settings object for use with builders
 */
export function createSettings(displayedAtLocation: string, user = UserFactory.anonymous()) {
    return {
        language: LANGUAGE,
        currency: CURRENCY,
        displayedAtLocation,
        user,
    };
}

// Export environment variables for cases where they're needed directly
export { RELEWISE_DATASET_ID, RELEWISE_API_KEY, RELEWISE_SERVER_URL };
