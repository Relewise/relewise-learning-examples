#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function showHelp() {
  console.log(`
🚀 Create Relewise Learning Example

A CLI tool to scaffold new Relewise learning projects with TypeScript, examples, and AI instructions.

USAGE:
  npx @relewise/create-relewise-learning-example
  npx github:Relewise/adhoc-relewise-examples

OPTIONS:
  -h, --help     Show this help message
  -v, --version  Show version number

DESCRIPTION:
  This tool creates a new Relewise learning project with:
  - TypeScript configuration
  - ESLint + Prettier setup
  - Relewise SDK integration
  - Example code for search, recommendations, tracking
  - AI instructions and documentation
  - VS Code configuration

EXAMPLES:
  npx @relewise/create-relewise-learning-example
  npx github:Relewise/adhoc-relewise-examples

For more information, visit: https://github.com/Relewise/adhoc-relewise-examples
`);
}

function showVersion() {
  // Read version from package.json
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(packageJson.version);
}

// Check for command line arguments
const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
  showHelp();
  process.exit(0);
}

if (args.includes('-v') || args.includes('--version')) {
  showVersion();
  process.exit(0);
}

async function scaffold() {
  console.log('🚀 Welcome to the Relewise examples and AI instructions setup!\n');

  // 1. Prompt user for details
  const answers = await inquirer.prompt([
    {
      name: 'projectName',
      message: 'Project name:',
      default: 'my-relewise-examples'
    },
    {
      name: 'description',
      message: 'Project description:',
      default: 'Relewise examples and AI instructions for learning and experimentation'
    },
    {
      name: 'initGit',
      type: 'confirm',
      message: 'Initialize a new Git repository?',
      default: true
    }
  ]);

  const projectPath = path.resolve(process.cwd(), answers.projectName);
  console.log(`\n📂 Creating project in ${projectPath}`);

  // 2. Copy template (including dotfiles)
  const templateDir = path.join(__dirname, '../template');
  await fs.copy(templateDir, projectPath, {
    overwrite: true,
    filter: () => true // Ensures dotfiles like .gitignore are included
  });

  // 3. Remove any .git folder from template
  const gitFolder = path.join(projectPath, '.git');
  if (await fs.pathExists(gitFolder)) {
    await fs.remove(gitFolder);
    console.log('🧹 Removed template .git folder');
  }

  // 4. Fix .gitignore if npm renamed it
  const gitignoreCopyPath = path.join(projectPath, '.gitignore copy');
  const gitignorePath = path.join(projectPath, '.gitignore');
  if (await fs.pathExists(gitignoreCopyPath)) {
    await fs.move(gitignoreCopyPath, gitignorePath, { overwrite: true });
    console.log('🔄 Renamed ".gitignore copy" → ".gitignore"');
  }

  // 5. Rename .env.local to .env if it exists
  const envLocalPath = path.join(projectPath, '.env.local');
  const envPath = path.join(projectPath, '.env');
  if (await fs.pathExists(envLocalPath)) {
    await fs.move(envLocalPath, envPath, { overwrite: true });
    console.log('🔑 Renamed .env.local → .env');
  }

  // 6. Update package.json with project name & description
  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = await fs.readJSON(pkgPath);
  pkg.name = answers.projectName;
  pkg.description = answers.description;
  await fs.writeJSON(pkgPath, pkg, { spaces: 2 });

  // 7. Install dependencies
  console.log('📦 Installing dependencies (this may take a minute)...');
  execSync('npm install', { cwd: projectPath, stdio: 'inherit' });

  // 8. Build the project
  console.log('🔨 Building the project...');
  execSync('npm run build', { cwd: projectPath, stdio: 'inherit' });

  // 9. Initialize Git repo if selected
  if (answers.initGit) {
    console.log('🔧 Initializing Git repository...');
    execSync('git init', { cwd: projectPath, stdio: 'inherit' });
  }

  // 10. Reminder about environment variables
  console.log(`
⚠️  IMPORTANT: Update the environment variables in ${answers.projectName}/.env
They are already pre-filled with placeholders:
---------------------------------------------------------
RELEWISE_DATASET_ID=<YOUR-DATASET-ID>
RELEWISE_API_KEY=<YOUR-API-KEY>
RELEWISE_SERVER_URL=<YOUR-SERVER-URL>
---------------------------------------------------------
  `);

  console.log('\n✅ Project scaffolded successfully!');
  console.log(`\nNext steps:
  cd ${answers.projectName}
  npm run dev`);
}

scaffold().catch(err => {
  console.error('❌ Error scaffolding project:', err);
  process.exit(1);
});
