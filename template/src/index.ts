import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [sampleName, ...sampleArgs] = process.argv.slice(2);

if (!sampleName) {
    console.error('❌ Please specify a sample to run.');
    console.log('Example: npm run dev searchExample');
    listAvailableSamples();
    process.exit(1);
}

async function runSample() {
    try {
        // Try to find the sample in subdirectories first
        const possiblePaths = [
            path.resolve(__dirname, `examples/search/${sampleName}.ts`),
            path.resolve(__dirname, `examples/search/${sampleName}.js`),
            path.resolve(__dirname, `examples/recommendations/${sampleName}.ts`),
            path.resolve(__dirname, `examples/recommendations/${sampleName}.js`),
            path.resolve(__dirname, `examples/import/${sampleName}.ts`),
            path.resolve(__dirname, `examples/import/${sampleName}.js`),
            path.resolve(__dirname, `examples/tracking/${sampleName}.ts`),
            path.resolve(__dirname, `examples/tracking/${sampleName}.js`),
            path.resolve(__dirname, `${sampleName}.ts`),
            path.resolve(__dirname, `${sampleName}.js`),
        ];

        let samplePath = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                samplePath = p;
                break;
            }
        }

        if (!samplePath) {
            console.error(`❌ Sample "${sampleName}" not found`);
            listAvailableSamples();
            process.exit(1);
        }

        console.log(`🚀 Running sample: ${sampleName}`);
        const sampleModule = await import(samplePath);

        // If the sample exports a default function, execute it with CLI args
        if (typeof sampleModule.default === 'function') {
            await sampleModule.default(...sampleArgs);
        }
    } catch (err) {
        console.error(`❌ Error running sample "${sampleName}":`, err);
    }
}

function listAvailableSamples() {
    console.log('\nAvailable samples:');

    const searchDir = path.resolve(__dirname, 'examples/search');
    const recsDir = path.resolve(__dirname, 'examples/recommendations');
    const importDir = path.resolve(__dirname, 'examples/import');
    const trackingDir = path.resolve(__dirname, 'examples/tracking');

    // Search examples
    if (fs.existsSync(searchDir)) {
        console.log('\n📍 Search Examples:');
        const searchFiles = fs
            .readdirSync(searchDir)
            .filter((f) => f.endsWith('Example.ts') || f.endsWith('Example.js'));
        searchFiles.forEach((file) => console.log(' - ' + file.replace(/\.(ts|js)$/, '')));
    }

    // Recommendation examples
    if (fs.existsSync(recsDir)) {
        console.log('\n🎯 Recommendation Examples:');
        const recFiles = fs
            .readdirSync(recsDir)
            .filter((f) => f.endsWith('Example.ts') || f.endsWith('Example.js'));
        recFiles.forEach((file) => console.log(' - ' + file.replace(/\.(ts|js)$/, '')));
    }

    // Import examples
    if (fs.existsSync(importDir)) {
        console.log('\n📥 Import Examples:');
        const importFiles = fs
            .readdirSync(importDir)
            .filter((f) => f.endsWith('Example.ts') || f.endsWith('Example.js'));
        importFiles.forEach((file) => console.log(' - ' + file.replace(/\.(ts|js)$/, '')));
    }

    // Tracking examples
    if (fs.existsSync(trackingDir)) {
        console.log('\n📊 Tracking Examples:');
        const trackingFiles = fs
            .readdirSync(trackingDir)
            .filter((f) => f.endsWith('Example.ts') || f.endsWith('Example.js'));
        trackingFiles.forEach((file) => console.log(' - ' + file.replace(/\.(ts|js)$/, '')));
    }

    // Root level examples (legacy)
    const rootFiles = fs
        .readdirSync(__dirname)
        .filter((f) => f.endsWith('Example.ts') || f.endsWith('Example.js'));
    if (rootFiles.length > 0) {
        console.log('\n📁 Other Examples:');
        rootFiles.forEach((file) => console.log(' - ' + file.replace(/\.(ts|js)$/, '')));
    }
}

runSample();
