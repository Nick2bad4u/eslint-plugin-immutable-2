import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-location-mutation rule", () => {
    it("exports no-location-mutation rule module", () => {
        expect(getPluginRule("no-location-mutation")).toBeDefined();
    });

    tester.run("no-location-mutation", getPluginRule("no-location-mutation"), {
        invalid: [
            {
                code: "location.assign('/settings');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "window.location.reload();",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const navLocation = location; navLocation.replace('/account');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "location.href = 'https://example.com';",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "delete location.hash;",
                errors: [{ messageId: "generic" }],
            },
            // TSAsExpression wrapping location
            {
                code: "(location as Location).assign('/path');",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression wrapping location
            {
                code: "location!.assign('/path');",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression assignment
            {
                code: "location!.href = '/path';",
                errors: [{ messageId: "generic" }],
            },
            // TSAsExpression assignment
            {
                code: "(location as Location).href = '/path';",
                errors: [{ messageId: "generic" }],
            },
            // window.location.assign with assignment expression
            {
                code: "window.location.href = '/settings';",
                errors: [{ messageId: "generic" }],
            },
            // globalThis.location mutation
            {
                code: "globalThis.location.assign('/settings');",
                errors: [{ messageId: "generic" }],
            },
            // TSSatisfiesExpression wrapping location (covers TSSatisfiesExpression unwrap path)
            {
                code: "(location satisfies Location).assign('/path');",
                errors: [{ messageId: "generic" }],
            },
            // TSTypeAssertion (angle bracket cast) wrapping location
            {
                code: "(<Location>location).assign('/path');",
                errors: [{ messageId: "generic" }],
            },
            // ChainExpression wrapping location
            {
                code: "location?.assign('/path');",
                errors: [{ messageId: "generic" }],
            },
            // Computed property with string literal key
            {
                code: "location['href'] = '/path';",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "location.pathname;",
            "const location = { assign() {} }; location.assign('/ok');",
            "const navLocation = getLocation(); navLocation.replace('/ok'); function getLocation() { return { replace() {} }; }",
            {
                code: "location.assign('/safe');",
                options: [{ ignorePattern: "^location$" }],
            },
            {
                code: "const navLocation = location; navLocation.replace('/safe');",
                options: [{ ignorePattern: "^navLocation$" }],
            },
            "let navLocation = location; navLocation = getMutableLocation(); navLocation.href = '/ok'; function getMutableLocation() { return { href: '' }; }",
            // Non-mutation method call on location
            "location.toString();",
            // Computed method - not a mutation method name
            "location[getMethod()]('/path');",
            // Computed property with non-string-literal key (getMemberPropertyName returns null, no mutation match)
            "location[Symbol.iterator];",
        ],
    });
});
