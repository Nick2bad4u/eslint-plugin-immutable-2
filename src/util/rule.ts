import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type ts from "typescript";

import { ESLintUtils } from "@typescript-eslint/utils";

/** Canonical docs URL base for immutable rule pages. */
const RULE_DOCS_BASE_URL =
    "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules";

/** Base option tuple type for immutable rule definitions. */
export type BaseOptions = readonly unknown[];

/** Extended docs metadata shape used by immutable rules. */
export type ImmutableRuleDocs = {
    readonly description: string;
    readonly frozen?: boolean;
    readonly recommended?: boolean;
    readonly requiresTypeChecking?: boolean;
    readonly url?: string;
};

/** Shared immutable rule context shape. */
export type RuleContext<
    MessageIds extends string,
    Options extends BaseOptions,
> = Readonly<TSESLint.RuleContext<MessageIds, Options>>;

/**
 * Shared immutable rule creator that canonicalizes `meta.docs.url`.
 */

type ImmutableRuleCreator = ReturnType<
    typeof ESLintUtils.RuleCreator<ImmutableRuleDocs>
>;

const baseCreateRule: ImmutableRuleCreator =
    // eslint-disable-next-line total-functions/no-hidden-type-assertions -- RuleCreator requires a concrete docs metadata generic to type `meta.docs` across all plugin rules.
    ESLintUtils.RuleCreator<ImmutableRuleDocs>(
        (ruleName) => `${RULE_DOCS_BASE_URL}/${ruleName}`
    );

/**
 * Immutable rule creator with normalized metadata defaults.
 */
export const createRule: typeof baseCreateRule = (rule) => {
    const docs = rule.meta.docs ?? { description: "" };
    const legacyRequiresTypechecking = Reflect.get(
        docs,
        "requiresTypechecking"
    );
    const requiresTypeChecking =
        docs.requiresTypeChecking ??
        (typeof legacyRequiresTypechecking === "boolean"
            ? legacyRequiresTypechecking
            : false);

    return baseCreateRule({
        ...rule,
        meta: {
            ...rule.meta,
            deprecated: rule.meta.deprecated ?? false,
            docs: {
                ...docs,
                frozen: docs.frozen ?? false,
                requiresTypeChecking,
            },
        },
    });
};

/**
 * Resolve the TypeScript type for an ESTree node when parser services are
 * available; otherwise return `null`.
 *
 * @param node - ESTree node to inspect.
 * @param context - ESLint rule context.
 *
 * @returns TypeScript type or `null` when type information is unavailable.
 */
export const getTypeOfNode = (
    node: Readonly<TSESTree.Node>,
    context: RuleContext<string, BaseOptions>
): null | ts.Type => {
    try {
        const parserServices = ESLintUtils.getParserServices(context, true);
        if (parserServices.program === null) {
            return null;
        }

        const typeChecker = parserServices.program.getTypeChecker();
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);

        return typeChecker.getTypeAtLocation(tsNode);
    } catch {
        return null;
    }
};
