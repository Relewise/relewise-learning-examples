import { readFile } from 'node:fs/promises';
import { DataValueFactory } from '@relewise/client';
import { ProductUpdateBuilder } from '@relewise/integrations';
import { ProductData } from '../../types/interfaces.js';
import { integrator } from '../../config/relewiseConfig.js';

// This maps our supplied catalog, rather than trying to accept arbitrary product feeds.
export function buildProductUpdate(product: ProductData, importedAt: number) {
    const category = product.mainCategory;

    return new ProductUpdateBuilder({
        id: product.unique_id,
        productUpdateKind: 'ReplaceProvidedProperties',
    })
        .brand(product.brand)
        .displayName(product.name.map(({ language, name }) => ({ language, value: name })))
        .listPrice(product.list_price)
        .salesPrice(product.sales_price)
        .categoryPaths((paths) =>
            paths.path((path) => {
                path.category({
                    id: category.id,
                    displayName: category.name.map(({ language, displayName }) => ({
                        language,
                        value: displayName,
                    })),
                });
                if (category.subCategory) {
                    path.category({
                        id: category.subCategory.id,
                        displayName: category.subCategory.name.map(({ language, displayName }) => ({
                            language,
                            value: displayName,
                        })),
                    });
                }
            }),
        )
        .data({
            Description: DataValueFactory.multilingual(
                product.description.map(({ language, text }) => ({ language, value: text })),
            ),
            Image: DataValueFactory.string(product.image),
            // The sample uses language as market. Availability is the stock source of truth.
            ...Object.fromEntries(
                product.availability.map(({ language, number }) => [
                    `${language}_StockLevel`,
                    DataValueFactory.number(number),
                ]),
            ),
            SoldOut: DataValueFactory.multilingual(
                product.availability.map(({ language, number }) => ({
                    language,
                    value: String(number === 0),
                })),
            ),
            LowStock: DataValueFactory.multilingual(
                product.availability.map(({ language, number }) => ({
                    language,
                    value: String(number > 0 && number <= 3),
                })),
            ),
            // An empty promotion list means unspecified, rather than false in every market.
            Promoted: product.promoted.length
                ? DataValueFactory.multilingual(
                      product.promoted.map(({ language, value }) => ({
                          language,
                          value: String(value),
                      })),
                  )
                : null,
            OnSale: DataValueFactory.multilingual(
                product.OnSale.map(({ language, value }) => ({ language, value: String(value) })),
            ),
            campaignIds:
                product.campaignIds === null
                    ? null
                    : DataValueFactory.stringCollection(product.campaignIds),
            Margin: DataValueFactory.string(product.margin),
            AvailableInMarkets: DataValueFactory.stringCollection(product.markets),
            AvailableInChannels: DataValueFactory.stringCollection(product.channels),
            DaysAvailable:
                product.daysAvailable === null
                    ? null
                    : DataValueFactory.number(product.daysAvailable),
            SalesStatus:
                product.salesStatus === null ? null : DataValueFactory.string(product.salesStatus),
            ImportedAt: DataValueFactory.number(importedAt),
        })
        .build();
}

export default async function importProductsExample() {
    const file = new URL('../../../product_data/product_data_example.json', import.meta.url);
    const products: ProductData[] = JSON.parse(await readFile(file, 'utf8'));
    const importedAt = Date.now();
    const updates = products.map((product) => buildProductUpdate(product, importedAt));

    // The SDK splits large imports into batches. Other products in the dataset are left alone.
    await integrator.batch(updates);
    console.log(`Imported ${updates.length} products.`);
}
