import { readFile } from 'node:fs/promises';
import { DataValueFactory } from '@relewise/client';
import { ProductUpdateBuilder } from '@relewise/integrations';
import { ProductData } from '../../types/interfaces.js';
import { integrator } from '../../config/relewiseConfig.js';

export default async function customDataImportExample() {
    const file = new URL('../../../product_data/product_data_example.json', import.meta.url);
    const products: ProductData[] = JSON.parse(await readFile(file, 'utf8'));

    // Run the core import first. This adds two custom fields to the same products.
    const updates = products.map((product) =>
        new ProductUpdateBuilder({
            id: product.unique_id,
            productUpdateKind: 'ReplaceProvidedProperties',
        })
            .data({
                Description: DataValueFactory.multilingual(
                    product.description.map(({ language, text }) => ({ language, value: text })),
                ),
                Image: DataValueFactory.string(product.image),
            })
            .build(),
    );

    await integrator.batch(updates);
    console.log(`Updated descriptions and images for ${updates.length} products.`);
}
