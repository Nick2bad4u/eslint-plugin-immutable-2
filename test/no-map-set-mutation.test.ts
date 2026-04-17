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
                errors: [{ messageId: "generic" }, { messageId: "generic" }],
            },
            // TSAsExpression wrapping Map variable
            {
                code: "const map = new Map<string, number>(); (map as Map<string, number>).set('a', 1);",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression wrapping Map variable
            {
                code: "const map = new Map<string, number>(); map!.set('a', 1);",
                errors: [{ messageId: "generic" }],
            },
            // TSAsExpression wrapping Set variable
            {
                code: "const s = new Set<string>(); (s as Set<string>).add('x');",
                errors: [{ messageId: "generic" }],
            },
            // Map.delete is also a mutation
            {
                code: "const map = new Map<string, number>(); map.delete('a');",
                errors: [{ messageId: "generic" }],
            },
            // Map.clear is also a mutation
            {
                code: "const map = new Map<string, number>(); map.clear();",
                errors: [{ messageId: "generic" }],
            },
            // Set.delete
            {
                code: "const s = new Set<string>(); s.delete('a');",
                errors: [{ messageId: "generic" }],
            },
            // Set.clear
            {
                code: "const s = new Set<string>(); s.clear();",
                errors: [{ messageId: "generic" }],
            },
            // WeakMap.delete (covers WeakMap case in isMutatingMethodForKind)
            {
                code: "const wm = new WeakMap<object, number>(); wm.delete({});",
                errors: [{ messageId: "generic" }],
            },
            // WeakMap.set (covers WeakMap set case)
            {
                code: "const wm = new WeakMap<object, number>(); wm.set({}, 1);",
                errors: [{ messageId: "generic" }],
            },
            // WeakSet.add (covers WeakSet add case)
            {
                code: "const ws = new WeakSet<object>(); ws.add({});",
                errors: [{ messageId: "generic" }],
            },
            // WeakSet.delete (covers WeakSet delete case)
            {
                code: "const ws = new WeakSet<object>(); ws.delete({});",
                errors: [{ messageId: "generic" }],
            },
            // TSSatisfiesExpression wrapping Map variable (covers TSSatisfiesExpression in unwrapExpression)
            {
                code: "const m = new Map<string, number>(); (m satisfies Map<string, number>).set('a', 1);",
                errors: [{ messageId: "generic" }],
            },
            // TSTypeAssertion (angle bracket) wrapping Map variable
            {
                code: "const m = new Map<string, number>(); (<Map<string, number>>m).set('a', 1);",
                errors: [{ messageId: "generic" }],
            },
            // ChainExpression wrapping Map variable (covers ChainExpression in unwrapExpression)
            {
                code: "const m = new Map<string, number>(); m?.set('a', 1);",
                errors: [{ messageId: "generic" }],
            },
            // Assignment to a Map variable then mutate it (covers markVariableKind via AssignmentExpression)
            {
                code: "let m: Map<string, number>; m = new Map(); m.set('a', 1);",
                errors: [{ messageId: "generic" }],
            },
            // ignoreAccessorPattern option - variable NOT matching the pattern
            {
                code: "const map = new Map<string, number>(); map.set('a', 1);",
                errors: [{ messageId: "generic" }],
                options: [{ ignoreAccessorPattern: "^draft" }],
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
            // Map has() is not a mutation
            "const map = new Map<string, number>(); map.has('a');",
            // Map forEach() is not a mutation
            "const map = new Map<string, number>(); map.forEach((v) => console.log(v));",
            // Map keys/values/entries are not mutations
            "const map = new Map<string, number>(); [...map.keys()];",
            // WeakSet.has() is not a mutation
            "const ws = new WeakSet<object>(); ws.has({});",
            // WeakMap.has() is not a mutation
            "const wm = new WeakMap<object, number>(); wm.has({});",
            // Non-mutating chain method returns null kind, so chained mutation should not report
            "const m = new Map<string, number>(); m.get('a')?.set('b', 1);",
            // Untracked variable (not declared as collection)
            "undeclaredMap.set('a', 1);",
            // Variable reassigned to non-collection loses tracking
            "let m = new Map<string, number>(); m = otherValue as any; m.set('a', 1);",
            // ignoreAccessorPattern covers the variable name
            {
                code: "const draftMap = new Map<string, number>(); draftMap.set('a', 1);",
                options: [{ ignoreAccessorPattern: "draft*" }],
            },
        ],
    });
});
