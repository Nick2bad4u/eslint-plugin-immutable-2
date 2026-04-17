import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-buffer-mutation rule", () => {
    it("exports no-buffer-mutation rule module", () => {
        expect(getPluginRule("no-buffer-mutation")).toBeDefined();
    });

    tester.run("no-buffer-mutation", getPluginRule("no-buffer-mutation"), {
        invalid: [
            {
                code: "const buffer = Buffer.from('abc'); buffer.write('z');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const buffer = Buffer.alloc(8); buffer.fill(0);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const source = Buffer.from('ab'); const target = Buffer.alloc(2); source.copy(target);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const packet = Buffer.from('aabb'); packet.swap16();",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const input = Buffer.allocUnsafe(4); const alias = input; alias.writeUInt16LE(5, 0);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "Buffer.from('abc').write('z');",
                errors: [{ messageId: "generic" }],
            },
            // TSSatisfiesExpression
            {
                code: "const buffer = Buffer.from('abc'); (buffer satisfies Buffer).write('z');",
                errors: [{ messageId: "generic" }],
            },
            // TSTypeAssertion
            {
                code: "const buffer = Buffer.from('abc'); (<Buffer>buffer).write('z');",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression
            {
                code: "const buffer = Buffer.from('abc'); buffer!.write('z');",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const buffer = Buffer.from('abc'); buffer.toString('utf8');",
            "const buffer = Buffer.alloc(8); buffer.subarray(0, 2);",
            "const custom = { write() {} }; custom.write();",
            {
                code: "const buffer = Buffer.from('abc'); buffer.write('z');",
                options: [{ ignoreAccessorPattern: "buffer" }],
            },
            {
                code: "const buffer = Buffer.from('abc'); buffer.write('z');",
                options: [{ ignorePattern: "^buffer$" }],
            },
            "let buffer = Buffer.from('abc'); buffer = getReplacement(); buffer.write('z'); function getReplacement() { return new Uint8Array([1, 2, 3]); }",
            // Undeclared variable - not tracked
            "undeclaredBuffer.write('z');",
        ],
    });
});
