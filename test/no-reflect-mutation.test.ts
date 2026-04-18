import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-reflect-mutation rule", () => {
    it("exports no-reflect-mutation rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-reflect-mutation")).toBeDefined();
    });

    tester.run("no-reflect-mutation", getPluginRule("no-reflect-mutation"), {
        invalid: [
            {
                code: "const target = { value: 1 }; Reflect.set(target, 'value', 2);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const target = { value: 1 }; Reflect.deleteProperty(target, 'value');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const target = {}; Reflect.defineProperty(target, 'value', { value: 1 });",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const target = {}; Reflect.setPrototypeOf(target, null);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const target = {}; Reflect.preventExtensions(target);",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const target = { value: 1 }; Reflect.get(target, 'value');",
            "const target = { value: 1 }; Reflect.ownKeys(target);",
            "const custom = { set() {} }; custom.set();",
            // Computed property access - callee.property is not an Identifier, rule returns early
            "const target = { value: 1 }; Reflect['set'](target, 'value', 2);",
            {
                code: "const target = { value: 1 }; Reflect.set(target, 'value', 2);",
                options: [{ ignoreAccessorPattern: "Reflect" }],
            },
            {
                code: "const target = { value: 1 }; Reflect.set(target, 'value', 2);",
                options: [{ ignorePattern: "^Reflect$" }],
            },
        ],
    });
});
