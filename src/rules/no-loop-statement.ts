import { createRule } from "../util/rule.js";

/** Rule name exported for config wiring. */
export const name = "no-loop-statement" as const;

/** `no-loop-statement` rule implementation. */
const noLoopStatementRule: ReturnType<typeof createRule<readonly [], "generic">> =
    createRule<readonly [], "generic">({
    create(context) {
        const reportLoop = (
            node:
                | import("@typescript-eslint/utils").TSESTree.DoWhileStatement
                | import("@typescript-eslint/utils").TSESTree.ForInStatement
                | import("@typescript-eslint/utils").TSESTree.ForOfStatement
                | import("@typescript-eslint/utils").TSESTree.ForStatement
                | import("@typescript-eslint/utils").TSESTree.WhileStatement
        ): void => {
            context.report({
                messageId: "generic",
                node,
            });
        };

        return {
            DoWhileStatement: reportLoop,
            ForInStatement: reportLoop,
            ForOfStatement: reportLoop,
            ForStatement: reportLoop,
            WhileStatement: reportLoop,
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description: "disallow imperative loop statements.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-loop-statement",
        },
        messages: {
            generic: "Unexpected loop. Prefer declarative array or iterator methods.",
        },
        schema: [],
        type: "suggestion",
    },
    name,
});

export default noLoopStatementRule;
