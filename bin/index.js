#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import inquirer from 'inquirer';
import { createProject } from './create-project.js';

const args = process.argv.slice(2);

async function main() {
    if (args.includes('--help') || args.includes('-h')) {
        console.log(
            'Create a Relewise learning project.\n\nUsage: npx @relewise/create-relewise-learning-example\n\nOptions: --help, --version',
        );
        return;
    }
    if (args.includes('--version') || args.includes('-v')) {
        const packageJson = JSON.parse(
            await readFile(new URL('../package.json', import.meta.url), 'utf8'),
        );
        console.log(packageJson.version);
        return;
    }

    const { projectName, description, initGit } = await inquirer.prompt([
        { name: 'projectName', message: 'Project name:', default: 'my-relewise-examples' },
        {
            name: 'description',
            message: 'Description:',
            default: 'Learn Relewise with TypeScript examples',
        },
        { name: 'initGit', type: 'confirm', message: 'Initialize Git?', default: true },
    ]);

    const projectDirectory = await createProject(projectName, description);
    console.log('Installing dependencies and building the examples...');
    execSync('npm install', { cwd: projectDirectory, stdio: 'inherit' });
    execSync('npm run build', { cwd: projectDirectory, stdio: 'inherit' });
    if (initGit) {
        execSync('git init', { cwd: projectDirectory, stdio: 'inherit' });
    }

    console.log('\nCreated ' + projectDirectory);
    console.log('Open QUICKSTART.md, fill in .env, and start with the product import.');
    console.log('\n  cd ' + projectName + '\n  npm run dev -- --help');
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
