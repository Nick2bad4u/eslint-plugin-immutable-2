import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import { setHas } from "ts-extras";

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
export const name = "no-atomics-mutation" as const;

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

/** `Atomics` methods that mutate shared memory state. */
const atomicsMutatorMethods: ReadonlySet<string> = new Set([
    "add",
    "and",
    "compareExchange",
    "exchange",
    "or",
    "store",
    "sub",
    "xor",
] as const);

/** `no-atomics-mutation` rule implementation. */
const noAtomicsMutationRule: ReturnType<
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

            if (node.callee.object.name !== "Atomics") {
                return;
            }

            const methodName = node.callee.property.name;
            if (!setHas(atomicsMutatorMethods, methodName)) {
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
        deprecated: false,
        docs: {
            description:
                "disallow mutating shared memory via Atomics write operations.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-atomics-mutation",
        },
        messages: {
            generic:
                "Mutating shared memory with `Atomics.{{methodName}}` is not allowed. Prefer immutable synchronization patterns.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noAtomicsMutationRule;
