import type { TSESTree } from "@typescript-eslint/utils";
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
export const name = "no-reflect-mutation" as const;

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

/** `Reflect` methods that mutate object state/shape. */
const reflectMutatorMethods: ReadonlySet<string> = new Set([
    "defineProperty",
    "deleteProperty",
    "preventExtensions",
    "set",
    "setPrototypeOf",
] as const);

/** `no-reflect-mutation` rule implementation. */
const noReflectMutationRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const checkCallExpression = (
            node: Readonly<TSESTree.CallExpression>
        ): void => {
            if (shouldIgnore(node, context, options)) {
                return;
            }

            if (
                !isMemberExpression(node.callee) ||
                node.callee.object.type === "Super" ||
                !isIdentifier(node.callee.object) ||
                !isIdentifier(node.callee.property)
            ) {
                return;
            }

            if (node.callee.object.name !== "Reflect") {
                return;
            }

            const methodName = node.callee.property.name;
            if (!reflectMutatorMethods.has(methodName)) {
                return;
            }

            context.report({
                data: {
                    methodName,
                },
                messageId: "generic",
                node,
            });
        };

        return {
            CallExpression: checkCallExpression,
        };
    },
    meta: {
        defaultOptions: [{}],
        docs: {
            description: "disallow mutating objects via Reflect mutation APIs.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-reflect-mutation",
        },
        messages: {
            generic:
                "Mutating object state with `Reflect.{{methodName}}` is not allowed. Prefer immutable object construction.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noReflectMutationRule;
