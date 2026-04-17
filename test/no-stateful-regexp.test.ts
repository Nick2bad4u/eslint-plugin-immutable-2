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
            // Template literal flags with stateful flags
            {
                code: "const matcher = new RegExp('foo', `g`);",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const matcher = /foo/;",
            "const matcher = /foo/i;",
            "const matcher = RegExp('foo', 'i');",
            "const matcher = new RegExp('foo', 'm');",
            // Non-static flags (covers staticFlags === null early return)
            "const matcher = new RegExp('foo', getFlags()); function getFlags() { return 'g'; }",
            // Shadowed RegExp (covers variable.defs.length > 0 case)
            "const RegExp = (pattern, flags) => ({ pattern, flags }); RegExp('foo', 'g');",
            // Non-RegExp identifier call (covers isUnshadowedRegExpGlobal returning false for name !== 'RegExp')
            "const result = someOtherFunction('foo', 'g');",
            // Call expression where callee is not identifier (computed member expression)
            "const r = obj.RegExp('foo', 'g');",
            // RegExp with no flags argument (covers flagsArgument === undefined path)
            "const matcher = new RegExp('foo');",
            // RegExp with spread flags (covers SpreadElement path)
            "const flags = ['g']; const matcher = new RegExp('foo', ...flags);",
            // Empty pattern, no flags
            "const matcher = /./;",
        ],
    });
});
