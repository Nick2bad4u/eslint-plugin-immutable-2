/**
 * @packageDocumentation
 * Parser-service-enabled RuleTester helpers and typed fixture accessors.
 */
import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { readFileSync } from "node:fs";
import * as path from "node:path";

import { applySharedRuleTesterRunBehavior, repoPath } from "./ruleTester";

const TYPED_FIXTURE_DIRECTORY = repoPath("test", "fixtures", "typed");

/** Resolve a typed fixture path under the repository test directory. */
export const typedFixturePath = (fixtureName: string): string =>
    path.join(TYPED_FIXTURE_DIRECTORY, fixtureName);

/** Read a typed fixture exactly as RuleTester will parse it. */
export const readTypedFixture = (fixtureName: string): string =>
    readFileSync(typedFixturePath(fixtureName), "utf8");

/** Create a RuleTester backed by real TypeScript parser services. */
export const createTypedRuleTester = (): RuleTester =>
    applySharedRuleTesterRunBehavior(
        new RuleTester({
            languageOptions: {
                parser: tsParser,
                parserOptions: {
                    ecmaVersion: "latest",
                    projectService: {
                        allowDefaultProject: ["test/fixtures/typed/*.ts"],
                    },
                    sourceType: "module",
                    tsconfigRootDir: repoPath(),
                },
            },
        })
    );
