import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import {
    type IgnoreAccessorPatternOption,
    ignoreAccessorPatternSchemaProperty,
    type IgnorePatternOption,
    ignorePatternSchemaProperty,
    shouldIgnore,
} from "../common/ignore-options.js";
import { createRule } from "../util/rule.js";
import { isIdentifier, isMemberExpression } from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-location-mutation" as const;

type MessageIds = "generic";
type Options = readonly [IgnoreAccessorPatternOption & IgnorePatternOption];

const optionsSchema: readonly JSONSchema4[] = [
    {
        additionalProperties: false,
        properties: {
            ...ignoreAccessorPatternSchemaProperty,
            ...ignorePatternSchemaProperty,
        },
        type: "object",
    },
];

const defaultOptions: Options = [{}];

/** Location methods that mutate global navigation state. */
const locationMutatorMethods: ReadonlySet<string> = new Set([
    "assign",
    "reload",
    "replace",
] as const);

/** Global receivers that expose `location`. */
const locationHostGlobals: ReadonlySet<string> = new Set([
    "globalThis",
    "self",
    "window",
] as const);

const unwrapExpression = (
    node: Readonly<TSESTree.Expression>
): Readonly<TSESTree.Expression> => {
    if (node.type === "ChainExpression") {
        return unwrapExpression(node.expression);
    }

    if (node.type === "TSAsExpression") {
        return unwrapExpression(node.expression);
    }

    if (node.type === "TSNonNullExpression") {
        return unwrapExpression(node.expression);
    }

    if (node.type === "TSSatisfiesExpression") {
        return unwrapExpression(node.expression);
    }

    if (node.type === "TSTypeAssertion") {
        return unwrapExpression(node.expression);
    }

    return node;
};

/** Resolve static string member property name where possible. */
const getMemberPropertyName = (
    memberExpression: Readonly<TSESTree.MemberExpression>
): null | string => {
    if (!memberExpression.computed && isIdentifier(memberExpression.property)) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.computed &&
        memberExpression.property.type === "Literal" &&
        typeof memberExpression.property.value === "string"
    ) {
        return memberExpression.property.value;
    }

    return null;
};

/** `no-location-mutation` rule implementation. */
const noLocationMutationRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const locationVariables = new WeakSet<TSESLint.Scope.Variable>();

        const resolveVariable = (
            identifier: Readonly<TSESTree.Identifier>
        ): null | TSESLint.Scope.Variable => {
            let scope: null | TSESLint.Scope.Scope =
                context.sourceCode.getScope(identifier);

            while (scope !== null) {
                const variable = scope.set.get(identifier.name);
                if (variable !== undefined) {
                    return variable;
                }

                scope = scope.upper;
            }

            return null;
        };

        const isUnshadowedLocationGlobal = (
            identifier: Readonly<TSESTree.Identifier>
        ): boolean => {
            if (identifier.name !== "location") {
                return false;
            }

            const variable = resolveVariable(identifier);
            return variable === null || variable.defs.length === 0;
        };

        const isLocationExpression = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);

            if (isIdentifier(node)) {
                const variable = resolveVariable(node);
                if (variable !== null) {
                    return locationVariables.has(variable);
                }

                return isUnshadowedLocationGlobal(node);
            }

            if (!isMemberExpression(node) || node.object.type === "Super") {
                return false;
            }

            const propertyName = getMemberPropertyName(node);
            if (propertyName !== "location" || !isIdentifier(node.object)) {
                return false;
            }

            return locationHostGlobals.has(node.object.name);
        };

        const markLocationVariable = (
            identifier: Readonly<TSESTree.Identifier>,
            expression: null | Readonly<TSESTree.Expression>
        ): void => {
            const variable = resolveVariable(identifier);
            if (variable === null) {
                return;
            }

            if (expression !== null && isLocationExpression(expression)) {
                locationVariables.add(variable);
                return;
            }

            locationVariables.delete(variable);
        };

        const reportMutation = (
            node:
                | Readonly<TSESTree.AssignmentExpression>
                | Readonly<TSESTree.CallExpression>
                | Readonly<TSESTree.UnaryExpression>
                | Readonly<TSESTree.UpdateExpression>,
            mutation: string
        ): void => {
            context.report({
                data: {
                    mutation,
                },
                messageId: "generic",
                node,
            });
        };

        return {
            AssignmentExpression(node): void {
                if (isIdentifier(node.left)) {
                    markLocationVariable(node.left, node.right);
                    return;
                }

                if (
                    shouldIgnore(node, context, options) ||
                    !isMemberExpression(node.left) ||
                    node.left.object.type === "Super" ||
                    !isLocationExpression(node.left.object)
                ) {
                    return;
                }

                reportMutation(
                    node,
                    getMemberPropertyName(node.left) ?? "<computed>"
                );
            },
            CallExpression(node): void {
                if (
                    shouldIgnore(node, context, options) ||
                    !isMemberExpression(node.callee) ||
                    node.callee.object.type === "Super" ||
                    !isIdentifier(node.callee.property)
                ) {
                    return;
                }

                const methodName = node.callee.property.name;
                if (!locationMutatorMethods.has(methodName)) {
                    return;
                }

                if (!isLocationExpression(node.callee.object)) {
                    return;
                }

                reportMutation(node, methodName);
            },
            UnaryExpression(node): void {
                if (
                    node.operator !== "delete" ||
                    !isMemberExpression(node.argument) ||
                    node.argument.object.type === "Super" ||
                    shouldIgnore(node.argument, context, options) ||
                    !isLocationExpression(node.argument.object)
                ) {
                    return;
                }

                reportMutation(
                    node,
                    getMemberPropertyName(node.argument) ?? "<computed>"
                );
            },
            UpdateExpression(node): void {
                if (
                    !isMemberExpression(node.argument) ||
                    node.argument.object.type === "Super" ||
                    shouldIgnore(node.argument, context, options) ||
                    !isLocationExpression(node.argument.object)
                ) {
                    return;
                }

                reportMutation(
                    node,
                    getMemberPropertyName(node.argument) ?? "<computed>"
                );
            },
            VariableDeclarator(node): void {
                if (!isIdentifier(node.id)) {
                    return;
                }

                markLocationVariable(node.id, node.init);
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        docs: {
            description:
                "disallow mutating browser location and calling location navigation mutators.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-location-mutation",
        },
        messages: {
            generic:
                "Mutating browser location via `{{mutation}}` is not allowed. Prefer immutable navigation intent patterns.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noLocationMutationRule;
