import { describe } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-class rule", () => {
    tester.run("no-class", getPluginRule("no-class"), {
        invalid: [
            {
                code: "class Example {}",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const Example = class {};",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: ["function createExample() { return {}; }"],
    });
});
