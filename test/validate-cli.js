#!/usr/bin/env node

// Simple validation test for the CLI
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Test that the CLI can be executed and shows help
  const binPath = path.join(__dirname, '..', 'bin', 'index.js');
  execSync(`node ${binPath} --help`, { stdio: 'pipe' });
  console.log('✅ CLI validation passed');
  process.exit(0);
} catch (error) {
  console.error('❌ CLI validation failed:', error.message);
  process.exit(1);
}
