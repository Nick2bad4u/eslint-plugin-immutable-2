import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-typed-array-mutation rule", () => {
    it("exports no-typed-array-mutation rule module", () => {
        expect(getPluginRule("no-typed-array-mutation")).toBeDefined();
    });

    tester.run(
        "no-typed-array-mutation",
        getPluginRule("no-typed-array-mutation"),
        {
            invalid: [
                {
                    code: "const bytes = new Uint8Array([1, 2, 3]); bytes.fill(0);",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const values = new Float32Array(4); values.copyWithin(1, 0, 2);",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const sample = new Int16Array([2, 1]); sample.sort();",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const input = new Uint8Array([1, 2, 3]); const alias = input; alias.reverse();",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "let target = new Uint8Array([1, 2, 3]); target = new Uint8Array([4, 5, 6]); target.set([7, 8], 0);",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "new Uint32Array([1, 2]).fill(0);",
                    errors: [{ messageId: "generic" }],
                },
                // TSSatisfiesExpression wrapping typed array
                {
                    code: "const bytes = new Uint8Array([1, 2]); (bytes satisfies Uint8Array).fill(0);",
                    errors: [{ messageId: "generic" }],
                },
                // TSTypeAssertion (angle bracket) wrapping typed array
                {
                    code: "const bytes = new Uint8Array([1, 2]); (<Uint8Array>bytes).fill(0);",
                    errors: [{ messageId: "generic" }],
                },
                // ChainExpression wrapping typed array
                {
                    code: "const bytes = new Uint8Array([1, 2]); bytes?.fill(0);",
                    errors: [{ messageId: "generic" }],
                },
                // TSNonNullExpression wrapping typed array
                {
                    code: "const bytes = new Uint8Array([1, 2]); bytes!.fill(0);",
                    errors: [{ messageId: "generic" }],
                },
                // TSAsExpression wrapping typed array
                {
                    code: "const bytes = new Uint8Array([1, 2]); (bytes as Uint8Array).fill(0);",
                    errors: [{ messageId: "generic" }],
                },
            ],
            valid: [
                "const bytes = new Uint8Array([1, 2, 3]); const clone = bytes.slice(); clone[0];",
                "const values = new Float32Array([1, 2]); values.map((value) => value + 1);",
                "const source = [1, 2, 3]; source.fill(0);",
                {
                    code: "const bytes = new Uint8Array([1, 2, 3]); bytes.fill(0);",
                    options: [{ ignoreAccessorPattern: "bytes" }],
                },
                {
                    code: "const bytes = new Uint8Array([1, 2, 3]); bytes.fill(0);",
                    options: [{ ignorePattern: "^bytes$" }],
                },
                "const bytes = new Uint8Array([1, 2, 3]); let value = bytes; value = getReplacement(); value.fill(0); function getReplacement() { return [9, 9, 9]; }",
                // Undeclared variable - resolveVariable returns null, not tracked as typed array
                "undeclaredVar.fill(0);",
                // ChainExpression in callee.object: unwrapExpression handles ChainExpression case
                "const bytes = new Uint8Array([1, 2]); (bytes?.subarray(1)).fill(0);",
                // AssignmentExpression where left is not Identifier (MemberExpression) - rule returns early
                "const arr = new Uint8Array([1, 2, 3]); arr[0] = 5;",
                // AssignmentExpression to undeclared variable - resolveVariable returns null in markTypedArrayVariable
                "undeclaredArr = new Uint8Array([1, 2]);",
                // VariableDeclarator where id is not Identifier (destructuring) - rule returns early
                "const [a, b, c] = new Uint8Array([1, 2, 3]);",
            ],
        }
    );
});
