import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import {
    type IgnoreAccessorPatternOption,
    ignoreAccessorPatternSchemaProperty,
    type IgnorePatternOption,
    ignorePatternSchemaProperty,
    shouldIgnore,
} from "../common/ignore-options.js";
import {
    type AssumeTypesOption,
    assumeTypesOptionProperties,
} from "../common/types-options.js";
import { isExpected } from "../util/misc.js";
import { createRule, getTypeOfNode } from "../util/rule.js";
import { inConstructor } from "../util/tree.js";
import {
    isArrayConstructorType,
    isArrayExpression,
    isArrayType,
    isCallExpression,
    isIdentifier,
    isMemberExpression,
    isNewExpression,
    isObjectConstructorType,
} from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "immutable-data" as const;

type MessageIds = "array" | "generic" | "object";

type Options = readonly [
    AssumeTypesOption & IgnoreAccessorPatternOption & IgnorePatternOption,
];

const optionsSchema: readonly JSONSchema4[] = [
    {
        additionalProperties: false,
        properties: {
            ...assumeTypesOptionProperties,
            ...ignoreAccessorPatternSchemaProperty,
            ...ignorePatternSchemaProperty,
        },
        type: "object",
    },
];

/** Array methods that mutate an existing array in place. */
const arrayMutatorMethods = [
    "copyWithin",
    "fill",
    "pop",
    "push",
    "reverse",
    "shift",
    "sort",
    "splice",
    "unshift",
] as const;

/**
 * Methods that return a new array/object and can safely be chained before
 * mutation.
 */
const arrayNewObjectReturningMethods = [
    "concat",
    "filter",
    "map",
    "reduce",
    "reduceRight",
    "slice",
] as const;

/** Array constructor functions producing new arrays. */
const arrayConstructorFunctions = ["from", "of"] as const;

const resolveAssumeTypesForArrays = (
    option: AssumeTypesOption["assumeTypes"]
): boolean => {
    if (option === true) {
        return true;
    }

    if (option === false || option === undefined) {
        return false;
    }

    return option.forArrays === true;
};

const resolveAssumeTypesForObjects = (
    option: AssumeTypesOption["assumeTypes"]
): boolean => {
    if (option === true) {
        return true;
    }

    if (option === false || option === undefined) {
        return false;
    }

    return option.forObjects === true;
};

/**
 * Check whether a mutator call is chained from a freshly-created array value.
 */
const isInChainCallAndFollowsNew = (
    node: Readonly<TSESTree.MemberExpression>,
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    assumeArrayTypes: boolean
): boolean => {
    const sourceNode = node.object;

    if (isArrayExpression(sourceNode)) {
        return true;
    }

    if (
        isNewExpression(sourceNode) &&
        isArrayConstructorType(
            getTypeOfNode(sourceNode.callee, context),
            assumeArrayTypes,
            sourceNode.callee
        )
    ) {
        return true;
    }

    if (
        isCallExpression(sourceNode) &&
        isMemberExpression(sourceNode.callee) &&
        isIdentifier(sourceNode.callee.property)
    ) {
        const methodName = sourceNode.callee.property.name;

        const isArrayConstructorMethodCall =
            arrayConstructorFunctions.some(isExpected(methodName)) &&
            isArrayConstructorType(
                getTypeOfNode(sourceNode.callee.object, context),
                assumeArrayTypes,
                sourceNode.callee.object
            );

        if (isArrayConstructorMethodCall) {
            return true;
        }

        if (arrayNewObjectReturningMethods.some(isExpected(methodName))) {
            return true;
        }
    }

    return false;
};

/** `immutable-data` rule implementation. */
const immutableDataRule: ReturnType<typeof createRule<Options, MessageIds>> =
    createRule<Options, MessageIds>({
        create(context, [options]) {
            const checkAssignmentExpression = (
                node: Readonly<TSESTree.AssignmentExpression>
            ): void => {
                if (shouldIgnore(node, context, options)) {
                    return;
                }

                if (!isMemberExpression(node.left) || inConstructor(node)) {
                    return;
                }

                context.report({
                    messageId: "generic",
                    node,
                });
            };

            const checkUnaryExpression = (
                node: Readonly<TSESTree.UnaryExpression>
            ): void => {
                if (shouldIgnore(node, context, options)) {
                    return;
                }

                if (
                    node.operator !== "delete" ||
                    !isMemberExpression(node.argument)
                ) {
                    return;
                }

                context.report({
                    messageId: "generic",
                    node,
                });
            };

            const checkUpdateExpression = (
                node: Readonly<TSESTree.UpdateExpression>
            ): void => {
                if (shouldIgnore(node, context, options)) {
                    return;
                }

                if (!isMemberExpression(node.argument)) {
                    return;
                }

                context.report({
                    messageId: "generic",
                    node,
                });
            };

            const checkCallExpression = (
                node: TSESTree.CallExpression
            ): void => {
                if (shouldIgnore(node, context, options)) {
                    return;
                }

                if (
                    !isMemberExpression(node.callee) ||
                    !isIdentifier(node.callee.property)
                ) {
                    return;
                }

                const assumeTypesForArrays = resolveAssumeTypesForArrays(
                    options.assumeTypes
                );
                const assumeTypesForObjects = resolveAssumeTypesForObjects(
                    options.assumeTypes
                );
                const propertyName = node.callee.property.name;
                const targetArgument = node.arguments[0];

                if (
                    arrayMutatorMethods.some(isExpected(propertyName)) &&
                    !isInChainCallAndFollowsNew(
                        node.callee,
                        context,
                        assumeTypesForArrays
                    ) &&
                    isArrayType(
                        getTypeOfNode(node.callee.object, context),
                        assumeTypesForArrays,
                        node.callee.object
                    )
                ) {
                    context.report({
                        messageId: "array",
                        node,
                    });

                    return;
                }

                const hasMutableAssignTarget =
                    propertyName === "assign" &&
                    node.arguments.length >= 2 &&
                    targetArgument !== undefined &&
                    (isIdentifier(targetArgument) ||
                        isMemberExpression(targetArgument));

                if (
                    hasMutableAssignTarget &&
                    isObjectConstructorType(
                        getTypeOfNode(node.callee.object, context),
                        assumeTypesForObjects,
                        node.callee.object
                    )
                ) {
                    context.report({
                        messageId: "object",
                        node,
                    });
                }
            };

            return {
                AssignmentExpression: checkAssignmentExpression,
                CallExpression: checkCallExpression,
                UnaryExpression: checkUnaryExpression,
                UpdateExpression: checkUpdateExpression,
            };
        },
        meta: {
            defaultOptions: [{ assumeTypes: true }],
            docs: {
                description:
                    "enforce treating objects and arrays as immutable data.",
                recommended: true,
                requiresTypeChecking: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/immutable-data",
            },
            messages: {
                array: "Modifying an array is not allowed.",
                generic: "Modifying an existing object/array is not allowed.",
                object: "Modifying properties of existing object not allowed.",
            },
            schema: optionsSchema,
            type: "suggestion",
        },
        name,
    });

export default immutableDataRule;
