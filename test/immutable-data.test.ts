import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("immutable-data rule", () => {
    it("exports immutable-data rule module", () => {
        expect(getPluginRule("immutable-data")).toBeDefined();
    });

    tester.run("immutable-data", getPluginRule("immutable-data"), {
        invalid: [
            {
                code: "obj.value = 2;",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "items.push(value);",
                errors: [{ messageId: "array" }],
            },
            {
                code: "Object.assign(existing, patch);",
                errors: [{ messageId: "object" }],
            },
            // delete operator (UnaryExpression)
            {
                code: "delete obj.prop;",
                errors: [{ messageId: "generic" }],
            },
            // update expression (++)
            {
                code: "obj.count++;",
                errors: [{ messageId: "generic" }],
            },
            // update expression (--)
            {
                code: "obj.count--;",
                errors: [{ messageId: "generic" }],
            },
            // prefix update expression
            {
                code: "++obj.count;",
                errors: [{ messageId: "generic" }],
            },
            // array mutator methods
            {
                code: "items.pop();",
                errors: [{ messageId: "array" }],
            },
            {
                code: "items.shift();",
                errors: [{ messageId: "array" }],
            },
            {
                code: "items.reverse();",
                errors: [{ messageId: "array" }],
            },
            {
                code: "items.sort();",
                errors: [{ messageId: "array" }],
            },
            {
                code: "items.fill(0);",
                errors: [{ messageId: "array" }],
            },
            {
                code: "items.splice(0, 1);",
                errors: [{ messageId: "array" }],
            },
            {
                code: "items.copyWithin(0, 1);",
                errors: [{ messageId: "array" }],
            },
            {
                code: "items.unshift(1);",
                errors: [{ messageId: "array" }],
            },
            // Object.assign with member target
            {
                code: "Object.assign(obj.nested, patch);",
                errors: [{ messageId: "object" }],
            },
            // with assumeTypes forArrays
            {
                code: "items.push(value);",
                errors: [{ messageId: "array" }],
                options: [{ assumeTypes: { forArrays: true } }],
            },
            // with assumeTypes forObjects
            {
                code: "Object.assign(target, patch);",
                errors: [{ messageId: "object" }],
                options: [{ assumeTypes: { forObjects: true } }],
            },
        ],
        valid: [
            "const next = { ...obj, value: 2 };",
            "const values = items.concat(value);",
            "const merged = { ...existing, ...patch };",
            // delete on non-member
            "delete localVar;",
            // update on non-member
            "count++;",
            // fresh array literal methods (isInChainCallAndFollowsNew)
            "[1, 2, 3].push(4);",
            "[].fill(0);",
            // new Array() chain
            "new Array().push(1);",
            // Array.from() chain (arrayConstructorFunctions)
            "Array.from([1, 2]).push(3);",
            // array new-object-returning methods chain
            "items.concat([1]).push(2);",
            "items.filter(Boolean).push(1);",
            "items.map(x => x).push(1);",
            "items.slice(0).push(1);",
            "items.reduce((a, b) => a + b, []).push(1);",
            // constructor mutation should be valid (inConstructor)
            {
                code: `
                    class Counter {
                        count: number;
                        constructor() {
                            this.count = 0;
                        }
                    }
                `,
                options: [{}],
            },
            // ignorePattern
            {
                code: "mutableObj.value = 2;",
                options: [{ ignorePattern: "^mutable" }],
            },
            {
                code: "mutableItems.push(value);",
                options: [{ ignorePattern: "^mutable" }],
            },
            // ignoreAccessorPattern: matches the root object of the member expression
            // (for `state.draft.value = 2`, the text matched is `state.draft`)
            {
                code: "state.draft.value = 2;",
                options: [{ ignoreAccessorPattern: "state.draft" }],
            },
            // ignoreAccessorPattern with ** (covers ignore-options findMatch ** path)
            // The accessor pattern matches the object part of the LHS member expression:
            // for `obj.nested.value = 2`, matched text is "obj.nested"
            {
                code: "obj.nested.value = 2;",
                options: [{ ignoreAccessorPattern: "**.nested" }],
            },
            // ignoreAccessorPattern with ** at start (covers ** with remaining text)
            // for `a.b.c = 1`, matched text is "a.b"
            {
                code: "a.b.c = 1;",
                options: [{ ignoreAccessorPattern: "**.b" }],
            },
            // ignorePattern as array (covers normalizePatterns array branch)
            {
                code: "mutableObj.value = 2;",
                options: [{ ignorePattern: ["^draft", "^mutable"] }],
            },
            // ignorePattern on update expression (text is "mutableObj.count++" which starts with "mutable")
            {
                code: "mutableObj.count++;",
                options: [{ ignorePattern: "^mutable" }],
            },
            // assumeTypes: false - no type info available so can't flag arrays
            {
                code: "items.push(value);",
                options: [{ assumeTypes: false }],
            },
            // assumeTypes: { forArrays: false }
            {
                code: "items.push(value);",
                options: [{ assumeTypes: { forArrays: false } }],
            },
            // assumeTypes: { forObjects: false }
            {
                code: "Object.assign(target, patch);",
                options: [{ assumeTypes: { forObjects: false } }],
            },
            // non-mutating call expression
            "items.find(x => x > 0);",
            // Object method call on non-object
            "items.assign(target, patch);",
        ],
    });
});
