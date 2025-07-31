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
    // Resolve correct extension depending on whether we are running in dev or after build
    const isTs = fs.existsSync(path.resolve(__dirname, `${sampleName}.ts`));
    const ext = isTs ? '.ts' : '.js';

    const samplePath = path.resolve(__dirname, `${sampleName}${ext}`);
    if (!fs.existsSync(samplePath)) {
      console.error(`❌ Sample "${sampleName}" not found in src/`);
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
  const files = fs
    .readdirSync(__dirname)
    .filter((f) => f.endsWith('Example.ts') || f.endsWith('Example.js'));
  files.forEach((file) => console.log(' - ' + file.replace(/\.(ts|js)$/, '')));
}

runSample();