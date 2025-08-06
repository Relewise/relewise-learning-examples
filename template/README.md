# Relewise TypeScript SDK Integration Examples

A comprehensive collection of **educational examples** demonstrating advanced integration patterns with the [Relewise SDK](https://github.com/Relewise/relewise-sdk-javascript).

## 🚀 Quick Start

1. **Clone and install dependencies**:

    ```bash
    npm install
    ```

2. **Configure environment** (`.env`):

    ```env
    RELEWISE_DATASET_ID=your-dataset-id
    RELEWISE_API_KEY=your-api-key
    RELEWISE_SERVER_URL=https://api.relewise.com  # or https://sandbox-api.relewise.com
    LANGUAGE=en-gb
    CURRENCY=EUR
    ```

3. **Build and run examples**:
    ```bash
    npm run build
    npm run dev termBasedSearchExample "headphones"
    npm run dev categoryBasedSearchExample "5"
    npm run dev cdpPersonalizedSearchExample user_1 "headphones"
    npm run dev popularProductsExample
    ```

## 📁 Project Structure

```
src/
├── config/
│   └── relewiseConfig.ts          # Shared configuration & pre-configured clients
├── examples/
│   ├── search/                    # Search examples with real product data
│   ├── recommendations/           # Recommendation examples
│   ├── import/                    # Product import examples
│   └── README.md                  # Detailed examples documentation
├── types/
│   ├── interfaces.ts              # Product data type definitions
│   └── externalData.ts           # External integration type definitions
└── utils/
    ├── relewiseTypeGuards.ts     # Type-safe response validation
    └── externalDataServices.ts   # Mock external API services
```

## 🎯 Featured Examples

### 🔍 **CDP-Driven Personalized Search**

Demonstrates integration with Customer Data Platform insights for personalized search experiences:

- Real-time user profiling from external CDP
- Brand affinity and preference-based filtering
- Fallback handling when external services are unavailable
- Type-safe external data integration patterns
- **Comprehensive relevance modifier examples** (commented) using the correct SDK syntax with `DataValueFactory`, `ValueSelectorFactory`, and condition builders for brand boosting, price preferences, browse abandonment recovery, and campaign-based targeting

### 🎯 **Smart Recommendations**

Production-ready recommendation examples using real product data:

- Popular products with configurable algorithms
- Collaborative filtering ("Purchased With Product")
- Real product IDs and brand data from actual catalog

### 📥 **Batch Product Import**

Efficient product data synchronization with Relewise:

- Loads actual product data from JSON
- Multilingual support with DataValueFactory
- Batch processing for performance
- Comprehensive field mapping including custom data

## 🔧 Key Features

### ✅ **Real Product Data Integration**

All examples use **actual product data** instead of mock data:

- **Real Brands**: Bose, Sony, Samsung, LG, Philips, Logitech, HP, Dell, JBL
- **Real Product IDs**: Actual UUIDs from your product catalog
- **Real Categories**: Hi-Fi, Headphones, Computers and accessories, Monitors
- **Realistic Pricing**: Market-aligned price ranges for each category

### ✅ **Zero Code Duplication**

- Shared configuration eliminates boilerplate across all examples
- Pre-configured clients (`searcher`, `recommender`, `integrator`)
- Consistent environment variable handling
- Reusable utility functions and type guards

### ✅ **Production Patterns**

- **Type Safety**: Strong TypeScript typing throughout
- **Error Handling**: Graceful fallbacks and comprehensive error logging
- **Environment-driven**: All configuration via environment variables
- **Performance**: Batch operations and efficient API usage
- **Documentation**: Comprehensive JSDoc for AI code generation

### ✅ **External Integration Ready**

- Mock services for CDP, weather, ML models, social trends
- Type-safe external data structures
- Realistic simulation of external API delays and responses
- Clear patterns for replacing mocks with real services

## 📚 Available Examples

| Example                               | Description             | Key Features                                      |
| ------------------------------------- | ----------------------- | ------------------------------------------------- |
| **`termBasedSearchExample.ts`**       | Term-based search       | Facets, filters, term predictions, real data      |
| **`categoryBasedSearchExample.ts`**   | Category PLP search     | Category filtering, breadcrumbs, PLP patterns     |
| **`searchCategoryExample.ts`**        | Category search         | Hierarchy navigation, faceted browsing            |
| **`cdpPersonalizedSearchExample.ts`** | CDP integration         | User profiling, brand preferences, external data  |
| **`popularProductsExample.ts`**       | Popular products        | Popularity algorithms, type-safe responses        |
| **`purchasedWithProductExample.ts`**  | Collaborative filtering | "Purchased with" recommendations                  |
| **`productImportExample.ts`**         | Batch import            | Real data loading, multilingual, DataValueFactory |

## 🎮 Running Examples

```bash
# Search with real product terms
npm run dev termBasedSearchExample "headphones"
npm run dev termBasedSearchExample "monitor"

# Category-based search for PLPs
npm run dev categoryBasedSearchExample "5"  # Hi-Fi category
npm run dev categoryBasedSearchExample "10" # Computers category

# Personalized search with user context
npm run dev cdpPersonalizedSearchExample user_1 "headphones"
npm run dev cdpPersonalizedSearchExample user_2 "monitor"

# Recommendations with real product IDs
npm run dev popularProductsExample
npm run dev purchasedWithProductExample "00198c54-6c62-4e08-be40-a539963985d0"

# Import actual product data
npm run dev productImportExample
```

## 🔗 Important Resources

- **[Relewise TypeScript SDK](https://github.com/Relewise/relewise-sdk-javascript)** - Source code and latest updates
- **[Official Documentation](https://docs.relewise.com)** - API reference and guides
- **[TypeScript Examples](https://docs.relewise.com/docs/examples/ts/)** - Additional official examples
- **[Copilot Instructions](.github/copilot-instructions.md)** - AI assistant guidelines for this project

## 🛠️ Development

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run dev

# Lint and format
npm run lint
npm run format

# Type checking
npx tsc --noEmit
```

## 📋 Prerequisites

- **Node.js** 18+
- **TypeScript** 5+
- **Relewise Account** with valid dataset ID and API key
- **Product Data** (included: `product_data/product_data_example.json`)

## 🔐 Environment Configuration

Ensure your `.env` file contains all required variables:

```env
# Required
RELEWISE_DATASET_ID=your-dataset-id
RELEWISE_API_KEY=your-api-key

# Server URL (choose one)
RELEWISE_SERVER_URL=https://api.relewise.com           # Production
# RELEWISE_SERVER_URL=https://sandbox-api.relewise.com  # Sandbox

# Optional (with fallbacks)
LANGUAGE=en-gb
CURRENCY=EUR
```

## 🤖 AI-Friendly Design

This project is optimized for AI code generation and assistance:

- **Comprehensive JSDoc** - Every function documented with types and examples
- **Consistent Patterns** - Builder pattern usage across all examples
- **Clear Structure** - Logical organization by feature and responsibility
- **Type Safety** - Strong typing prevents common integration errors
- **Real Data** - Examples work with actual product catalogs
- **Zero Duplication** - DRY principles for maintainable code

Perfect for use with GitHub Copilot, AI assistants, and automated code generation tools.
