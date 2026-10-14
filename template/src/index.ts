import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const extension = path.extname(fileURLToPath(import.meta.url));
const groups = ['import', 'tracking', 'search', 'recommendations'];
const examples = groups.flatMap((group) =>
    readdirSync(path.join(directory, 'examples', group))
        .filter((file) => file.endsWith('Example' + extension))
        .map((file) => ({ name: path.basename(file, extension), group, file })),
);
const [name, ...args] = process.argv.slice(2);

async function main() {
    if (!name || name === '--help') {
        console.log('Source: npm run dev -- <example> [arguments]');
        console.log('Built:  npm start -- <example> [arguments]\n');
        for (const example of examples) {
            console.log(example.group + ': ' + example.name);
        }
        console.log(
            '\nStart with QUICKSTART.md. Import and tracking examples write to your dataset.',
        );
        return;
    }

    const example = examples.find((item) => item.name === name);
    if (!example) {
        throw new Error('Unknown example: ' + name + '. Run with --help to list examples.');
    }
    const filename = path.join(directory, 'examples', example.group, example.file);
    const sample = await import(pathToFileURL(filename).href);
    await sample.default(...args);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
