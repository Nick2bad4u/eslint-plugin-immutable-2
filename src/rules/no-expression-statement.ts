import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import {
    type IgnorePatternOption,
    ignorePatternSchemaProperty,
    shouldIgnore,
} from "../common/ignore-options.js";
import { createRule } from "../util/rule.js";

/** Rule name exported for config wiring. */
export const name = "no-expression-statement" as const;

type Options = readonly [IgnorePatternOption];

const defaultOptions: Options = [{}];

const optionsSchema: readonly JSONSchema4[] = [
    {
        additionalProperties: false,
        properties: {
            ...ignorePatternSchemaProperty,
        },
        type: "object",
    },
];

/** `no-expression-statement` rule implementation. */
const noExpressionStatementRule: ReturnType<
    typeof createRule<Options, "generic">
> = createRule<Options, "generic">({
    create(context, [ignoreOptions]) {
        return {
            ExpressionStatement(node) {
                if (shouldIgnore(node, context, ignoreOptions)) {
                    return;
                }

                context.report({
                    messageId: "generic",
                    node,
                });
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        docs: {
            description:
                "disallow standalone expression statements to avoid side-effect-driven control flow.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-expression-statement",
        },
        messages: {
            generic:
                "Expression statements are not allowed here. Prefer explicit immutable value transformations.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noExpressionStatementRule;
