# Script JS Circular Dependency Audit

## Scope
- script/*.js excluding main.js
- Files: bootstrap.js, constants.js, drive-backup.js, i18n-keys.js, i18n.js, lucide.min.js, opfs-utils.js, shared-utils.js, worker.js

## Dependency Summary (Static Imports)
- bootstrap.js -> ./constants.js, ./i18n.js, ./shared-utils.js
- drive-backup.js -> ./i18n.js, ./shared-utils.js
- i18n.js -> ./i18n-keys.js, ./locales/en.js, ./locales/ja.js, ./locales/ko.js, ./locales/zh-CN.js
- opfs-utils.js -> ./constants.js
- shared-utils.js -> ./constants.js, ./i18n.js, ./opfs-utils.js
- worker.js -> ./constants.js, ./opfs-utils.js
- constants.js, i18n-keys.js, lucide.min.js -> no local imports

## Findings
- No circular dependencies detected among the static ES module imports above.
- Potential risk: `shared-utils.js` depends on `i18n.js`. If `i18n.js` (or any of its locale modules) later imports `shared-utils.js`, that will create a cycle. The current direction is safe but fragile.

## Improvement Direction (Prevent Future Cycles)
1. Keep `constants.js` and `i18n-keys.js` as leaf modules and avoid adding imports to them.
2. Split i18n-dependent helpers out of `shared-utils.js` into `shared-utils-i18n.js` (or similar) so that `shared-utils.js` remains a pure utility layer without i18n coupling.
3. Add a lint or build check for cycles (e.g., ESLint `import/no-cycle` or a small script that fails CI when cycles appear).
4. Document allowed dependency directions (e.g., `constants -> opfs-utils -> worker`, `i18n-keys -> i18n -> app modules`) to make cycles easier to spot in review.

## Validation
- Re-run the import graph check after any new module additions.
- Ensure no module in the i18n layer imports from `shared-utils.js` or other higher-level modules.
