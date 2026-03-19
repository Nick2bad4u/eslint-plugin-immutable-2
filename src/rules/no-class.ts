import { createRule } from "../util/rule.js";

/** Rule name exported for config wiring. */
export const name = "no-class" as const;

/** `no-class` rule implementation. */
const noClassRule: ReturnType<typeof createRule<readonly [], "generic">> =
    createRule<readonly [], "generic">({
        create(context) {
            return {
                ClassDeclaration(node) {
                    context.report({
                        messageId: "generic",
                        node,
                    });
                },
                ClassExpression(node) {
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
                    "disallow classes to encourage function-based composition.",
                recommended: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-class",
            },
            messages: {
                generic:
                    "Unexpected class. Prefer plain functions and immutable data structures.",
            },
            schema: [],
            type: "suggestion",
        },
        name,
    });

export default noClassRule;
