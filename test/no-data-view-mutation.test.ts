import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-data-view-mutation rule", () => {
    it("exports no-data-view-mutation rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-data-view-mutation")).toBeDefined();
    });

    tester.run(
        "no-data-view-mutation",
        getPluginRule("no-data-view-mutation"),
        {
            invalid: [
                {
                    code: "const view = new DataView(new ArrayBuffer(8)); view.setUint8(0, 255);",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const view = new DataView(new ArrayBuffer(8)); view.setInt16(0, 42);",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const view = new DataView(new ArrayBuffer(8)); view.setFloat32(0, 1.5);",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const source = new DataView(new ArrayBuffer(8)); const alias = source; alias.setUint32(0, 7);",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "new DataView(new ArrayBuffer(8)).setUint16(0, 8);",
                    errors: [{ messageId: "generic" }],
                },
                // TSNonNullExpression
                {
                    code: "const view = new DataView(new ArrayBuffer(8)); view!.setUint8(0, 1);",
                    errors: [{ messageId: "generic" }],
                },
                // TSSatisfiesExpression
                {
                    code: "const view = new DataView(new ArrayBuffer(8)); (view satisfies DataView).setUint8(0, 1);",
                    errors: [{ messageId: "generic" }],
                },
                // TSTypeAssertion
                {
                    code: "const view = new DataView(new ArrayBuffer(8)); (<DataView>view).setUint8(0, 1);",
                    errors: [{ messageId: "generic" }],
                },
                // TSAsExpression
                {
                    code: "const view = new DataView(new ArrayBuffer(8)); (view as DataView).setUint8(0, 1);",
                    errors: [{ messageId: "generic" }],
                },
            ],
            valid: [
                "const view = new DataView(new ArrayBuffer(8)); view.getUint8(0);",
                "const view = new DataView(new ArrayBuffer(8)); view.getInt16(0);",
                "const custom = { setUint8() {} }; custom.setUint8(0, 1);",
                // ChainExpression in init - not DataView, valid
                "const v = getView?.(); v.setUint8(0, 1);",
                {
                    code: "const view = new DataView(new ArrayBuffer(8)); view.setUint8(0, 1);",
                    options: [{ ignoreAccessorPattern: "view" }],
                },
                {
                    code: "const view = new DataView(new ArrayBuffer(8)); view.setUint8(0, 1);",
                    options: [{ ignorePattern: "^view$" }],
                },
                "let view = new DataView(new ArrayBuffer(8)); view = getReplacement(); view.setUint8(0, 1); function getReplacement() { return new Uint8Array([1, 2, 3]); }",
            ],
        }
    );
});
