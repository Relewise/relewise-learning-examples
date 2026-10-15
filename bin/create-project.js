import { copyFile, cp, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const templateDirectory = fileURLToPath(new URL('../template/', import.meta.url));

export async function createProject(projectName, description, directory = process.cwd()) {
    if (!/^[a-z][a-z0-9-]*$/.test(projectName)) {
        throw new Error(
            'Use a project name starting with a lowercase letter, followed by lowercase letters, digits or hyphens.',
        );
    }

    const projectDirectory = path.join(directory, projectName);
    // mkdir refuses an existing destination before we copy or change any files.
    try {
        await mkdir(projectDirectory);
    } catch (error) {
        if (error.code === 'EEXIST') {
            throw new Error('The destination already exists. Choose a new project name.');
        }
        throw error;
    }

    await cp(templateDirectory, projectDirectory, {
        recursive: true,
        force: false,
        // Also allow running the CLI from a checkout used for local development.
        filter: (source) =>
            !['node_modules', 'dist', '.git', '.gitignore', '.env', 'package-lock.json'].includes(
                path.basename(source),
            ),
    });
    await rename(
        path.join(projectDirectory, 'gitignore.template'),
        path.join(projectDirectory, '.gitignore'),
    );
    await rename(path.join(projectDirectory, '.env.local'), path.join(projectDirectory, '.env'));
    await copyFile(new URL('../LICENSE', import.meta.url), path.join(projectDirectory, 'LICENSE'));

    const packagePath = path.join(projectDirectory, 'package.json');
    const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
    packageJson.name = projectName;
    packageJson.description = description;
    await writeFile(packagePath, JSON.stringify(packageJson, null, 4) + '\n');
    return projectDirectory;
}
