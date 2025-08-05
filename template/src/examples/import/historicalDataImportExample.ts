/**
 * Example: Historical Order Data Import to Relewise
 *
 * This file demonstrates how to import historical order data into Relewise for immediate personalization benefits.
 *
 * Key Features:
 * - Loads historical order data from a local JSON file
 * - Handles multi-market orders (DK, SE, NO, GB) and B2B/B2C channels
 * - Proper user classification and company association
 * - Rate limiting to avoid API throttling
 * - Comprehensive error handling and progress tracking
 * - Uses actual product IDs from the sample product data
 *
 * Usage:
 * 1. Ensure your `.env` file contains RELEWISE_DATASET_ID, RELEWISE_API_KEY, and RELEWISE_SERVER_URL.
 * 2. Historical order data is loaded from `product_data/historical_orders_example.json`.
 * 3. Run with `npm run dev historicalDataImportExample` or import/run from `index.ts`.
 * 4. Use this as a template for importing your own historical order data.
 *
 * Important Notes:
 * - Historical data import should be done ONCE during initial setup
 * - After going live, use real-time tracking only
 * - Ensure product IDs in historical data match your current catalog
 *
 * For more, see:
 * - https://github.com/Relewise/relewise-sdk-javascript
 * - Project's .github/copilot-instructions.md
 */

import 'dotenv/config';
import { Trackable, UserFactory } from '@relewise/client';
import { integrator } from '../../config/relewiseConfig.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface HistoricalOrder {
    orderNumber: string;
    customerId: string;
    companyId?: string;
    orderDate: string;
    currency: string;
    userClassifications: Record<string, string>;
    lineItems: Array<{
        productId: string;
        quantity: number;
        lineTotal: number;
    }>;
}

/**
 * Imports historical order data from a local JSON file into Relewise.
 *
 * This provides immediate personalization benefits by establishing baseline
 * behavioral data before implementing real-time tracking.
 */
async function importHistoricalOrders() {
    console.log('🔄 Starting historical order data import...');
    
    // Load historical order data from local JSON file
    const dataPath = path.resolve(__dirname, '../../../product_data/historical_orders_example.json');
    let historicalOrders: HistoricalOrder[];

    try {
        const fileContents = await fs.readFile(dataPath, 'utf-8');
        historicalOrders = JSON.parse(fileContents) as HistoricalOrder[];
        console.log(`📄 Loaded ${historicalOrders.length} historical orders from ${dataPath}`);
    } catch (err) {
        console.error(`❌ Failed to load historical order data from ${dataPath}:`, err);
        return;
    }

    // Process orders in batches to avoid API rate limits
    const batchSize = 10; // Conservative batch size for historical data
    const orders: Trackable[] = [];
    let processedCount = 0;
    let errorCount = 0;

    for (const orderData of historicalOrders) {
        try {
            // Create user with proper classifications
            const user = UserFactory.byAuthenticatedId(orderData.customerId);
            user.classifications = orderData.userClassifications;
            
            // Add company association for B2B orders
            if (orderData.companyId) {
                user.company = { id: orderData.companyId };
            }

            // Calculate order total
            const orderTotal = orderData.lineItems.reduce(
                (total, item) => total + (item.quantity * item.lineTotal), 
                0
            );

            // Create order tracking object
            const order: Trackable = {
                $type: 'Relewise.Client.DataTypes.Order, Relewise.Client',
                orderNumber: orderData.orderNumber,
                lineItems: orderData.lineItems.map(item => ({
                    product: { id: item.productId },
                    quantity: item.quantity,
                    lineTotal: item.lineTotal,
                })),
                cartName: 'default',
                user: user,
                subtotal: {
                    amount: orderTotal,
                    currency: { value: orderData.currency },
                },
                // Important: Use actual order date for historical data
                utcTime: orderData.orderDate,
            };

            orders.push(order);
            processedCount++;

            // Process in batches
            if (orders.length >= batchSize) {
                await processBatch(orders, processedCount, historicalOrders.length);
                orders.length = 0; // Clear the array
                
                // Rate limiting - pause between batches
                console.log('⏸️  Pausing 2 seconds between batches to respect API limits...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

        } catch (error) {
            console.error(`❌ Error processing order ${orderData.orderNumber}:`, error);
            errorCount++;
        }
    }

    // Process remaining orders
    if (orders.length > 0) {
        await processBatch(orders, processedCount, historicalOrders.length);
    }

    // Final summary
    console.log('\n📊 Historical Data Import Summary:');
    console.log(`✅ Successfully processed: ${processedCount} orders`);
    console.log(`❌ Errors encountered: ${errorCount} orders`);
    console.log(`📈 Import completion: ${((processedCount / historicalOrders.length) * 100).toFixed(1)}%`);
    
    if (errorCount === 0) {
        console.log('\n🎉 Historical data import completed successfully!');
        console.log('💡 Personalization benefits should be available immediately.');
        console.log('🔄 You can now run search and recommendation examples to see improved results.');
    } else {
        console.log(`\n⚠️  Import completed with ${errorCount} errors. Check logs above for details.`);
    }
}

/**
 * Processes a batch of orders and sends them to Relewise
 */
async function processBatch(orders: Trackable[], processedCount: number, totalCount: number) {
    try {
        console.log(`📤 Processing batch: ${processedCount - orders.length + 1}-${processedCount} of ${totalCount}`);
        
        const batchResponse = await integrator.batch(orders);
        
        if (batchResponse) {
            console.log(`✅ Batch processed successfully (${orders.length} orders)`);
        } else {
            console.log(`⚠️  Batch response was empty, but no error thrown`);
        }
        
    } catch (error) {
        console.error(`❌ Failed to process batch:`, error);
        throw error; // Re-throw to be handled by caller
    }
}

/**
 * Demonstrates different order patterns from the historical data
 */
function demonstrateOrderPatterns() {
    console.log('\n📋 Historical Order Patterns Included:');
    console.log('🇩🇰 Danish B2C customers - Premium electronics bundles');
    console.log('🇸🇪 Swedish B2C customers - Audio equipment focus');
    console.log('🇳🇴 Norwegian B2C customers - Gaming monitor purchases');
    console.log('🇬🇧 British B2C customers - Apple ecosystem products');
    console.log('🏢 B2B Company 1 - Kitchen appliances and consumables');
    console.log('🏢 B2B Company 2 - Dishwasher tablets and appliances');
    console.log('\n💡 This data will enable:');
    console.log('   • Cross-market personalization patterns');
    console.log('   • B2B vs B2C behavioral differences');
    console.log('   • Product affinity and bundle recommendations');
    console.log('   • Customer lifetime value analysis');
}

/** Default export: runnable from index.ts */
export default async function runHistoricalDataImportExample() {
    demonstrateOrderPatterns();
    await importHistoricalOrders();
}
