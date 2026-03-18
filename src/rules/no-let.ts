import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import {
    type IgnorePatternOption,
    ignorePatternSchemaProperty,
    shouldIgnore,
} from "../common/ignore-options.js";
import { createRule } from "../util/rule.js";

/** Rule name exported for config wiring. */
export const name = "no-let" as const;

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

/** `no-let` rule implementation. */
const noLetRule: ReturnType<typeof createRule<Options, "generic">> =
    createRule<Options, "generic">({
        create(context, [ignoreOptions]) {
            return {
                VariableDeclaration(node) {
                    if (node.kind !== "let") {
                        return;
                    }

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
                    "disallow mutable `let` bindings in favor of `const` and expression-based updates.",
                recommended: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-let",
            },
            messages: {
                generic: "Unexpected let declaration. Prefer `const` and immutable updates.",
            },
            schema: optionsSchema,
            type: "suggestion",
        },
        name,
    });

export default noLetRule;
