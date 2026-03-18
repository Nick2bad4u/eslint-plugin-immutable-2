import { createRule } from "../util/rule.js";

/** Rule name exported for config wiring. */
export const name = "no-method-signature" as const;

/** `no-method-signature` rule implementation. */
const noMethodSignatureRule: ReturnType<typeof createRule<readonly [], "generic">> =
    createRule<readonly [], "generic">({
    create(context) {
        return {
            TSMethodSignature(node) {
                context.report({
                    messageId: "generic",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow TypeScript method signatures in interfaces; prefer readonly function-valued properties.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-method-signature",
        },
        messages: {
            generic:
                "Method signatures are mutable. Use `readonly foo: (...) => ...` instead.",
        },
        schema: [],
        type: "suggestion",
    },
    name,
});

export default noMethodSignatureRule;
