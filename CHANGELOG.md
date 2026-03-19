<!-- markdownlint-disable -->
<!-- eslint-disable markdown/no-missing-label-refs -->
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]


[b6f5319...26b2124](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/compare/b6f531911579f6b4c17f0506765941720d4a6ead...26b2124c54c5d0b8bc0853429651577e9cc79503)


### ✨ Features

- [`26b2124`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/26b2124c54c5d0b8bc0853429651577e9cc79503) — ✨ [feat] Rename plugin to eslint-plugin-immutable-2 and update related references

- Updated package name in package.json from eslint-plugin-immutable to eslint-plugin-immutable-2

- Changed plugin export shape documentation to reflect new name

- Updated plugin metadata name in src/plugin.ts

- Adjusted linting commands to use the new package name

- Modified test files to reference eslint-plugin-immutable-2 instead of eslint-plugin-immutable

- Updated type imports in test files to align with the new package name

- Ensured all tests reflect the new plugin name for consistency

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`c5bfd7f`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/c5bfd7f24517c4aef5a696efbd0cda097c69459a) — ✨ [feat] (sync) Add canonical metadata for README preset icon rendering

- Introduced `immutableConfigMetadataByName` for icon and order mapping

- Added `immutableConfigNamesByReadmeOrder` for stable rendering order

- Implemented `immutableConfigReferenceToName` for supported config references

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`adeab26`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/adeab26f93c9172fd879f9e8f4363bdaba1cb540) — ✨ [feat] Add rules to prevent state mutations in various APIs

- Introduced `no-cache-api-mutation` rule to disallow mutating Service Worker Cache API state via Cache/CacheStorage mutators.

- Introduced `no-cookie-mutation` rule to prevent mutations of cookie state via `document.cookie` and `CookieStore` methods.

- Introduced `no-dom-token-list-mutation` rule to disallow mutations of DOMTokenList state such as `classList`, `relList`, and `part`.

- Updated `no-stateful-regexp` rule to check for stateful regular expressions more accurately.

- Updated rule registry to include new rules and ensure proper exports.

- Added comprehensive tests for each new rule to validate functionality and ensure correct error reporting.

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`e720155`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/e7201550f353e86f7c116563aec8df27ad2be30e) — ✨ [feat] (rules) Introduce new rules to prevent mutations of global objects and properties

- 🎉 [feat] (rules) Add `no-location-mutation` rule to disallow mutations of the `location` object

- 🎉 [feat] (rules) Add `no-history-mutation` rule to prevent mutations of the `history` object

- 🎉 [feat] (rules) Add `no-regexp-lastindex-mutation` rule to prevent mutations of `RegExp#lastIndex`

- 🎉 [feat] (rules) Add tests for the new mutation prevention rules

- 🧪 [test] (no-history-mutation) Implement tests for `no-history-mutation` rule

- 🧪 [test] (no-location-mutation) Implement tests for `no-location-mutation` rule

- 🧪 [test] (no-regexp-lastindex-mutation) Implement tests for `no-regexp-lastindex-mutation` rule

- 🧹 [chore] (rules) Update rule registry to include new mutation prevention rules

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`d8a12d0`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/d8a12d0bbb50fcf59169a6a4814a050e4708dc7e) — ✨ [feat] Add mutation prevention rules for various data types

- Introduced rules to prevent mutations on atomic types, buffers, data views, dates, form data, headers, maps, process environment, reflect, stateful regex, storage, typed arrays, URLs, and URL search parameters.

- Each rule includes comprehensive test cases to validate both invalid and valid usage scenarios.

- Updated plugin entry to include new mutation rules for better enforcement of immutability in code.

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`73bd838`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/73bd838d2913238469e3c2161afb750fd801487c) — ✨ [feat] Enhance rule implementations and suggestions

- 🎨 [refactor] Update `no-method-signature` rule to suggest converting method signatures to readonly properties with detailed suggestions.

- 🎨 [refactor] Improve `no-mixed-interface` rule to ensure consistent member shapes in interfaces.

- 🎨 [refactor] Refactor `readonly-array` rule to enhance type checking and reporting for mutable arrays.

- 🎨 [refactor] Modify rule registry to streamline imports and maintain consistency.

- 🎨 [refactor] Revamp utility functions for better type safety and readability.

- 🧪 [test] Add tests for new suggestions in `no-method-signature` and `no-let` rules.

- 🧪 [test] Update tests for `no-mixed-interface` and `readonly-array` rules to reflect new behavior.

- 📝 [docs] Update documentation to reflect changes in rule behavior and suggestions.

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`ff927dc`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/ff927dc18a047336502e63a5c0ee044108e974f8) — ✨ [feat] Enhance documentation and examples for immutability rules

- 📝 [docs] Add additional examples for `immutable-data`, `no-class`, `no-conditional-statement`, `no-expression-statement`, `no-let`, `no-loop-statement`, `no-method-signature`, `no-mixed-interface`, `no-reject`, `no-this`, `no-throw`, `no-try`, `readonly-array`, and `readonly-keyword` rules

- 📝 [docs] Update ESLint flat config examples for various rules

- 📝 [docs] Include "When not to use it" sections for clarity on rule applicability

- 🧹 [chore] Modify heading requirements in documentation scripts to enforce additional sections

- 🎨 [style] Update SVG and PNG assets for improved visual consistency

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`2530f4a`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/2530f4a3df9c78ba678680eec6125a8adaed956f) — ✨ [feat] Add favicon and touch icons for improved branding

- Introduced multiple favicon sizes (16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 192x192, 256x256, 512x512) for better compatibility across platforms

- Added SVG favicon for scalable graphics

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`0a48267`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/0a48267efb2f8d1b26877939541401cf7484ce97) — ✨ [feat] Update TypeScript configuration files to include declaration files


- Added inclusion of declaration files (*.d.ts) in multiple TypeScript configuration files:
  
- `tsconfig.build.json`: Included `src/**/*.d.ts` to ensure declaration files are considered during the build process.
  
- `tsconfig.eslint.json`: Included `src/**/*.d.ts` and `*.d.cts` for ESLint checks, enhancing type safety in linting.
  
- `tsconfig.js.json`: Included `*.d.cts` and `*.cjs` to support CommonJS and declaration files in JavaScript configurations.
  
- `tsconfig.json`: Included `src/**/*.d.ts` to ensure declaration files are part of the main TypeScript project.
  
- `tsconfig.vitest-typecheck.json`: Included `src/**/*.d.ts` to ensure type checking includes declaration files during testing.

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`0da1029`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/0da102938a3b683fd60000636f8a64aeed8e705b) — ✨ [feat] Add ESLint plugin repository bootstrapper prompt

- Introduce a comprehensive prompt for bootstrapping new ESLint plugins

- Outline critical guidelines for migrating source plugins into a modern template structure

- Emphasize the importance of treating the template as a quality baseline, not a source for rule content

- Provide detailed instructions for adapting and migrating rules, tests, and documentation

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>



### 🛠️ Other Changes

- [`b6f5319`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/b6f531911579f6b4c17f0506765941720d4a6ead) — Initial commit



### 📝 Documentation

- [`a82df58`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/a82df580b0e422d30ac60ad9881a61c499137ecf) — 📝 [docs] Update repository instructions and guidelines

- 📝 [docs] (JSON) Revise tooling alignment section to emphasize using actual npm scripts from the repository for JSON order and validation.
- 📝 [docs] (MJS) Clarify the target Node.js version and ES output expectations for `.mjs` modules, and ensure compatibility with `tsconfig.js.json`.
- 📝 [docs] (Markdown) Update tooling alignment to reflect the use of actual Markdown tooling commands instead of template-specific script names.
- 📝 [docs] (Scripts-Folder) Introduce new guidelines for the `scripts/` folder, emphasizing automation and maintenance tasks.
- 📝 [docs] (Src-Folder) Add comprehensive instructions for authoring rules and source modules in the ESLint plugin template under `src/`.
- 📝 [docs] (Tests-Folder) Expand testing guidelines to apply to both `test/` and `tests/` directories, and clarify the use of shared repository helpers.
- 📝 [docs] (Typescript_5) Update guidelines for utility types and libraries, emphasizing built-in types and existing utility libraries.
- 📝 [docs] (YAML) Revise tooling alignment to encourage using actual YAML validation and workflow-lint commands present in the repository.
- 📝 [docs] (copilot-instructions) Enhance the architecture overview and tooling guidelines for repository maintenance and automation scripts.

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`83fe451`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/83fe4512e486b9953d9d2ac8e30523eb9f3564b7) — 📝 [docs] Update ESLint plugin bootstrapper instructions for configuration adaptation

- Clarified that existing configuration files should be adapted rather than deleted and recreated.

- Emphasized the importance of maintaining the integrity of Typedoc, ESLint, Remark, and other configurations during the migration process.

- Added a final check step to ensure all migrated rules are updated for ESLint 10 and that documentation is fully functional.

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>



### 🎨 Styling

- [`5e11e41`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/5e11e41d98c440cb057ae09be07a4a6eb34045e3) — 🎨 [style] Update task configurations to run in the foreground

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>



### 🧪 Testing

- [`b1dcb6f`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/b1dcb6f941a6fa4456d68b215cedef60e5bc027b) — 🧪 [test] Enhance rule tests and remove deprecated tests


- ✨ [feat] Add module export tests for rules: no-reject, no-this, no-throw, no-try, readonly-array, and readonly-keyword.

- 🧹 [chore] Remove deprecated tests for rule listener selector convention and rule reporting policy contract.

- 🔧 [refactor] Update plugin public types and runtime entry types to use the correct plugin name and improve type assertions.

- ⚡️ [perf] Optimize type handling in plugin source configs by replacing AsyncReturnType with Awaited<ReturnType>.

- 🎨 [style] Improve code formatting and consistency across test files.

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>



### 🧹 Chores

- [`284ab68`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/284ab68d6c3558e6b330a190c2d95a32d4e90bb3) — 🧹 [chore] Clean up presets and documentation


- 🔵 Update recommended preset documentation to clarify its purpose and aliasing with the immutable preset.

- 🔴 Remove strict preset documentation as it is no longer needed.

- ✴️ Delete type-guards preset documentation to streamline available presets.

- 💠 Remove immutable types preset documentation to focus on core functionalities.

- 🧪 [test] Refactor readonly-array and readonly-keyword tests for improved readability and consistency.

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`968ed11`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/968ed11e0b3fc73da0d53414c3b7059c143be661) — 🧹 [chore] Remove outdated tests and improve rule coverage


- 🔥 Delete `presets-rules-matrix-sync.test.ts` and `readme-rules-table-sync.test.ts` as they are no longer needed.

- ✨ Introduce new tests for `readonly-array` and `readonly-keyword` rules to ensure proper enforcement of TypeScript's readonly annotations.

- 🔥 Remove `rule-metadata-integrity.test.ts` and `rule-metadata-snapshots.test.ts` to streamline the test suite and eliminate redundancy.

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>


- [`df0fd49`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commit/df0fd4956a59f64bcb1d1224db557fcd2bcd619f) — 🧹 [chore] Update ignore files for forked plugin eslint-plugin-ts-immutable

- Added eslint-plugin-ts-immutable to .gitignore, .markdownlintignore, .prettierignore, .remarkignore, .secretlintignore, and .stylelintignore

Signed-off-by: Nick2bad4u <20943337+Nick2bad4u@users.noreply.github.com>






## Contributors
Thanks to all the [contributors](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/graphs/contributors) for their hard work!
## License
This project is licensed under the [UnLicense](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/blob/main/LICENSE)
*This changelog was automatically generated with [git-cliff](https://github.com/orhun/git-cliff).*
