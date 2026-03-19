import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-map-set-mutation rule", () => {
    it("exports no-map-set-mutation rule module", () => {
        expect(getPluginRule("no-map-set-mutation")).toBeDefined();
    });

    tester.run("no-map-set-mutation", getPluginRule("no-map-set-mutation"), {
        invalid: [
            {
                code: "const usersById = new Map<string, number>(); usersById.set('a', 1);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const tags = new Set<string>(); tags.add('immutable');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "let cache = new WeakMap<object, number>(); cache = new WeakMap(); cache.set({}, 1);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const cache = new Map<string, number>(); const next = cache.set('a', 1).set('b', 2);",
                errors: [
                    { messageId: "generic" },
                    { messageId: "generic" },
                ],
            },
        ],
        valid: [
            "const usersById = new Map<string, number>(); usersById.get('a');",
            "const tags = new Set<string>(); tags.has('immutable');",
            "const custom = { set() {} }; custom.set();",
            {
                code: "const mutableMap = new Map<string, number>(); mutableMap.set('a', 1);",
                options: [{ ignorePattern: "^mutable" }],
            },
        ],
    });
});
