import { createRule } from "../util/rule.js";

/** Rule name exported for config wiring. */
export const name = "no-try" as const;

/** `no-try` rule implementation. */
const noTryRule: ReturnType<typeof createRule<readonly [], "generic">> =
    createRule<readonly [], "generic">({
        create(context) {
            return {
                TryStatement(node) {
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
                description: "disallow try/catch/finally statements.",
                frozen: false,
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-try",
            },
            messages: {
                generic:
                    "Unexpected try statement. Prefer explicit control flow and value-level error handling.",
            },
            schema: [],
            type: "suggestion",
        },
        name,
    });

export default noTryRule;
