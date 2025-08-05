# Adhoc Relewise POC Scaffolder

This is an **internal CLI tool** for quickly scaffolding new Relewise Proof-of-Concept (POC) projects with a preconfigured Node.js + TypeScript setup.  

📖 **[View the Complete Quickstart Guide →](./template/QUICKSTART.md)**  

It includes:
- TypeScript (with strict settings)
- ESLint + Prettier preconfigured (with custom formatting rules)
- Relewise SDK (`@relewise/client`, `@relewise/integrations`)
- `.vscode` launch configuration with MCP server integration
- Comprehensive `examples/` folder with search, recommendations, import, and tracking
- Configuration management with `src/config/relewiseConfig.ts`
- Type definitions and utilities for external data integration
- Example `docs/` folder for internal documentation
- Ready-to-use `src/` folder with utilities and starter code
- **QUICKSTART.md** - Complete step-by-step tutorial
- Git initialization (optional)
- Automatic dependency installation

---

## 🚀 Usage

You can run this CLI directly from GitHub using `npx`:

```bash
npx github:Relewise/adhoc-relewise-poc
```

You will be prompted for:
1. **Project name** – The folder name for the new project.
2. **Description** – Used in `package.json`.
3. **Git initialization** – Whether to automatically run `git init`.

### 📋 Required Relewise Credentials

Before running examples, you'll need:

- **Dataset ID** - Your Relewise dataset identifier
- **API Key** - Must have **Read & Write permissions** for:
  - Product search and recommendations
  - User tracking and behavioral data
  - Product import/export operations
- **Server URL** - Use sandbox for testing: `https://sandbox-api.relewise.com`

> 💡 **Tip**: Start with the sandbox environment for development. You can find your credentials in the Relewise dashboard under Settings > API Keys.

For complete setup instructions, see the **[QUICKSTART.md](./template/QUICKSTART.md)** guide included with every generated project.

---

## 📂 Project Structure

When generated, a new project will look like this:

```
MY-RELEWISE-POC/
├── .github/
│   └── copilot-instructions.md
├── .vscode/
│   ├── launch.json
│   ├── mcp.json
│   └── settings.json
├── docs/
│   └── relewise-response-patterns.md
├── product_data/
│   └── product_data_example.json
├── src/
│   ├── config/
│   │   └── relewiseConfig.ts
│   ├── examples/
│   │   ├── import/
│   │   │   └── productImportExample.ts
│   │   ├── recommendations/
│   │   │   ├── popularProductsExample.ts
│   │   │   └── purchasedWithProductExample.ts
│   │   ├── search/
│   │   │   ├── cdpPersonalizedSearchExample.ts
│   │   │   ├── searchCategoryExample.ts
│   │   │   └── searchExample.ts
│   │   ├── tracking/
│   │   │   └── basicTrackingExample.ts
│   │   └── README.md
│   ├── types/
│   │   ├── externalData.ts
│   │   └── interfaces.ts
│   ├── utils/
│   │   ├── externalDataServices.ts
│   │   └── relewiseTypeGuards.ts
│   └── index.ts
├── .env.local
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── package-lock.json
├── package.json
├── QUICKSTART.md
├── README.md
└── tsconfig.json
```

## 🛠️ How It Works

The CLI (`bin/index.js`):
1. **Prompts for project details** using `inquirer`.
2. **Copies** the `template/` directory to the target folder.
3. **Removes any `.git` folder** from the template (to start fresh).
4. **Updates `package.json`** with the project name and description.
5. **Runs `npm install`** to install all dependencies.
6. **Initializes Git** if requested.

---

## ✨ Example

```bash
$ npx github:Relewise/adhoc-relewise-poc

🚀 Welcome to the Adhoc Relewise POC scaffolder!

? Project name: my-relewise-poc
? Project description: Test POC for Relewise
? Initialize a new Git repository? (Y/n) Y

📂 Creating project in /path/to/my-relewise-poc
🧹 Removed template .git folder
📦 Installing dependencies (this may take a minute)...
🔧 Initializing Git repository...

✅ Project scaffolded successfully!

Next steps:
  cd my-relewise-poc
  
  # 1. Configure your environment variables
  # Edit .env with your Relewise credentials (already created from template)
  nano .env
  
  # 2. Follow the quickstart tutorial
  cat QUICKSTART.md
  
  # 3. Run examples
  npm run dev searchExample "headphones"
  npm run dev popularProductsExample
```

---

## 🧩 Template Project

The template includes:
- **TypeScript** (`tsconfig.json` with strict settings and ES modules)
- **Linting & Formatting** (`eslint`, `prettier` with custom rules)
- **Relewise SDK** preinstalled with latest versions
- **VS Code Integration**:
  - Debug configurations (`.vscode/launch.json`)
  - MCP server for Relewise documentation (`.vscode/mcp.json`)
  - Workspace settings (`.vscode/settings.json`)
- **Comprehensive Examples**:
  - Search (basic, category, personalized with CDP)
  - Recommendations (popular products, purchased-with-product)
  - Product import with multilingual support
  - User tracking implementation
- **Configuration Management**:
  - Centralized Relewise configuration (`src/config/relewiseConfig.ts`)
  - Environment variable validation
  - Pre-configured clients (searcher, recommender, integrator)
- **Type Safety**:
  - Custom type definitions (`src/types/`)
  - Type guards for external data (`src/utils/relewiseTypeGuards.ts`)
- **Documentation**:
  - Complete quickstart tutorial (`QUICKSTART.md`)
  - Copilot instructions for AI assistance (`.github/copilot-instructions.md`)
  - Example documentation patterns (`docs/`)
- **Real Product Data**: Sample dataset for immediate testing (`product_data/`)

---

## 🛡 Requirements

- **Node.js** 18+
- **npm** 9+ (or `npx` support)

---

## ⚙️ Development (for the CLI itself)

If you are modifying this CLI:
```bash
git clone git@github.com:Relewise/adhoc-relewise-poc.git
cd adhoc-relewise-poc
npm install
npm link  # to test locally
adhoc-relewise-poc my-local-test
```

---

## 🎯 Available Examples

The generated project includes comprehensive examples that you can run immediately:

### Search Examples
```bash
npm run dev searchExample "headphones"
npm run dev searchCategoryExample "5"  # Hi-Fi category from sample data
npm run dev cdpPersonalizedSearchExample user_1 "headphones"
```

### Recommendation Examples
```bash
npm run dev popularProductsExample
npm run dev purchasedWithProductExample "00198c54-6c62-4e08-be40-a539963985d0"
```

> **Note**: The `purchasedWithProductExample` returns recommendations with `rank` scores. Lower rank values (e.g., 1, 2, 3) indicate stronger relevance - products ranked 1 are most commonly purchased together with the specified product. Results are sorted in ascending order by rank for optimal relevance.

### Import & Tracking Examples
```bash
npm run dev productImportExample
npm run dev basicTrackingExample
```

Each example is fully documented and uses real product data from the included `product_data_example.json` file.

---

## 📚 Getting Started Guide

The generated project includes a comprehensive `QUICKSTART.md` that provides:

- **Step-by-step setup instructions** with environment configuration
- **Implementation walkthrough** following official Relewise documentation
- **Hands-on examples** you can run immediately
- **Best practices** for production implementation
- **Troubleshooting guide** for common issues

### Key Features:
- Environment setup with `.env.local` template
- SDK verification process for reliable integrations
- Real product data examples with multilingual support
- CDP integration patterns for personalized experiences

### VS Code Integration:
- **MCP Server**: Direct access to Relewise documentation within VS Code
- **Debug Configurations**: Pre-configured launch settings for all examples
- **AI Assistance**: Copilot instructions for accurate Relewise SDK usage

---

## 📄 Product Data Structure

The `product_data_example.json` file contains an array of products to be used for the Product import example.
Each product is structured to support **multi-language**, **multi-market**, and **multi-channel** contexts.

### High-Level Structure

- **Identification & Metadata**
  - `unique_id`: Unique product identifier.
  - `brand`: Object with `id` and `displayName`.
  - `channels`: Sales channels (e.g., `B2C`, `B2B`).
  - `markets`: Markets where the product is available (e.g., `dk`, `gb`, `se`).

- **Product Information**
  - `name` and `description`: Arrays with localized values for multiple languages.
  - `image`: URL to the product image.

- **Category Information**
  - `mainCategory`: The main category object:
    - `id`: Category ID.
    - `name`: Localized category names.
    - `subCategory`: Nested object with:
      - `id`: Subcategory ID.
      - `name`: Localized subcategory names.

- **Pricing & Availability**
  - `list_price` and `sales_price`: Arrays of price objects (amount and currency).
  - `OnSale`, `soldOut`, `lowStock`: Arrays with localized boolean values.
  - `availability`: Localized stock availability.
  - `margin`: Profit margin classification (e.g., `Low`, `Medium`, `High`).

- **Promotion & Campaigns**
  - `promoted`: Optional flags for promotions (localized).
  - `campaignIds`: Linked campaign identifiers if applicable.

- **Additional Attributes**
  - `daysAvailable`: Number of days available (nullable).
  - `salesStatus`: Current sales state (nullable).

This structure provides everything required for building product search, recommendations, and merchandising features.

### Example

```json
{
  "unique_id": "12345",
  "brand": { "id": "bose", "displayName": "Bose" },
  "channels": ["B2C"],
  "markets": ["en"],
  "name": [{ "language": "en-gb", "value": "Noise cancelling headphones" }],
  "mainCategory": {
    "id": "audio",
    "name": [{ "language": "en-gb", "value": "Audio" }],
    "subCategory": {
      "id": "headphones",
      "name": [{ "language": "en-gb", "value": "Headphones" }]
    }
  },
  "sales_price": [{ "amount": 1999, "currency": "GBP" }],
  "availability": [{ "language": "en-gb", "value": 12 }],
  "margin": "High"
}
```
