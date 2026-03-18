/**
 * @packageDocumentation
 * Type-level contract tests for runtime entrypoint declarations.
 */
import type { ESLint } from "eslint";

import immutablePlugin from "eslint-plugin-immutable";
import { assertType } from "vitest";

assertType<ESLint.Plugin>(immutablePlugin);

assertType<ESLint.Plugin["configs"] | undefined>(immutablePlugin.configs);
assertType<string | undefined>(immutablePlugin.meta?.name);
assertType<string | undefined>(immutablePlugin.meta?.version);
assertType<ESLint.Plugin["rules"] | undefined>(immutablePlugin.rules);
