import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-atomics-mutation rule", () => {
    it("exports no-atomics-mutation rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-atomics-mutation")).toBeDefined();
    });

    tester.run("no-atomics-mutation", getPluginRule("no-atomics-mutation"), {
        invalid: [
            {
                code: "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics.store(view, 0, 1);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics.add(view, 0, 1);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics.compareExchange(view, 0, 1, 2);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics.exchange(view, 0, 2);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics.xor(view, 0, 3);",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics.load(view, 0);",
            "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics.wait(view, 0, 0);",
            "const custom = { store() {} }; custom.store();",
            // Computed property access - callee.property is not an Identifier, rule returns early
            "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics['store'](view, 0, 1);",
            {
                code: "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics.store(view, 0, 1);",
                options: [{ ignoreAccessorPattern: "Atomics" }],
            },
            {
                code: "const view = new Int32Array(new SharedArrayBuffer(8)); Atomics.store(view, 0, 1);",
                options: [{ ignorePattern: "^Atomics$" }],
            },
        ],
    });
});
