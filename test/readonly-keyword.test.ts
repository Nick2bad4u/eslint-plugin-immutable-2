import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("readonly-keyword rule", () => {
    it("exports readonly-keyword rule module", () => {
        expect(getPluginRule("readonly-keyword")).toBeDefined();
    });

    tester.run("readonly-keyword", getPluginRule("readonly-keyword"), {
        invalid: [
            {
                code: "interface State { value: number }",
                errors: [{ messageId: "generic" }],
                output: "interface State { readonly value: number }",
            },
            {
                code: "interface Dict { [key: string]: number }",
                errors: [{ messageId: "generic" }],
                output: "interface Dict { readonly [key: string]: number }",
            },
            // Class PropertyDefinition without readonly
            {
                code: "class Counter { count: number = 0; }",
                errors: [{ messageId: "generic" }],
                output: "class Counter { readonly count: number = 0; }",
            },
            // Type alias with property signature
            {
                code: "type State = { value: number };",
                errors: [{ messageId: "generic" }],
                output: "type State = { readonly value: number };",
            },
            // Multiple properties
            {
                code: "interface Point { x: number; y: number; }",
                errors: [{ messageId: "generic" }, { messageId: "generic" }],
                output: "interface Point { readonly x: number; readonly y: number; }",
            },
        ],
        valid: [
            "interface State { readonly value: number }",
            "interface Dict { readonly [key: string]: number }",
            // Class with readonly PropertyDefinition
            "class Counter { readonly count: number = 0; }",
            // Type alias with readonly
            "type State = { readonly value: number };",
            // IgnoreClass: true - should skip class properties
            {
                code: "class Counter { count: number = 0; }",
                options: [{ ignoreClass: true }],
            },
            // IgnoreInterface: true - should skip interface properties
            {
                code: "interface State { value: number }",
                options: [{ ignoreInterface: true }],
            },
            // IgnoreLocal: true - inside function scope
            {
                code: "function create() { type Local = { value: number }; }",
                options: [{ ignoreLocal: true }],
            },
            // IgnorePattern
            {
                code: "interface State { mutableValue: number }",
                options: [{ ignorePattern: "^mutable" }],
            },
        ],
    });
});
