import 'dotenv/config';
import { Trackable, DataValueFactory } from '@relewise/client';
import { Integrator, ProductUpdateBuilder } from '@relewise/integrations';
import {
    Brand,
    Category,
    CategoryName,
    Price,
    Availability,
    ProductData,
    Promoted,
    OnSale,
} from './types/interfaces.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { RELEWISE_DATASET_ID, RELEWISE_API_KEY, RELEWISE_SERVER_URL } = process.env;

if (!RELEWISE_DATASET_ID || !RELEWISE_API_KEY || !RELEWISE_SERVER_URL) {
    throw new Error(
        'Missing RELEWISE_DATASET_ID, RELEWISE_API_KEY, or RELEWISE_SERVER_URL in .env',
    );
}

async function importProductsExample() {
    // Load product data from local JSON file
    const dataPath = path.resolve(__dirname, '../product_data/product_data_example.json');
    let allProductsToSync: ProductData[];

    try {
        const fileContents = await fs.readFile(dataPath, 'utf-8');
        allProductsToSync = JSON.parse(fileContents) as ProductData[];
    } catch (err) {
        console.error(`❌ Failed to load product data from ${dataPath}:`, err);
        return;
    }

    const integrator = new Integrator(RELEWISE_DATASET_ID as string, RELEWISE_API_KEY as string, {
        serverUrl: RELEWISE_SERVER_URL as string,
    });

    const date: number = Date.now();
    const productUpdates: Trackable[] = [];

    for (const product of allProductsToSync) {
        try {
            const productTyped: ProductData = product;

            const content = new ProductUpdateBuilder({
                id: productTyped.unique_id.toString(),
                productUpdateKind: 'UpdateAndAppend',
            })
                //.brand({ id: productTyped.brand.id, displayName: productTyped.brand.displayName })
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
                                language: element.language,
                            })),
                        });

                        // Subcategory (if any)
                        if (mainCategory.subCategory) {
                            catPath.category({
                                id: mainCategory.subCategory.id,
                                displayName: mainCategory.subCategory.name.map(
                                    (element: CategoryName) => ({
                                        value: element.displayName,
                                        language: element.language,
                                    }),
                                ),
                            });
                        }

                        return catPath;
                    }),
                )
                .displayName(
                    productTyped.name.map((element) => ({
                        language: element.language,
                        value: element.name,
                    })),
                )
                .listPrice(
                    productTyped.list_price.map((element: Price) => ({
                        amount: element.amount,
                        currency: element.currency,
                    })),
                )
                .salesPrice(
                    productTyped.sales_price.map((element: Price) => ({
                        amount: element.amount,
                        currency: element.currency,
                    })),
                )
                .data({
                    Description: DataValueFactory.multilingual(
                        productTyped.description.map((element) => ({
                            language: element.language,
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
                            acc[`${element.language}_StockLevel`] = DataValueFactory.number(
                                element.number,
                            );

                            // Initialize multilingual SoldOut and LowStock if missing
                            if (!acc.SoldOut) {
                                acc.SoldOut = DataValueFactory.multilingual([]);
                            }
                            if (!acc.LowStock) {
                                acc.LowStock = DataValueFactory.multilingual([]);
                            }

                            acc.LowStock.value.values.push({
                                language: { value: element.language },
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

    if (productUpdates.length > 0) {
        await integrator.batch(productUpdates);
        console.log(`✅ Imported ${productUpdates.length} products to Relewise.`);
    } else {
        console.log('⚠️ No products to import.');
    }
}

/** Default export: runnable from index.ts */
export default importProductsExample;
