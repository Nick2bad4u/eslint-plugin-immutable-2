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
        ],
        valid: [
            "const next = { ...obj, value: 2 };",
            "const values = items.concat(value);",
            "const merged = { ...existing, ...patch };",
        ],
    });
});
