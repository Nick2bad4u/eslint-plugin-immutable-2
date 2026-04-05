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
import {
    isCallExpression,
    isIdentifier,
    isMemberExpression,
    isNewExpression,
} from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-map-set-mutation" as const;

type CollectionKind = "Map" | "Set" | "WeakMap" | "WeakSet";
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

const getCollectionKindFromConstructor = (
    constructorName: string
): CollectionKind | null => {
    switch (constructorName) {
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet": {
            return constructorName;
        }

        default: {
            return null;
        }
    }
};

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

const isMutatingMethodForKind = (
    collectionKind: CollectionKind,
    methodName: string
): boolean => {
    switch (collectionKind) {
        case "Map": {
            return (
                methodName === "clear" ||
                methodName === "delete" ||
                methodName === "set"
            );
        }

        case "Set": {
            return (
                methodName === "add" ||
                methodName === "clear" ||
                methodName === "delete"
            );
        }

        case "WeakMap": {
            return methodName === "delete" || methodName === "set";
        }

        case "WeakSet": {
            return methodName === "add" || methodName === "delete";
        }

        default: {
            return false;
        }
    }
};

const isChainPreservingMethodForKind = (
    collectionKind: CollectionKind,
    methodName: string
): boolean => {
    switch (collectionKind) {
        case "Map":
        case "WeakMap": {
            return methodName === "set";
        }

        case "Set":
        case "WeakSet": {
            return methodName === "add";
        }

        default: {
            return false;
        }
    }
};

/** `no-map-set-mutation` rule implementation. */
const noMapSetMutationRule: ReturnType<typeof createRule<Options, MessageIds>> =
    createRule<Options, MessageIds>({
        create(context, [options]) {
            const kindByVariable = new WeakMap<
                TSESLint.Scope.Variable,
                CollectionKind
            >();

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

            const getKindFromExpression = (
                expression: Readonly<TSESTree.Expression>
            ): CollectionKind | null => {
                const node = unwrapExpression(expression);

                if (isNewExpression(node) && isIdentifier(node.callee)) {
                    return getCollectionKindFromConstructor(node.callee.name);
                }

                if (isIdentifier(node)) {
                    const variable = resolveVariable(node);

                    return variable === null
                        ? null
                        : (kindByVariable.get(variable) ?? null);
                }

                if (
                    isCallExpression(node) &&
                    isMemberExpression(node.callee) &&
                    node.callee.object.type !== "Super" &&
                    isIdentifier(node.callee.property)
                ) {
                    const receiverKind = getKindFromExpression(
                        node.callee.object
                    );
                    if (receiverKind === null) {
                        return null;
                    }

                    return isChainPreservingMethodForKind(
                        receiverKind,
                        node.callee.property.name
                    )
                        ? receiverKind
                        : null;
                }

                return null;
            };

            const markVariableKind = (
                identifier: Readonly<TSESTree.Identifier>,
                expression: null | Readonly<TSESTree.Expression>
            ): void => {
                const variable = resolveVariable(identifier);
                if (variable === null) {
                    return;
                }

                if (expression === null) {
                    kindByVariable.delete(variable);
                    return;
                }

                const detectedKind = getKindFromExpression(expression);
                if (detectedKind === null) {
                    kindByVariable.delete(variable);
                    return;
                }

                kindByVariable.set(variable, detectedKind);
            };

            const checkCallExpression = (
                node: Readonly<TSESTree.CallExpression>
            ): void => {
                if (shouldIgnore(node, context, options)) {
                    return;
                }

                if (
                    !isMemberExpression(node.callee) ||
                    node.callee.object.type === "Super" ||
                    !isIdentifier(node.callee.property)
                ) {
                    return;
                }

                const receiverKind = getKindFromExpression(node.callee.object);
                if (receiverKind === null) {
                    return;
                }

                const methodName = node.callee.property.name;
                if (!isMutatingMethodForKind(receiverKind, methodName)) {
                    return;
                }

                context.report({
                    data: {
                        kind: receiverKind,
                        methodName,
                    },
                    messageId: "generic",
                    node,
                });
            };

            return {
                AssignmentExpression(node): void {
                    if (!isIdentifier(node.left)) {
                        return;
                    }

                    markVariableKind(node.left, node.right);
                },
                CallExpression: checkCallExpression,
                VariableDeclarator(node): void {
                    if (!isIdentifier(node.id)) {
                        return;
                    }

                    markVariableKind(node.id, node.init);
                },
            };
        },
        meta: {
            defaultOptions: [{}],
            deprecated: false,
            docs: {
                description:
                    "disallow mutating Map and Set collections after creation.",
                frozen: false,
                recommended: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-map-set-mutation",
            },
            messages: {
                generic:
                    "Mutating {{kind}} via `{{methodName}}` is not allowed. Create a new collection instead.",
            },
            schema: optionsSchema,
            type: "suggestion",
        },
        name,
    });

export default noMapSetMutationRule;
