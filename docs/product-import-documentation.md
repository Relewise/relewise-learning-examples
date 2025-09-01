# Product Import Example (TypeScript)

This guide provides a detailed walkthrough of the `productImportExample.ts` script. It demonstrates how to import product data into Relewise using the TypeScript SDK's `Integrator` client, covering essential concepts like entity mapping, data factories, and batch processing.

## Overview

The script performs the following actions:
1.  **Loads Configuration**: Reads API credentials and settings from an `.env` file.
2.  **Reads Local Data**: Fetches product data from a `product_data_example.json` file.
3.  **Maps Product Data**: Iterates through each product and maps its fields to the Relewise `ProductUpdate` format using a builder pattern.
4.  **Handles Complex Data**: Correctly formats multilingual text, prices, categories, and custom attributes using `DataValueFactory`.
5.  **Batch Imports**: Sends all the prepared product updates to the Relewise API in a single, efficient batch request.

## Prerequisites

-   Node.js 16 or higher.
-   Relewise TypeScript SDK (`@relewise/client`, `@relewise/integrations`).
-   An `.env` file with your `RELEWISE_DATASET_ID`, `RELEWISE_API_KEY`, and `RELEWISE_SERVER_URL`.

---

## Step-by-Step Code Explanation

### 1. Initial Setup and Data Loading

The script begins by importing the necessary modules and loading the product data from a local JSON file.

```typescript
import 'dotenv/config';
import { Trackable, DataValueFactory } from '@relewise/client';
import { ProductUpdateBuilder } from '@relewise/integrations';
import {
    Brand,
    Category,
    // ... other type imports
} from '../../types/interfaces.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { integrator, LANGUAGE, CURRENCY } from '../../config/relewiseConfig.js';

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
```

### 2. Iterating and Building Product Updates

The script loops through each product from the JSON file and uses the `ProductUpdateBuilder` to construct a Relewise-compatible product object.

-   `id`: The unique identifier for the product.
-   `productUpdateKind`: Set to `'UpdateAndAppend'`, which updates existing products or creates them if they don't exist.

```typescript
    const productUpdates: Trackable[] = [];

    for (const product of allProductsToSync) {
        try {
            const productTyped: ProductData = product;

            // Build the product update using the builder pattern
            const content = new ProductUpdateBuilder({
                id: productTyped.unique_id.toString(),
                productUpdateKind: 'UpdateAndAppend',
            })
```

### 3. Mapping Standard Product Fields

The builder pattern provides a fluent API for setting standard fields like brand, category paths, display names, and prices.

```typescript
                .brand(
                    ((): Brand => ({
                        id: productTyped.brand.id,
                        displayName: productTyped.brand.displayName,
                    }))(),
                )
                .categoryPaths((cat) =>
                    cat.path((catPath) => {
                        // ... logic to add main and subcategories
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
```

### 4. Mapping Custom Data with `DataValueFactory`

All custom attributes and complex data types must be wrapped with `DataValueFactory`. This ensures that Relewise processes the data with the correct type.

-   `DataValueFactory.multilingual`: For text that varies by language.
-   `DataValueFactory.string`: For simple text values.
-   `DataValueFactory.number`: For numerical values.
-   `DataValueFactory.stringCollection`: For arrays of strings.

```typescript
                .data({
                    // Map all product data fields using DataValueFactory
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
                    // ... other data fields
                    ...(productTyped.campaignIds
                        ? {
                              campaignIds: DataValueFactory.stringCollection(
                                  productTyped.campaignIds,
                              ),
                          }
                        : {}),
                });

            productUpdates.push(content.build());
```

### 5. Batch Importing

After preparing all product updates, the script sends them to Relewise in a single batch request using `integrator.batch()`. This is far more efficient than sending one request per product.

```typescript
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
```

---

## Core Objects Explained

This section elaborates on the key classes from the Relewise SDK used in the product import script. Understanding their roles is fundamental to working with Relewise.

### `ProductUpdateBuilder`
-   **Source**: `import { ProductUpdateBuilder } from '@relewise/integrations';`
-   **Purpose**: The `ProductUpdateBuilder` is a helper class that uses the [Builder design pattern](https://en.wikipedia.org/wiki/Builder_pattern) to simplify the creation of `ProductUpdate` objects. Importing data requires structuring it in a specific way, and this builder provides a fluent, chainable API to make that process less error-prone.
-   **Usage**: You instantiate the builder with the product's unique ID and an `productUpdateKind`. Then, you chain method calls like `.displayName()`, `.brand()`, `.categoryPaths()`, and `.data()` to populate the product's attributes. Finally, you call `.build()` to get the finalized `ProductUpdate` object, which is then added to the array for batch processing.

### `DataValueFactory`
-   **Source**: `import { DataValueFactory } from '@relewise/client';`
-   **Purpose**: `DataValueFactory` is a static utility class that is essential for handling custom data. All non-standard product attributes (i.e., anything you put in the `.data()` method) must be wrapped in a `DataValue` object. This factory provides simple methods to create these objects with the correct data type.
-   **Why it's important**: Explicitly defining the data type is crucial. It tells Relewise how to index the data, which in turn enables functionalities like:
    -   **Filtering**: "Only show products where `InStock` is `true`."
    -   **Faceting**: "Let users filter by `Color` or `Size`."
    -   **Merchandising**: "Boost products where `IsNewArrival` is `true`."
-   **Usage**: You don't instantiate this class. Instead, you call its static methods directly, such as `DataValueFactory.multilingual(...)`, `DataValueFactory.string(...)`, `DataValueFactory.number(...)`, or `DataValueFactory.stringCollection(...)`.

### `Integrator` and `integrator.batch()`
-   **Source**: `import { integrator } from '../../config/relewiseConfig.ts';` (which is an instance of the `Integrator` class from `@relewise/integrations`).
-   **Purpose**: The `Integrator` is the primary client for sending administrative and data-related updates to the Relewise API. It handles tasks like updating products, categories, brands, and content. It extends the base `RelewiseClient` but is specialized for data integration tasks.
-   **`integrator.batch()` Method**: This is the most important method for bulk data imports.
    -   **Efficiency**: Instead of sending one HTTP request for every single product update, `batch()` allows you to group hundreds or thousands of updates into a single API call. This is significantly faster, reduces network overhead, and is the recommended best practice for any data synchronization.
    -   **Usage**: The method accepts an array of `Trackable` items. `ProductUpdate` objects (created by the `ProductUpdateBuilder`) are a type of `Trackable`. The script first builds an array of all product updates and then sends this entire array in one call to `integrator.batch(productUpdates)`.

## Troubleshooting

-   **Authentication Errors**: Double-check that your `.env` file contains the correct `RELEWISE_DATASET_ID`, `RELEWISE_API_KEY`, and `RELEWISE_SERVER_URL`.
-   **Validation Errors**: If the import fails, inspect the `batchResponse` object. It will contain detailed error messages from the API, often pointing to missing required fields or incorrect data types.
-   **Data Not Appearing**: Ensure your `productUpdateKind` is set to `'UpdateAndAppend'`. This ensures that products are created if they don't already exist in Relewise.
