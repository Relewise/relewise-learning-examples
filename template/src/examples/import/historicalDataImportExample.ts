import { readFile } from 'node:fs/promises';
import { Order, UserFactory } from '@relewise/client';
import { integrator } from '../../config/relewiseConfig.js';

interface HistoricalOrder {
    orderNumber: string;
    customerId: string;
    companyId?: string;
    orderDate: string;
    currency: string;
    userClassifications: Record<string, string>;
    lineItems: { productId: string; quantity: number; lineTotal: number }[];
}

export function buildHistoricalOrder(source: HistoricalOrder): Order {
    const user = UserFactory.byAuthenticatedId(source.customerId);
    user.classifications = source.userClassifications;
    if (source.companyId) {
        user.company = { id: source.companyId };
    }

    return {
        $type: 'Relewise.Client.DataTypes.Order, Relewise.Client',
        orderNumber: source.orderNumber,
        user,
        cartName: 'default',
        lineItems: source.lineItems.map((item) => ({
            product: { id: item.productId },
            quantity: item.quantity,
            lineTotal: item.lineTotal,
        })),
        subtotal: {
            // lineTotal already includes quantity; do not multiply it a second time.
            amount: source.lineItems.reduce((total, item) => total + item.lineTotal, 0),
            currency: { value: source.currency },
        },
    };
}

export default async function historicalDataImportExample() {
    const file = new URL('../../../product_data/historical_orders_example.json', import.meta.url);
    const orders: HistoricalOrder[] = JSON.parse(await readFile(file, 'utf8'));

    // Run once before live tracking, with no overlapping orders. Re-running can double-count behavior.
    // These requests are tracked at import time; the source orderDate does not backdate them.
    await integrator.batch(orders.map(buildHistoricalOrder));
    console.log(`Imported ${orders.length} historical orders.`);
}
