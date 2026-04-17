import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("readonly-array rule", () => {
    it("exports readonly-array rule module", () => {
        expect(getPluginRule("readonly-array")).toBeDefined();
    });

    tester.run("readonly-array", getPluginRule("readonly-array"), {
        invalid: [
            {
                code: "const value: string[] = [];",
                errors: [{ messageId: "generic" }],
                output: "const value: readonly string[] = [];",
            },
            {
                code: "type Values = Array<string>;",
                errors: [{ messageId: "generic" }],
                output: "type Values = ReadonlyArray<string>;",
            },
            // Tuple type should also be readonly
            {
                code: "const pair: [string, number] = ['a', 1];",
                errors: [{ messageId: "generic" }],
                output: "const pair: readonly [string, number] = ['a', 1];",
            },
            // Nested array type - ESLint applies only non-conflicting fixes in one pass,
            // so the outer readonly is added first; a second pass fixes the inner array.
            {
                code: "const matrix: number[][] = [];",
                errors: [{ messageId: "generic" }, { messageId: "generic" }],
                output: [
                    "const matrix: readonly number[][] = [];",
                    "const matrix: readonly (readonly number[])[] = [];",
                ],
            },
            // Function parameter type
            {
                code: "function process(items: string[]): void {}",
                errors: [{ messageId: "generic" }],
                output: "function process(items: readonly string[]): void {}",
            },
            // Return type (without ignoreReturnType)
            {
                code: "function getItems(): string[] { return []; }",
                errors: [{ messageId: "generic" }],
                output: "function getItems(): readonly string[] { return []; }",
            },
            // Array<T> return type (without ignoreReturnType)
            {
                code: "function getItems(): Array<string> { return []; }",
                errors: [{ messageId: "generic" }],
                output: "function getItems(): ReadonlyArray<string> { return []; }",
            },
        ],
        valid: [
            "const value: readonly string[] = [];",
            "type Values = ReadonlyArray<string>;",
            "const pair: readonly [string, number] = ['a', 1];",
            // ignoreReturnType: true should allow mutable array in return position
            {
                code: "function getItems(): string[] { return []; }",
                options: [{ ignoreReturnType: true }],
            },
            {
                code: "function getItems(): Array<string> { return []; }",
                options: [{ ignoreReturnType: true }],
            },
            {
                code: "const f = (): string[] => [];",
                options: [{ ignoreReturnType: true }],
            },
            // ignoreLocal: true should allow mutable array in local function scope
            {
                code: "function process() { const items: string[] = []; }",
                options: [{ ignoreLocal: true }],
            },
            // ignorePattern: matches against the type annotation text
            {
                code: "const items: mutableItems[] = [];",
                options: [{ ignorePattern: "^mutableItems" }],
            },
            // Already readonly array in operator
            "const value: readonly string[] = [];",
            "type Values = readonly string[];",
            // Function with default parameter as array literal - no type annotation,
            // no type info available so checkImplicitType skips it
            "function processItems(items = [1, 2, 3]) { return items; }",
            // Arrow function with default array param - no type annotation, skipped
            "const processItems = (items = [1, 2, 3]) => items;",
            // VariableDeclaration with no init - covers init === null early-exit
            "let items: readonly string[];",
        ],
    });
});
