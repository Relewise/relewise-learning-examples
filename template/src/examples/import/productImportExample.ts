import { readFile } from 'node:fs/promises';
import { DataValueFactory } from '@relewise/client';
import { ProductUpdateBuilder } from '@relewise/integrations';
import { ProductData } from '../../types/interfaces.js';
import { integrator } from '../../config/relewiseConfig.js';

// This maps our supplied catalog, rather than trying to accept arbitrary product feeds.
export function buildProductUpdate(product: ProductData) {
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
            // The sample uses language as market. Availability is the stock source of truth.
            ...Object.fromEntries(
                product.availability.map(({ language, number }) => [
                    `${language}_StockLevel`,
                    DataValueFactory.number(number),
                ]),
            ),
        })
        .build();
}

export default async function importProductsExample() {
    const file = new URL('../../../product_data/product_data_example.json', import.meta.url);
    const products: ProductData[] = JSON.parse(await readFile(file, 'utf8'));
    const updates = products.map((product) => buildProductUpdate(product));

    // The SDK splits large imports into batches. Other products in the dataset are left alone.
    await integrator.batch(updates);
    console.log(`Imported ${updates.length} products.`);
}
