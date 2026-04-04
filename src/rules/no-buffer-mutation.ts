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
export const name = "no-buffer-mutation" as const;

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

/** `Buffer` static factory methods that return new Buffer instances. */
const bufferFactoryMethods: ReadonlySet<string> = new Set([
    "alloc",
    "allocUnsafe",
    "allocUnsafeSlow",
    "concat",
    "from",
] as const);

/** Buffer instance methods that mutate the current buffer in place. */
const bufferMutatorMethods: ReadonlySet<string> = new Set([
    "copy",
    "fill",
    "swap16",
    "swap32",
    "swap64",
    "write",
    "writeBigInt64BE",
    "writeBigInt64LE",
    "writeBigUInt64BE",
    "writeBigUInt64LE",
    "writeDoubleBE",
    "writeDoubleLE",
    "writeFloatBE",
    "writeFloatLE",
    "writeInt8",
    "writeInt16BE",
    "writeInt16LE",
    "writeInt32BE",
    "writeInt32LE",
    "writeIntBE",
    "writeIntLE",
    "writeUInt8",
    "writeUInt16BE",
    "writeUInt16LE",
    "writeUInt32BE",
    "writeUInt32LE",
    "writeUIntBE",
    "writeUIntLE",
    "writeUint8",
    "writeUint16BE",
    "writeUint16LE",
    "writeUint32BE",
    "writeUint32LE",
    "writeUintBE",
    "writeUintLE",
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

/** `no-buffer-mutation` rule implementation. */
const noBufferMutationRule: ReturnType<typeof createRule<Options, MessageIds>> =
    createRule<Options, MessageIds>({
        create(context, [options]) {
            const bufferVariables = new WeakSet<TSESLint.Scope.Variable>();

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

            const isBufferFactoryCall = (
                expression: Readonly<TSESTree.CallExpression>
            ): boolean => {
                if (!isMemberExpression(expression.callee)) {
                    return false;
                }

                if (
                    expression.callee.object.type === "Super" ||
                    !isIdentifier(expression.callee.object) ||
                    !isIdentifier(expression.callee.property)
                ) {
                    return false;
                }

                return (
                    expression.callee.object.name === "Buffer" &&
                    bufferFactoryMethods.has(expression.callee.property.name)
                );
            };

            const isBufferExpression = (
                expression: Readonly<TSESTree.Expression>
            ): boolean => {
                const node = unwrapExpression(expression);

                if (isNewExpression(node) && isIdentifier(node.callee)) {
                    return node.callee.name === "Buffer";
                }

                if (isCallExpression(node)) {
                    return isBufferFactoryCall(node);
                }

                if (isIdentifier(node)) {
                    const variable = resolveVariable(node);
                    return variable !== null && bufferVariables.has(variable);
                }

                return false;
            };

            const markBufferVariable = (
                identifier: Readonly<TSESTree.Identifier>,
                expression: null | Readonly<TSESTree.Expression>
            ): void => {
                const variable = resolveVariable(identifier);
                if (variable === null) {
                    return;
                }

                if (expression !== null && isBufferExpression(expression)) {
                    bufferVariables.add(variable);
                    return;
                }

                bufferVariables.delete(variable);
            };

            return {
                AssignmentExpression(node): void {
                    if (!isIdentifier(node.left)) {
                        return;
                    }

                    markBufferVariable(node.left, node.right);
                },
                CallExpression(node): void {
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

                    const methodName = node.callee.property.name;
                    if (!bufferMutatorMethods.has(methodName)) {
                        return;
                    }

                    if (!isBufferExpression(node.callee.object)) {
                        return;
                    }

                    context.report({
                        data: {
                            methodName,
                        },
                        messageId: "generic",
                        node,
                    });
                },
                VariableDeclarator(node): void {
                    if (!isIdentifier(node.id)) {
                        return;
                    }

                    markBufferVariable(node.id, node.init);
                },
            };
        },
        meta: {
            defaultOptions: [{}],
            docs: {
                description:
                    "disallow mutating Buffer instances after creation.",
                recommended: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-buffer-mutation",
            },
            messages: {
                generic:
                    "Mutating Buffer instances with `{{methodName}}` is not allowed. Create a new Buffer value instead.",
            },
            schema: optionsSchema,
            type: "suggestion",
        },
        name,
    });

export default noBufferMutationRule;
