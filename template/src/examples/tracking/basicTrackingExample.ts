/**
 * Basic Behavioral Tracking Example
 *
 * Demonstrates essential tracking events for Relewise personalization:
 * - Product views
 * - Search queries
 * - Cart additions
 * - Purchases
 *
 * This tracking data enables personalized search results and recommendations.
 *
 * Usage:
 * npm run dev basicTrackingExample
 *
 * Features:
 * - User identification patterns (anonymous vs identified)
 * - Essential e-commerce events
 * - Proper data structure for tracking
 * - Error handling for tracking failures
 */

import { tracker, CURRENCY } from '../../config/relewiseConfig.js';
import { UserFactory } from '@relewise/client';
import { setTimeout } from 'node:timers/promises';

/**
 * Demonstrates basic product view tracking
 */
async function trackProductView(userId?: string) {
    console.log('\n📱 Product View Tracking');

    const user = userId ? UserFactory.byTemporaryId(userId) : UserFactory.anonymous();

    try {
        await tracker.trackProductView({
            productId: '00198c54-6c62-4e08-be40-a539963985d0', // Bose QuietComfort Earbuds
            variantId: 'var-bose-qc-earbuds-black',
            user,
        });

        console.log('✅ Product view tracked successfully');
        console.log('   Product: Bose QuietComfort Earbuds');
        console.log(`   User: ${userId || 'anonymous'}`);
    } catch (error) {
        console.error('❌ Product view tracking failed:', error);
    }
}

/**
 * Demonstrates search term tracking
 */
async function trackSearchQuery(searchTerm: string, userId?: string) {
    console.log('\n🔍 Search Query Tracking');

    const user = userId ? UserFactory.byTemporaryId(userId) : UserFactory.anonymous();

    try {
        await tracker.trackSearchTerm({
            term: searchTerm,
            language: 'en-US',
            user,
        });

        console.log('✅ Search tracking completed');
        console.log(`   Query: "${searchTerm}"`);
        console.log(`   User: ${userId || 'anonymous'}`);
    } catch (error) {
        console.error('❌ Search tracking failed:', error);
    }
}

/**
 * Demonstrates cart tracking (add to cart event)
 */
async function trackAddToCart(userId?: string) {
    console.log('\n🛒 Add to Cart Tracking');

    const user = userId ? UserFactory.byTemporaryId(userId) : UserFactory.anonymous();

    try {
        await tracker.trackCart({
            user,
            subtotal: { amount: 279.99, currency: CURRENCY },
            lineItems: [
                {
                    productId: '00198c54-6c62-4e08-be40-a539963985d0',
                    variantId: 'var-bose-qc-earbuds-black',
                    quantity: 1,
                    lineTotal: 279.99,
                },
            ],
            cartName: 'shopping-cart',
        });

        console.log('✅ Cart addition tracked successfully');
        console.log('   Product: Bose QuietComfort Earbuds');
        console.log('   Quantity: 1');
        console.log('   Amount: €279.99');
        console.log(`   User: ${userId || 'anonymous'}`);
    } catch (error) {
        console.error('❌ Cart tracking failed:', error);
    }
}

/**
 * Demonstrates order/purchase tracking
 */
async function trackPurchase(userId?: string) {
    console.log('\n💳 Purchase Tracking');

    const user = userId ? UserFactory.byTemporaryId(userId) : UserFactory.anonymous();
    const orderNumber = `ORD-${Date.now()}`;

    try {
        await tracker.trackOrder({
            user,
            orderNumber,
            subtotal: { amount: 559.98, currency: CURRENCY },
            lineItems: [
                {
                    productId: '00198c54-6c62-4e08-be40-a539963985d0',
                    variantId: 'var-bose-qc-earbuds-black',
                    quantity: 1,
                    lineTotal: 279.99,
                },
                {
                    productId: '019a2c5e-63e4-4d9d-a567-5e8234f0e123',
                    variantId: 'var-sony-wh1000xm5-black',
                    quantity: 1,
                    lineTotal: 279.99,
                },
            ],
        });

        console.log('✅ Purchase tracked successfully');
        console.log(`   Order: ${orderNumber}`);
        console.log('   Items: 2 products');
        console.log('   Total: €559.98');
        console.log(`   User: ${userId || 'anonymous'}`);
    } catch (error) {
        console.error('❌ Purchase tracking failed:', error);
    }
}

/**
 * Demonstrates category view tracking
 */
async function trackCategoryView(categoryId: string, userId?: string) {
    console.log('\n📂 Category View Tracking');

    const user = userId ? UserFactory.byTemporaryId(userId) : UserFactory.anonymous();

    try {
        await tracker.trackProductCategoryView({
            idPath: ['hi-fi', categoryId],
            user,
        });

        console.log('✅ Category view tracked successfully');
        console.log('   Category: Hi-Fi > Headphones');
        console.log(`   Category ID: ${categoryId}`);
        console.log(`   User: ${userId || 'anonymous'}`);
    } catch (error) {
        console.error('❌ Category view tracking failed:', error);
    }
}

/**
 * Main function demonstrating a complete user journey with tracking
 */
export default async function basicTrackingExample(userId?: string) {
    console.log('🎯 Relewise Basic Behavioral Tracking Example');
    console.log('=============================================');

    const testUserId = userId || 'demo_user_123';

    console.log(`\n👤 Simulating user journey for: ${testUserId}`);
    console.log('Tracking behavioral events for personalization...\n');

    // Simulate a typical e-commerce user journey
    await trackCategoryView('headphones', testUserId);
    await setTimeout(500); // Small delay between events

    await trackSearchQuery('noise cancelling headphones', testUserId);
    await setTimeout(500);

    await trackProductView(testUserId);
    await setTimeout(500);

    await trackAddToCart(testUserId);
    await setTimeout(500);

    await trackPurchase(testUserId);

    console.log('\n🎉 Complete user journey tracked!');
    console.log('\nThis behavioral data will improve:');
    console.log('• Search result personalization');
    console.log('• Product recommendations');
    console.log('• Category ranking');
    console.log('• Related product suggestions');
    console.log('\n💡 Tip: Run this with different user IDs to simulate various user profiles');
}

// Handle direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
    const userId = process.argv[2];
    basicTrackingExample(userId).catch(console.error);
}
