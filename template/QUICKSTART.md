# Relewise Quickstart Tutorial

**Complete guide to implementing Relewise in your TypeScript/JavaScript application**

This tutorial follows the [official Relewise implementation steps](https://docs.relewise.com/docs/developer/implementation-steps.html) and provides hands-on examples with real code you can run immediately.

## 📋 Prerequisites

- Node.js 18+ and npm
- Relewise account with Dataset ID and API Key
- Basic TypeScript/JavaScript knowledge

## 🚀 Step 1: Project Setup

### 1.1 Clone and Install

```bash
git clone <your-repo>
cd my-project
npm install
```

### 1.2 Environment Configuration

Create `.env` file with your Relewise credentials:

```env
# Required: Your Relewise credentials
RELEWISE_DATASET_ID=your-dataset-id
RELEWISE_API_KEY=your-api-key

# Required: Choose API environment
RELEWISE_SERVER_URL=https://sandbox-api.relewise.com  # for testing
# RELEWISE_SERVER_URL=https://api.relewise.com       # for production

# Optional: Defaults
LANGUAGE=en-US
CURRENCY=EUR
```

> **Important:** Start with the sandbox environment (`https://sandbox-api.relewise.com`) for development and testing.

### 1.3 Verify Setup

```bash
npm run build
npm run dev searchExample "test"
```

If successful, you should see search results (or appropriate error messages).

> **Note:** If you haven't imported product data yet, you'll see empty results `Products: []` with facet structure - this is expected and indicates the API connection is working correctly.

---

## 📦 Step 2: Provide Entities (Data Import)

_Following [Relewise Implementation Step 1](https://docs.relewise.com/docs/developer/implementation-steps.html#1-provide-entities)_

Before Relewise can provide search and recommendations, it needs your product data.

### 2.1 Understanding Entity Types

Relewise supports these entity types:

- **Products** - Your catalog items
- **Product Categories** - Category hierarchy
- **Content** - Pages, blogs, support articles
- **Content Categories** - Content organization
- **Brands** - Product manufacturers

### 2.2 Run Product Import Example

```bash
npm run dev productImportExample
```

**What this does:**

- Imports sample products from `product_data/product_data_example.json`
- Demonstrates proper product structure with variants, categories, brands
- Shows multilingual data handling
- Uses proper DataValueFactory for different data types

### 2.3 Inspect the Import Code

Look at `src/examples/import/productImportExample.ts`:

```typescript
// Key patterns:
- Product structure with variants
- Category hierarchy setup
- Brand associations
- Multilingual data (en-US, da-dk)
- Data types (String, Double, Boolean)
- Update strategies (ReplaceProvidedProperties vs ClearAndReplace)
```

### 2.4 Import Your Own Data

1. **Prepare your data** - Use `product_data/product_data_example.json` as a template
2. **Update import script** - Modify `productImportExample.ts` with your data source
3. **Run import** - Execute the import and verify data in My Relewise admin panel

> **Pro Tip:** Start small - import 10-20 products first to test the structure, then scale up.

---

## 👤 Step 3: Add Behavioral Tracking

_Following [Relewise Implementation Step 2](https://docs.relewise.com/docs/developer/implementation-steps.html#2-add-behavioral-tracking)_

Behavioral tracking is crucial for personalization. Let's implement the essential tracking events.

### 3.1 Run the Tracking Example

We've created a comprehensive tracking example that demonstrates all essential behavioral events:

```bash
npm run dev basicTrackingExample demo_user_123
```

This example simulates a complete user journey and tracks all the behavioral data that Relewise needs for personalization.

### 3.2 Basic Tracking Implementation

We've created a comprehensive tracking example that demonstrates all essential events:

```bash
npm run dev basicTrackingExample demo_user_123
```

**This example demonstrates:**

- **Product view tracking** - When users view product details
- **Search term tracking** - Search queries and behavior
- **Cart tracking** - Add to cart events
- **Purchase tracking** - Completed orders
- **Category tracking** - Category page visits

**Key tracking patterns:**

```typescript
// Product view tracking
await tracker.trackProductView({
    productId: 'product-123',
    variantId: 'variant-456', // optional
    user: UserFactory.byTemporaryId('user_123'),
});

// Search tracking
await tracker.trackSearchTerm({
    term: 'headphones',
    language: 'en-US',
    user: UserFactory.byTemporaryId('user_123'),
});

// Cart tracking
await tracker.trackCart({
    user: UserFactory.byTemporaryId('user_123'),
    subtotal: { amount: 299.99, currency: 'EUR' },
    lineItems: [
        {
            productId: 'product-123',
            quantity: 1,
            lineTotal: 299.99,
        },
    ],
});

// Purchase tracking
await tracker.trackOrder({
    user: UserFactory.byTemporaryId('user_123'),
    orderNumber: 'ORD-123',
    subtotal: { amount: 299.99, currency: 'EUR' },
    lineItems: [
        /* same as cart */
    ],
});
```

### 3.3 User Types and Consent

**Anonymous Users (no consent required):**

```typescript
const anonymousUser = UserFactory.anonymous();
```

**Identified Users (with consent):**

```typescript
const identifiedUser = UserFactory.byTemporaryId('user_123');
// or
const authenticatedUser = UserFactory.byAuthenticatedId('customer_456');
```

### 3.4 Historical Data Import

If you have existing order data, import it once during initial setup:

```typescript
// Import historical orders (do this ONCE before going live)
const historicalOrders = await loadHistoricalOrders();
for (const order of historicalOrders) {
    await tracker.trackOrder({
        user: UserFactory.byAuthenticatedId(order.customerId),
        orderNumber: order.orderNumber,
        subtotal: { amount: order.total, currency: 'EUR' },
        lineItems: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
        })),
    });
}
```

---

## 🔍 Step 4: Implement Search Services

_Following [Relewise Implementation Step 3](https://docs.relewise.com/docs/developer/implementation-steps.html#3-implement-services)_

Now that you have data and tracking, implement search functionality.

### 4.1 Basic Product Search

```bash
npm run dev searchExample "headphones"
```

**Key features demonstrated:**

- Term matching and relevance
- Faceted navigation (brands, categories, price ranges)
- Pagination
- Search term predictions for typeahead

### 4.2 Category-Based Search

```bash
npm run dev searchCategoryExample "hi-fi"
```

**What this shows:**

- Category hierarchy navigation
- Category-specific facets
- Breadcrumb navigation
- Category-scoped search

### 4.3 Personalized Search

```bash
npm run dev cdpPersonalizedSearchExample user_1 "headphones"
```

**Advanced features:**

- User-specific personalization
- External data integration (CDP, weather, ML models)
- Relevance modifiers based on user preferences
- Context-aware boosting

### 4.4 Search Index Requirements

> **Important:** Before search works, you need a search index configured in My Relewise admin panel. Without this, searches return no results.

**To set up search index:**

1. Log into [My Relewise](https://my.relewise.com)
2. Navigate to Search → Search Index
3. Configure which product fields should be searchable
4. Save and wait for index to build

---

## 🎯 Step 5: Implement Recommendations

Recommendations drive engagement and conversions. Let's implement key recommendation types.

### 5.1 Popular Products

```bash
npm run dev popularProductsExample
```

**Use cases:**

- Homepage recommendations
- Category landing pages
- Empty cart suggestions

### 5.2 Collaborative Filtering

```bash
npm run dev purchasedWithProductExample "00198c54-6c62-4e08-be40-a539963985d0"
```

**Use cases:**

- Product detail pages ("Customers also bought")
- Cross-selling in cart
- Related product suggestions

### 5.3 Recommendation Placement Strategy

**Best practices for where to place recommendations:**

- **Homepage:** Popular products, trending items
- **Product Pages:** Related products, purchased-with products
- **Cart Page:** Cross-sell items, bundle suggestions
- **Checkout:** Last-minute add-ons
- **Post-Purchase:** Complementary products

---

## 🔄 Step 6: Updating and Maintaining Data

_Following [Relewise Implementation Step 4](https://docs.relewise.com/docs/developer/implementation-steps.html#4-updating-entities)_

Your product catalog changes - here's how to keep Relewise in sync.

### 6.1 Delta Updates (Recommended)

For ongoing updates, track what changed since last sync:

```typescript
// Update only products that changed today
const changedProducts = await getProductsChangedSince(yesterday);
for (const product of changedProducts) {
    await integrator.updateProduct(product, {
        updateKind: 'ReplaceProvidedProperties',
    });
}
```

### 6.2 Full Updates with Timestamp Strategy

For complete catalog refresh:

```typescript
const timestamp = new Date().toISOString();

// 1. Update all products with timestamp
await importAllProducts(timestamp);

// 2. Disable products without latest timestamp
await integrator.batchUpdateProducts({
    filter: new FilterCollection(
        new ProductDataFilter(
            'ImportedAt',
            new EqualsCondition(timestamp, true), // negated: true
        ),
    ),
    action: ProductAdministrativeAction.UpdateKind.Disable,
});

// 3. Enable products with latest timestamp
await integrator.batchUpdateProducts({
    filter: new FilterCollection(
        new ProductDataFilter('ImportedAt', new EqualsCondition(timestamp, false)),
    ),
    action: ProductAdministrativeAction.UpdateKind.Enable,
});
```

### 6.3 Update Strategies

- **UpdateAndAppend** - Adds new fields, keeps existing
- **ReplaceProvidedProperties** - Updates provided fields only
- **ClearAndReplace** - Complete replacement (use carefully)
- **None** - No changes to main product (useful for variant-only updates)

---

## ✅ Step 7: Testing and Validation

### 7.1 Run All Examples

```bash
# Test tracking (behavioral data)
npm run dev basicTrackingExample demo_user_123

# Test data import
npm run dev productImportExample

# Test search functionality
npm run dev searchExample "headphones"
npm run dev searchCategoryExample "hi-fi"
npm run dev cdpPersonalizedSearchExample user_1 "speakers"

# Test recommendations
npm run dev popularProductsExample
npm run dev purchasedWithProductExample "00198c54-6c62-4e08-be40-a539963985d0"
```

### 7.2 Verify in My Relewise

1. **Check data import** - Browse products in admin panel
2. **Test search index** - Verify search returns results
3. **Monitor tracking** - Check behavioral data is flowing
4. **Validate recommendations** - Ensure recommendations appear

### 7.3 Production Readiness Checklist

- [ ] **Environment variables** set for production
- [ ] **Search index** configured and built
- [ ] **Product data** imported successfully
- [ ] **Tracking implemented** on all key pages
- [ ] **Error handling** implemented for API calls
- [ ] **Fallbacks** in place if Relewise is unavailable
- [ ] **Monitoring** setup for API errors and performance

---

## 🔧 Advanced Configuration

### Environment-Specific Setup

**Development:**

```env
RELEWISE_SERVER_URL=https://sandbox-api.relewise.com
LANGUAGE=en-US
CURRENCY=USD
```

**Production:**

```env
RELEWISE_SERVER_URL=https://api.relewise.com
LANGUAGE=en-US
CURRENCY=USD
```

### Performance Optimization

- **Caching** - Cache search results appropriately
- **Batching** - Batch tracking calls when possible
- **Timeouts** - Set reasonable API timeouts
- **Fallbacks** - Always have fallback content ready

### Monitoring and Analytics

- **API Response Times** - Monitor search/recommendation latency
- **Error Rates** - Track failed API calls
- **Conversion Impact** - Measure business impact of personalization
- **Data Quality** - Monitor product data completeness

---

## 🆘 Troubleshooting

### Common Issues

**No search results:**

- Verify search index is configured and built
- Check product data was imported successfully
- Ensure correct RELEWISE_SERVER_URL

**Tracking not working:**

- Verify API credentials and permissions
- Check user identification setup
- Ensure proper event structure

**Import failures:**

- Validate product data structure against examples
- Check for missing required fields
- Verify data type formatting

### Getting Help

- **Documentation:** [docs.relewise.com](https://docs.relewise.com)
- **API Reference:** [Swagger API docs](https://docs.relewise.com/swagger/index.html)
- **Support:** Contact Relewise support team
- **Community:** Join Relewise Slack community

---

## 🎉 Next Steps

Congratulations! You now have a working Relewise implementation with:

✅ **Complete Entity Management** - Product import with real data structure  
✅ **Behavioral Tracking** - Full user journey tracking (views, searches, cart, purchases)  
✅ **Search Implementation** - Basic, category, and personalized search with CDP integration  
✅ **Recommendations** - Popular products and collaborative filtering  
✅ **Production-Ready Patterns** - Shared configuration, error handling, type safety

### What You've Built

**1. Comprehensive Examples Library**

- 📊 `basicTrackingExample` - Complete behavioral tracking
- 📥 `productImportExample` - Real product data import
- 🔍 `searchExample` - Basic product search with facets
- 🔍 `searchCategoryExample` - Category-based navigation
- 🔍 `cdpPersonalizedSearchExample` - Advanced personalization with external data
- 🎯 `popularProductsExample` - Popularity-based recommendations
- 🎯 `purchasedWithProductExample` - Collaborative filtering

**2. Production Architecture**

- Shared configuration eliminating code duplication
- Environment-driven settings for multiple deployments
- Type-safe external data integration patterns
- Comprehensive error handling and fallbacks
- Real product data aligned with your actual catalog

**3. Advanced Integration Patterns**

- CDP (Customer Data Platform) integration
- External API simulation (weather, social trends, ML models)
- Relevance modifiers with proper SDK syntax
- Multi-language and multi-currency support
- Development guidelines preventing SDK syntax errors

Here's what to do next:

1. **Customize for your use case** - Adapt examples to your specific requirements
2. **Implement A/B testing** - Test different recommendation strategies
3. **Add advanced features** - Explore advanced relevance modifiers
4. **Monitor and optimize** - Track performance and business impact
5. **Scale up** - Implement across all product touchpoints

### Advanced Topics to Explore

- **Content search** - Implement search for blogs, support articles
- **Multi-language** - Setup for international markets
- **B2B features** - Company-based personalization
- **Advanced analytics** - Custom reporting and insights
- **Machine learning** - Custom relevance models

---

**🚀 Happy building with Relewise!**

_This tutorial covers the essential implementation steps following [official Relewise implementation guidelines](https://docs.relewise.com/docs/developer/implementation-steps.html). For production use, review the [Best Practices documentation](https://docs.relewise.com/docs/developer/bestpractices/) and consult with your Relewise account team._
