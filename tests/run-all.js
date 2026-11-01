/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: Master Test Runner
 * Executes all automated test suites and verifies release readiness.
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFiles = [
  'rag.test.js',
  'grounding.test.js',
  'sentiment.test.js',
  'audio.test.js',
  'visualOverhaul.test.js',
  'deployment.test.js'
];

console.log('====================================================');
console.log('   ÁNIMAS: The Sovereign 3D Ofrenda — Test Suite   ');
console.log('====================================================\n');

let totalSuites = 0;
let passedSuites = 0;

for (const file of testFiles) {
  totalSuites++;
  const filePath = path.join(__dirname, file);
  console.log(`Running suite: ${file}...`);
  
  const result = spawnSync(process.execPath, ['--experimental-strip-types', '--test', filePath], {
    stdio: 'inherit',
    encoding: 'utf-8'
  });

  if (result.status === 0) {
    passedSuites++;
    console.log(`[PASS] ${file}\n`);
  } else {
    console.error(`[FAIL] ${file} exited with code ${result.status}\n`);
  }
}

console.log('----------------------------------------------------');
console.log(`Summary: ${passedSuites} / ${totalSuites} test suites passed.`);
console.log('----------------------------------------------------\n');

if (passedSuites !== totalSuites) {
  process.exit(1);
}
