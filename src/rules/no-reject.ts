import { createRule } from "../util/rule.js";
import { isIdentifier, isMemberExpression } from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-reject" as const;

/** `no-reject` rule implementation. */
const noRejectRule: ReturnType<typeof createRule<readonly [], "generic">> =
    createRule<readonly [], "generic">({
        create(context) {
            return {
                CallExpression(node) {
                    const { callee } = node;
                    if (!isMemberExpression(callee)) {
                        return;
                    }

                    if (
                        !isIdentifier(callee.object) ||
                        !isIdentifier(callee.property)
                    ) {
                        return;
                    }

                    if (
                        callee.object.name !== "Promise" ||
                        callee.property.name !== "reject"
                    ) {
                        return;
                    }

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
                description: "disallow `Promise.reject(...)`.",
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-reject",
            },
            messages: {
                generic:
                    "Unexpected Promise.reject(...). Prefer returning explicit error values from async flows.",
            },
            schema: [],
            type: "suggestion",
        },
        name,
    });

export default noRejectRule;
