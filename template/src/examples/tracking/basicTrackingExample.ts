import { UserFactory } from '@relewise/client';
import { tracker, DEMO_USER_ID } from '../../config/relewiseConfig.js';

export default async function basicTrackingExample() {
    const user = UserFactory.byTemporaryId(DEMO_USER_ID);
    const productId = '0bc52835-3346-4b53-9b82-1ae6355eb3f1'; // Bose Noise Cancelling Headphones 700

    await tracker.trackProductCategoryView({
        idPath: ['5', '5_1'], // Hi-Fi > Headphones, as imported from the catalog.
        user,
    });
    await tracker.trackProductView({ productId, user });

    // Send the full cart whenever it changes, rather than just the added item.
    // Two headphones at EUR 379.99 each. Keep the amount and currency together.
    const lineItems = [{ productId, quantity: 2, lineTotal: 759.98 }];
    const subtotal = { amount: 759.98, currency: 'EUR' };
    await tracker.trackCart({ user, lineItems, subtotal, cartName: 'default' });

    // Real orders use the shop's stable order number. Each demo run creates a new purchase.
    await tracker.trackOrder({
        user,
        orderNumber: `learning-${Date.now()}`,
        lineItems,
        subtotal,
        cartName: 'default',
    });

    console.log(`Tracked a category view, product view, cart and order for ${DEMO_USER_ID}.`);
    // Relewise search already tracks search terms. trackSearchTerm is for an external search engine.
}
