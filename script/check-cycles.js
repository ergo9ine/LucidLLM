/**
 * Simple Circular Dependency Checker for LucidLLM
 * This script performs a basic check for known cycle risks.
 */
import fs from 'fs';
import path from 'path';

const SCRIPT_DIR = 'script';
const FILES_TO_CHECK = [
    'shared-utils.js',
    'i18n.js',
    'constants.js',
    'opfs-utils.js',
    'i18n-keys.js'
];

console.log('[Cycle Check] Starting dependency scan...');

let hasError = false;

FILES_TO_CHECK.forEach(file => {
    const filePath = path.join(SCRIPT_DIR, file);
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf8');
    const imports = content.match(/from\s+["'](.+?)["']/g) || [];

    imports.forEach(imp => {
        const target = imp.match(/["'](.+?)["']/)[1];
        
        // Critical Rule: Core utilities should not import higher-level i18n-dependent utils
        if (file === 'shared-utils.js' && target.includes('i18n.js')) {
            console.error(`[Cycle Risk] ERROR: ${file} imports ${target}. This violates pure utility separation.`);
            hasError = true;
        }

        // Critical Rule: Constants should not import anything
        if (file === 'constants.js' && target.startsWith('./')) {
            console.error(`[Cycle Risk] ERROR: ${file} imports ${target}. Constants must be a leaf module.`);
            hasError = true;
        }
    });
});

if (!hasError) {
    console.log('[Cycle Check] SUCCESS: No obvious core circular dependencies detected.');
} else {
    process.exit(1);
}
