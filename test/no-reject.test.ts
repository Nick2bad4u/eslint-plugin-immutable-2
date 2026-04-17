import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-reject rule", () => {
    it("exports no-reject rule module", () => {
        expect(getPluginRule("no-reject")).toBeDefined();
    });

    tester.run("no-reject", getPluginRule("no-reject"), {
        invalid: [
            {
                code: "const result = Promise.reject(new Error('boom'));",
                errors: [{ messageId: "generic" }],
            },
            // Also works with new keyword? No, Promise.reject is a static method
        ],
        valid: [
            "const result = Promise.resolve(new Error('boom'));",
            // Indirect reference - callee is Identifier (not MemberExpression)
            "const reject = Promise.reject; reject(new Error('boom'));",
            // Computed member expression - callee.property is not Identifier
            "Promise['reject'](new Error('boom'));",
            // Non-Promise object - callee.object.name !== 'Promise'
            "const p = { reject: (e) => {} }; p.reject(new Error('boom'));",
            // Non-reject method - callee.property.name !== 'reject'
            "Promise.resolve(new Error('boom'));",
            // Nested call expression as callee object
            "getPromise().reject(new Error('boom'));",
        ],
    });
});
