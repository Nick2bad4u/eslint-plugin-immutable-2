import { createRule } from "../util/rule.js";

/** Rule name exported for config wiring. */
export const name = "no-this" as const;

/** `no-this` rule implementation. */
const noThisRule: ReturnType<typeof createRule<readonly [], "generic">> =
    createRule<readonly [], "generic">({
        create(context) {
            return {
                ThisExpression(node) {
                    context.report({
                        messageId: "generic",
                        node,
                    });
                },
            };
        },
        meta: {
            docs: {
                description:
                    "disallow `this` usage to encourage stateless functions.",
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-this",
            },
            messages: {
                generic:
                    "Unexpected `this`. Prefer explicit function parameters and return values.",
            },
            schema: [],
            type: "suggestion",
        },
        name,
    });

export default noThisRule;
