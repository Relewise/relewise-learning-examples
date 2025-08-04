#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scaffold() {
  console.log('🚀 Welcome to the Relewise example and POC scaffolder!\n');

  // 1. Prompt user for details
  const answers = await inquirer.prompt([
    {
      name: 'projectName',
      message: 'Project name:',
      default: 'my-relewise-poc'
    },
    {
      name: 'description',
      message: 'Project description:',
      default: 'An Adhoc Relewise Proof of Concept project'
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

  // 8. Initialize Git repo if selected
  if (answers.initGit) {
    console.log('🔧 Initializing Git repository...');
    execSync('git init', { cwd: projectPath, stdio: 'inherit' });
  }

  // 9. Reminder about environment variables
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