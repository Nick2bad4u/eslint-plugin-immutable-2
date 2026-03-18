import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import {
    type IgnoreClassOption,
    ignoreClassSchemaProperty,
    type IgnoreInterfaceOption,
    ignoreInterfaceSchemaProperty,
    type IgnoreLocalOption,
    ignoreLocalSchemaProperty,
    type IgnorePatternOption,
    ignorePatternSchemaProperty,
    shouldIgnore,
} from "../common/ignore-options.js";
import { createRule } from "../util/rule.js";
import {
    isPropertyDefinition,
} from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "readonly-keyword" as const;

type Options = readonly [
    IgnoreClassOption &
        IgnoreInterfaceOption &
        IgnoreLocalOption &
        IgnorePatternOption,
];

const defaultOptions: Options = [
    {
        ignoreClass: false,
        ignoreInterface: false,
        ignoreLocal: false,
    },
];

const optionsSchema: readonly JSONSchema4[] = [
    {
        additionalProperties: false,
        properties: {
            ...ignoreClassSchemaProperty,
            ...ignoreInterfaceSchemaProperty,
            ...ignoreLocalSchemaProperty,
            ...ignorePatternSchemaProperty,
        },
        type: "object",
    },
];

type ReadonlyNode =
    | TSESTree.PropertyDefinition
    | TSESTree.TSIndexSignature
    | TSESTree.TSPropertySignature;

const hasReadonlyModifier = (node: Readonly<ReadonlyNode>): boolean => {
    if (isPropertyDefinition(node)) {
        return node.readonly;
    }

    return node.readonly;
};

const getReadonlyInsertionTarget = (
    node: Readonly<ReadonlyNode>
): TSESTree.Node =>
    node.type === AST_NODE_TYPES.TSIndexSignature ? node : node.key;

/** `readonly-keyword` rule implementation. */
const readonlyKeywordRule: ReturnType<typeof createRule<Options, "generic">> =
    createRule<Options, "generic">({
        create(context, [ignoreOptions]) {
            const checkNode = (node: Readonly<ReadonlyNode>): void => {
                if (shouldIgnore(node, context, ignoreOptions)) {
                    return;
                }

                if (hasReadonlyModifier(node)) {
                    return;
                }

                context.report({
                    fix: (fixer) =>
                        fixer.insertTextBefore(
                            getReadonlyInsertionTarget(node),
                            "readonly "
                        ),
                    messageId: "generic",
                    node,
                });
            };

            return {
                PropertyDefinition(node) {
                    checkNode(node);
                },
                TSIndexSignature(node) {
                    checkNode(node);
                },
                TSPropertySignature(node) {
                    checkNode(node);
                },
            };
        },
        defaultOptions,
        meta: {
            defaultOptions: [
                {
                    ignoreClass: false,
                    ignoreInterface: false,
                    ignoreLocal: false,
                },
            ],
            docs: {
                description: "require readonly modifiers where possible.",
                recommended: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/readonly-keyword",
            },
            fixable: "code",
            messages: {
                generic: "A readonly modifier is required.",
            },
            schema: optionsSchema,
            type: "suggestion",
        },
        name,
    });

export default readonlyKeywordRule;
