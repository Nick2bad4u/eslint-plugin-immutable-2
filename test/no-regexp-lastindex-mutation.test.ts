import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-regexp-lastindex-mutation rule", () => {
    it("exports no-regexp-lastindex-mutation rule module", () => {
        expect(getPluginRule("no-regexp-lastindex-mutation")).toBeDefined();
    });

    tester.run(
        "no-regexp-lastindex-mutation",
        getPluginRule("no-regexp-lastindex-mutation"),
        {
            invalid: [
                {
                    code: "const matcher = /foo/; matcher.lastIndex = 0;",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const matcher = RegExp('foo', 'g'); matcher.lastIndex++;",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const matcher = new RegExp('foo', 'y'); delete matcher.lastIndex;",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const source = /foo/; const alias = source; alias.lastIndex = 3;",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const matcher = /foo/; matcher['lastIndex'] = 2;",
                    errors: [{ messageId: "generic" }],
                },
            ],
            valid: [
                "const matcher = /foo/; matcher.source;",
                "const matcher = /foo/g; matcher.test('foo');",
                "const matcher = { lastIndex: 0 }; matcher.lastIndex = 1;",
                "const RegExp = (pattern) => ({ pattern, lastIndex: 0 }); const matcher = RegExp('foo'); matcher.lastIndex = 1;",
                {
                    code: "const matcher = /foo/; matcher.lastIndex = 0;",
                    options: [{ ignorePattern: "^matcher$" }],
                },
                "let matcher = /foo/; matcher = getCustomMatcher(); matcher.lastIndex = 1; function getCustomMatcher() { return { lastIndex: 0 }; }",
            ],
        }
    );
});
