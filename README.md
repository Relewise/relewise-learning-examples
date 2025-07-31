# Adhoc Relewise POC Scaffolder

This is an **internal CLI tool** for quickly scaffolding new Relewise Proof-of-Concept (POC) projects with a preconfigured Node.js + TypeScript setup.  

It includes:
- TypeScript (with strict settings)
- ESLint + Prettier preconfigured
- Relewise SDK (`@relewise/client`, `@relewise/integrations`)
- `.vscode` launch configuration
- Example `docs/` folder for internal documentation
- Ready-to-use `src/` folder with utilities and starter code
- Git initialization (optional)
- Automatic dependency installation

---

## 🚀 Usage

You can run this CLI directly from GitHub using `npx`:

```bash
npx github:<your-org-or-username>/adhoc-relewise-poc
```

You will be prompted for:
1. **Project name** – The folder name for the new project.
2. **Description** – Used in `package.json`.
3. **Git initialization** – Whether to automatically run `git init`.

---

## 📂 Project Structure

When generated, a new project will look like this:

```
my-relewise-poc/
├─ .github/
│  └─ copilot-instructions.md
├─ .vscode/
│  └─ launch.json
├─ docs/
│  └─ relewise-response-patterns.md
├─ src/
│  ├─ utils/
│  │  └─ relewiseTypeGuards.ts
│  └─ index.ts
├─ .gitignore
├─ eslint.config.js
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

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
$ npx github:your-org/adhoc-relewise-poc

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
  npm run dev
```

---

## 🧩 Template Project

The template includes:
- **TypeScript** (`tsconfig.json` based on internal standards)
- **Linting & Formatting** (`eslint`, `prettier`)
- **Relewise SDK** preinstalled
- `.vscode` folder for debugging
- `docs/` folder for documentation
- Example utilities under `src/utils`

---

## 🛡 Requirements

- **Node.js** 18+
- **npm** 9+ (or `npx` support)

---

## ⚙️ Development (for the CLI itself)

If you are modifying this CLI:
```bash
git clone git@github.com:your-org/adhoc-relewise-poc.git
cd adhoc-relewise-poc
npm install
npm link  # to test locally
adhoc-relewise-poc my-local-test
```
