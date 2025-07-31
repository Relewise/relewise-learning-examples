import 'dotenv/config';
import path from 'path';
import fs from 'fs';

const sampleName = process.argv[2];

if (!sampleName) {
  console.error('❌ Please specify a sample to run.');
  console.log('Example: npm run dev searchExample');
  listAvailableSamples();
  process.exit(1);
}

async function runSample() {
  try {
    const samplePath = path.resolve(__dirname, `${sampleName}.ts`);
    if (!fs.existsSync(samplePath)) {
      console.error(`❌ Sample "${sampleName}" not found in src/`);
      listAvailableSamples();
      process.exit(1);
    }

    console.log(`🚀 Running sample: ${sampleName}`);
    await import(samplePath);
  } catch (err) {
    console.error(`❌ Error running sample "${sampleName}":`, err);
  }
}

function listAvailableSamples() {
  console.log('\nAvailable samples:');
  const files = fs.readdirSync(__dirname).filter((f) => f.endsWith('Example.ts'));
  files.forEach((file) => console.log(' - ' + file.replace('.ts', '')));
}

runSample();