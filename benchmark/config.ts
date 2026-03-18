import { defineConfig } from "eslint-rule-benchmark";

export default defineConfig({
    iterations: 80,
    tests: [
        {
            cases: [
                {
                    testPath: "./cases/prefer-immutable-is-defined/baseline.ts",
                },
                {
                    testPath: "./cases/prefer-immutable-is-defined/complex.ts",
                },
            ],
            name: "Rule: prefer-immutable-is-defined",
            ruleId: "immutable/prefer-immutable-is-defined",
            rulePath: "../src/rules/prefer-immutable-is-defined.ts",
            warmup: {
                iterations: 15,
            },
        },
    ],
    timeout: 3000,
    warmup: {
        enabled: true,
        iterations: 20,
    },
});
