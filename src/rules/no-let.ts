import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
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
const isLetInClassicForLoopInit = (
    node: Readonly<TSESTree.VariableDeclaration>
): boolean => node.parent?.type === "ForStatement" && node.parent.init === node;

const canSafelySuggestConst = (
    node: Readonly<TSESTree.VariableDeclaration>,
    context: Readonly<TSESLint.RuleContext<"generic" | "suggestConst", Options>>
): boolean => {
    if (isLetInClassicForLoopInit(node)) {
        return false;
    }

    const declaredVariables = context.sourceCode.getDeclaredVariables(node);
    if (declaredVariables.length === 0) {
        return false;
    }

    return declaredVariables.every((variable) =>
        variable.references.every((reference) => {
            const isReferenceWrite = reference.isWrite();
            const isInitializationWrite = reference.init === true;
            return !isReferenceWrite || isInitializationWrite;
        })
    );
};

/** `no-let` rule implementation. */
const noLetRule: ReturnType<
    typeof createRule<Options, "generic" | "suggestConst">
> = createRule<Options, "generic" | "suggestConst">({
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
                    suggest: canSafelySuggestConst(node, context)
                        ? [
                              {
                                  fix: (fixer) => {
                                      const letToken =
                                          context.sourceCode.getFirstToken(
                                              node
                                          );
                                      if (letToken === null) {
                                          return null;
                                      }

                                      return fixer.replaceText(
                                          letToken,
                                          "const"
                                      );
                                  },
                                  messageId: "suggestConst",
                              },
                          ]
                        : null,
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
        hasSuggestions: true,
        messages: {
            generic:
                "Unexpected let declaration. Prefer `const` and immutable updates.",
            suggestConst:
                "Convert `let` to `const` because this binding is never reassigned.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noLetRule;
