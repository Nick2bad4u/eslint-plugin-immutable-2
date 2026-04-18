import { arrayJoin } from "ts-extras";

import { createRule } from "../util/rule.js";

/** Rule name exported for config wiring. */
export const name = "no-method-signature" as const;

/** `no-method-signature` rule implementation. */
const noMethodSignatureRule: ReturnType<
    typeof createRule<readonly [], "generic" | "suggestReadonlyProperty">
> = createRule<readonly [], "generic" | "suggestReadonlyProperty">({
    create(context) {
        return {
            TSMethodSignature(node) {
                const sourceCode = context.sourceCode;
                const keyText = sourceCode.getText(node.key);
                const optionalToken = node.optional ? "?" : "";
                const typeParametersText =
                    node.typeParameters === undefined
                        ? ""
                        : sourceCode.getText(node.typeParameters);
                const parametersText = arrayJoin(node.params
                    .map((parameter) => sourceCode.getText(parameter)), ", ");
                const returnTypeText =
                    node.returnType === undefined
                        ? "void"
                        : sourceCode.getText(node.returnType.typeAnnotation);

                const replacement =
                    `readonly ${keyText}${optionalToken}: ` +
                    `${typeParametersText}(${parametersText}) => ${returnTypeText};`;

                context.report({
                    messageId: "generic",
                    node,
                    suggest: [
                        {
                            fix: (fixer) =>
                                fixer.replaceText(node, replacement),
                            messageId: "suggestReadonlyProperty",
                        },
                    ],
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            description:
                "disallow TypeScript method signatures in interfaces; prefer readonly function-valued properties.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-method-signature",
        },
        hasSuggestions: true,
        messages: {
            generic:
                "Method signatures are mutable. Use `readonly foo: (...) => ...` instead.",
            suggestReadonlyProperty:
                "Convert this method signature into a readonly function-valued property.",
        },
        schema: [],
        type: "suggestion",
    },
    name,
});

export default noMethodSignatureRule;
