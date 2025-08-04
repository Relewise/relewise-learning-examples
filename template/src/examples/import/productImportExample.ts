/**
 * Example: Product Import to Relewise MCP
 *
 * This file demonstrates how to import product data into Relewise using the TypeScript SDK and Integrator.
 *
 * Key Features:
 * - Loads product data from a local JSON file.
 * - Maps product fields to Relewise's data model using builder and factory patterns.
 * - Handles multilingual, assortment, campaign, and custom fields.
 * - Uses DataValueFactory to ensure correct data types for all product properties.
 * - Batches product updates for efficient import.
 * - Provides robust error handling and logging.
 *
 * Usage:
 * 1. Ensure your `.env` file contains RELEWISE_DATASET_ID, RELEWISE_API_KEY, and RELEWISE_SERVER_URL.
 * 2. Place your product data JSON in `product_data/product_data_example.json`.
 * 3. Build with `npx tsc` and run with `node dist/productImportExample.js` or import/run from `index.ts`.
 * 4. Use this as a template for other Relewise-powered import scenarios.
 *
 * For more, see:
 * - https://github.com/Relewise/relewise-sdk-javascript
 * - Project's .github/copilot-instructions.md
 */

import 'dotenv/config';
import { Trackable, DataValueFactory } from '@relewise/client';
import { ProductUpdateBuilder } from '@relewise/integrations';
import {
    Brand,
    Category,
    CategoryName,
    Price,
    Availability,
    ProductData,
    Promoted,
    OnSale,
} from '../../types/interfaces.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { integrator, LANGUAGE, CURRENCY } from '../../config/relewiseConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Imports products from a local JSON file into Relewise MCP.
 *
 * - Loads product data and maps to Relewise's product update format.
 * - Handles multilingual, assortment, campaign, and custom fields.
 * - Uses DataValueFactory for all data values to ensure correct typing.
 * - Batches updates and logs results/errors.
 */
async function importProductsExample() {
    // Load product data from local JSON file
    const dataPath = path.resolve(__dirname, '../../../product_data/product_data_example.json');
    let allProductsToSync: ProductData[];

    try {
        const fileContents = await fs.readFile(dataPath, 'utf-8');
        allProductsToSync = JSON.parse(fileContents) as ProductData[];
    } catch (err) {
        console.error(`❌ Failed to load product data from ${dataPath}:`, err);
        return;
    }

    const date: number = Date.now();
    const productUpdates: Trackable[] = [];

    for (const product of allProductsToSync) {
        try {
            const productTyped: ProductData = product;

            // Build the product update using the builder pattern
            const content = new ProductUpdateBuilder({
                id: productTyped.unique_id.toString(),
                productUpdateKind: 'UpdateAndAppend',
            })
                .brand(
                    ((): Brand => ({
                        id: productTyped.brand.id,
                        displayName: productTyped.brand.displayName,
                    }))(),
                )
                .categoryPaths((cat) =>
                    cat.path((catPath) => {
                        const mainCategory: Category = productTyped.mainCategory;

                        // Main category
                        catPath.category({
                            id: mainCategory.id,
                            displayName: mainCategory.name.map((element: CategoryName) => ({
                                value: element.displayName,
                                language: LANGUAGE,
                            })),
                        });

                        // Subcategory (if any)
                        if (mainCategory.subCategory) {
                            catPath.category({
                                id: mainCategory.subCategory.id,
                                displayName: mainCategory.subCategory.name.map(
                                    (element: CategoryName) => ({
                                        value: element.displayName,
                                        language: LANGUAGE,
                                    }),
                                ),
                            });
                        }

                        return catPath;
                    }),
                )
                .displayName(
                    productTyped.name.map((element) => ({
                        language: LANGUAGE,
                        value: element.name,
                    })),
                )
                .listPrice(
                    productTyped.list_price.map((element: Price) => ({
                        amount: element.amount,
                        currency: CURRENCY,
                    })),
                )
                .salesPrice(
                    productTyped.sales_price.map((element: Price) => ({
                        amount: element.amount,
                        currency: CURRENCY,
                    })),
                )
                .data({
                    // Map all product data fields using DataValueFactory
                    Description: DataValueFactory.multilingual(
                        productTyped.description.map((element) => ({
                            language: LANGUAGE,
                            value: element.text,
                        })),
                    ),
                    Image: DataValueFactory.string(
                        productTyped.image.replace(
                            'upload/',
                            'upload/c_scale,h_0.5,w_0.5/q_auto:low/',
                        ),
                    ),
                    ...productTyped.availability.reduce(
                        (acc: Record<string, any>, element: Availability) => {
                            acc[`${LANGUAGE}_StockLevel`] = DataValueFactory.number(element.number);

                            // Initialize multilingual SoldOut and LowStock if missing
                            if (!acc.SoldOut) {
                                acc.SoldOut = DataValueFactory.multilingual([]);
                            }
                            if (!acc.LowStock) {
                                acc.LowStock = DataValueFactory.multilingual([]);
                            }

                            // If availability is 0 - set SoldOut to true for this language
                            acc.SoldOut.value.values.push({
                                language: {
                                    value: LANGUAGE,
                                },
                                text: String(element.number === 0),
                            });
                            acc.LowStock.value.values.push({
                                language: { value: LANGUAGE },
                                text: String(element.number <= 3),
                            });

                            return acc;
                        },
                        {},
                    ),
                    ...(productTyped.promoted
                        ? {
                              Promoted: DataValueFactory.multilingual(
                                  productTyped.promoted.map((element: Promoted) => ({
                                      language: element.language,
                                      value: element.value ? 'true' : 'false',
                                  })),
                              ),
                          }
                        : {}),
                    ...(productTyped.campaignIds
                        ? {
                              campaignIds: DataValueFactory.stringCollection(
                                  productTyped.campaignIds,
                              ),
                          }
                        : {}),
                    ...(productTyped.margin
                        ? { Margin: DataValueFactory.string(productTyped.margin) }
                        : {}),
                    ...(productTyped.markets
                        ? {
                              AvailableInMarkets: DataValueFactory.stringCollection(
                                  productTyped.markets,
                              ),
                          }
                        : {}),
                    ...(productTyped.channels
                        ? {
                              AvailableInChannels: DataValueFactory.stringCollection(
                                  productTyped.channels,
                              ),
                          }
                        : {}),
                    ...(productTyped.daysAvailable
                        ? { DaysAvailable: DataValueFactory.number(productTyped.daysAvailable) }
                        : {}),
                    ...(productTyped.salesStatus
                        ? { SalesStatus: DataValueFactory.string(productTyped.salesStatus) }
                        : {}),
                    ...(productTyped.OnSale
                        ? {
                              OnSale: DataValueFactory.multilingual(
                                  productTyped.OnSale.map((element: OnSale) => ({
                                      language: element.language,
                                      value: String(element.value),
                                  })),
                              ),
                          }
                        : {}),
                    ImportedAt: DataValueFactory.number(date),
                });

            productUpdates.push(content.build());
        } catch (error) {
            console.error('❌ Error building product update:', error);
        }
    }

    // Batch import all product updates to Relewise
    if (productUpdates.length > 0) {
        const batchResponse = await integrator.batch(productUpdates);
        if (batchResponse) {
            // Log the full batch response; further type guards can be added if needed
            console.log('Batch import responses:', batchResponse);
        }
        console.log(`✅ Imported ${productUpdates.length} products to Relewise.`);
    } else {
        console.log('⚠️ No products to import.');
    }
}

/** Default export: runnable from index.ts */
export default importProductsExample;
