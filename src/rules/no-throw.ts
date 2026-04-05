import { createRule } from "../util/rule.js";

/** Rule name exported for config wiring. */
export const name = "no-throw" as const;

/** `no-throw` rule implementation. */
const noThrowRule: ReturnType<typeof createRule<readonly [], "generic">> =
    createRule<readonly [], "generic">({
        create(context) {
            return {
                ThrowStatement(node) {
                    context.report({
                        messageId: "generic",
                        node,
                    });
                },
            };
        },
        meta: {
            deprecated: false,
            docs: {
                description: "disallow `throw` statements.",
                frozen: false,
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-throw",
            },
            messages: {
                generic:
                    "Unexpected throw statement. Prefer explicit error values (for example Result/Either-style returns).",
            },
            schema: [],
            type: "suggestion",
        },
        name,
    });

export default noThrowRule;
