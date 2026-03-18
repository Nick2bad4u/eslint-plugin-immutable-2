import type { TSESLint } from "@typescript-eslint/utils";

import immutableDataRule, {
    name as immutableDataName,
} from "./immutable-data.js";
import noClassRule, {
    name as noClassName,
} from "./no-class.js";
import noConditionalStatementRule, {
    name as noConditionalStatementName,
} from "./no-conditional-statement.js";
import noExpressionStatementRule, {
    name as noExpressionStatementName,
} from "./no-expression-statement.js";
import noLetRule, {
    name as noLetName,
} from "./no-let.js";
import noLoopStatementRule, {
    name as noLoopStatementName,
} from "./no-loop-statement.js";
import noMethodSignatureRule, {
    name as noMethodSignatureName,
} from "./no-method-signature.js";
import noMixedInterfaceRule, {
    name as noMixedInterfaceName,
} from "./no-mixed-interface.js";
import noRejectRule, {
    name as noRejectName,
} from "./no-reject.js";
import noThisRule, {
    name as noThisName,
} from "./no-this.js";
import noThrowRule, {
    name as noThrowName,
} from "./no-throw.js";
import noTryRule, {
    name as noTryName,
} from "./no-try.js";
import readonlyArrayRule, {
    name as readonlyArrayName,
} from "./readonly-array.js";
import readonlyKeywordRule, {
    name as readonlyKeywordName,
} from "./readonly-keyword.js";

/** Immutable rule ID union. */
export type ImmutableRuleId =
    | typeof immutableDataName
    | typeof noClassName
    | typeof noConditionalStatementName
    | typeof noExpressionStatementName
    | typeof noLetName
    | typeof noLoopStatementName
    | typeof noMethodSignatureName
    | typeof noMixedInterfaceName
    | typeof noRejectName
    | typeof noThisName
    | typeof noThrowName
    | typeof noTryName
    | typeof readonlyArrayName
    | typeof readonlyKeywordName;

/** Immutable rule module map by bare rule ID. */
export const rules: Readonly<
    Record<ImmutableRuleId, TSESLint.RuleModule<string, readonly unknown[]>>
> = {
    [immutableDataName]: immutableDataRule,
    [noClassName]: noClassRule,
    [noConditionalStatementName]: noConditionalStatementRule,
    [noExpressionStatementName]: noExpressionStatementRule,
    [noLetName]: noLetRule,
    [noLoopStatementName]: noLoopStatementRule,
    [noMethodSignatureName]: noMethodSignatureRule,
    [noMixedInterfaceName]: noMixedInterfaceRule,
    [noRejectName]: noRejectRule,
    [noThisName]: noThisRule,
    [noThrowName]: noThrowRule,
    [noTryName]: noTryRule,
    [readonlyArrayName]: readonlyArrayRule,
    [readonlyKeywordName]: readonlyKeywordRule,
};
