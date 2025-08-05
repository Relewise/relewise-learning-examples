# Relewise Examples

This directory contains comprehensive examples demonstrating various Relewise SDK features and integration patterns.

## 📁 Folder Structure

### 🔍 Search Examples (`examples/search/`)

- **`termBasedSearchExample.ts`** - Term-based product search with facets, filters, and term predictions
- **`categoryBasedSearchExample.ts`** - Category-based search for Product Listing Pages (PLP) with breadcrumbs and filtering
- **`searchCategoryExample.ts`** - Product category hierarchy search with facets
- **`cdpPersonalizedSearchExample.ts`** - CDP-driven personalized search with external data integration

### 🎯 Recommendation Examples (`examples/recommendations/`)

- **`popularProductsExample.ts`** - Popular products recommendations with popularity algorithms
- **`purchasedWithProductExample.ts`** - "Purchased With Product" collaborative filtering recommendations

### 📥 Import Examples (`examples/import/`)

- **`productImportExample.ts`** - Product data import with multilingual support and DataValueFactory

## 🚀 Running Examples

Use the main entry point to run any example:

```bash
# Search examples
npm run dev termBasedSearchExample "headphones"
npm run dev categoryBasedSearchExample "5"  # Hi-Fi category
npm run dev searchCategoryExample "category-id"
npm run dev cdpPersonalizedSearchExample user_1 "headphones"

# Recommendation examples
npm run dev popularProductsExample
npm run dev purchasedWithProductExample "00198c54-6c62-4e08-be40-a539963985d0"

# Import examples
npm run dev productImportExample
```

## 🔧 Shared Configuration

All examples use shared configuration from `src/config/relewiseConfig.ts`:

- **Environment Variables**: Centralized loading and validation
- **Pre-configured Clients**: `searcher`, `recommender`, `integrator`
- **Shared Settings**: `createSettings()` function for consistent request settings
- **Constants**: `LANGUAGE`, `CURRENCY` with fallback defaults

## 🎨 Key Features Demonstrated

### Real Product Data Integration

All examples use **actual product data** from your `product_data/product_data_example.json` file:

- **Real Brands**: Bose, Sony, Samsung, LG, Philips, Logitech, HP, Dell, JBL, etc.
- **Real Product IDs**: Actual UUIDs like `00198c54-6c62-4e08-be40-a539963985d0`
- **Real Categories**: Hi-Fi, Headphones, Computers and accessories, Monitors, Peripherals
- **Realistic Price Ranges**: Aligned with actual product categories and market pricing

### External Data Integration

- **CDP Integration** (`cdpPersonalizedSearchExample.ts`) - Shows how to integrate Customer Data Platform insights
- **Mock Services** (`utils/externalDataServices.ts`) - Simulates external API calls for weather, social trends, ML models
- **Type Safety** (`types/externalData.ts`) - Strong typing for external data structures

### Advanced Patterns

- **Builder Pattern** - Consistent use of Relewise builders across all examples
- **Type Guards** - Safe response handling with custom type guards
- **Error Handling** - Graceful fallbacks when external services are unavailable
- **Batch Requests** - Efficient multiple request handling when appropriate

### Best Practices

- **DRY Principle** - No code duplication through shared configuration
- **Environment-driven** - All settings configurable via `.env`
- **Documentation** - Comprehensive JSDoc comments for AI code generation
- **Organized Structure** - Clear separation of concerns by feature type

## 🔮 Future Examples

Potential additions based on advanced Relewise features:

- Content search examples
- Advanced faceted search
- Multi-language search
- Search analytics and tracking
- Real-time inventory integration
- Weather/context-aware search
- ML model-driven personalization

## 📖 Documentation

Each example includes:

- **Comprehensive header comments** - Purpose, features, usage instructions
- **JSDoc function documentation** - Parameter descriptions and return types
- **Inline comments** - Explaining key concepts and SDK usage
- **Console logging** - Clear output showing what's happening

## 🔗 References

- [Relewise TypeScript SDK](https://github.com/Relewise/relewise-sdk-javascript)
- [Official Documentation](https://docs.relewise.com)
- [TypeScript Examples](https://docs.relewise.com/docs/examples/ts/)
- [Project Copilot Instructions](../.github/copilot-instructions.md)
