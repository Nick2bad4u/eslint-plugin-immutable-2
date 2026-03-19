import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-stateful-regexp rule", () => {
    it("exports no-stateful-regexp rule module", () => {
        expect(getPluginRule("no-stateful-regexp")).toBeDefined();
    });

    tester.run("no-stateful-regexp", getPluginRule("no-stateful-regexp"), {
        invalid: [
            {
                code: "const matcher = /foo/g;",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const matcher = /foo/y;",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const matcher = RegExp('foo', 'ig');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const matcher = new RegExp('foo', 'my');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const matcher = new RegExp('foo', `gy`);",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const matcher = /foo/;",
            "const matcher = /foo/i;",
            "const matcher = RegExp('foo', 'i');",
            "const matcher = new RegExp('foo', 'm');",
            "const matcher = new RegExp('foo', getFlags()); function getFlags() { return 'g'; }",
            "const RegExp = (pattern, flags) => ({ pattern, flags }); RegExp('foo', 'g');",
        ],
    });
});
