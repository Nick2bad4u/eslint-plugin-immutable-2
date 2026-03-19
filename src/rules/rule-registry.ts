/* eslint-disable canonical/no-re-export -- this module intentionally aggregates imported rule modules into one export map. */

import type { TSESLint } from "@typescript-eslint/utils";

import immutableDataRule, {
    name as immutableDataName,
} from "./immutable-data.js";
import noAtomicsMutationRule, {
    name as noAtomicsMutationName,
} from "./no-atomics-mutation.js";
import noBufferMutationRule, {
    name as noBufferMutationName,
} from "./no-buffer-mutation.js";
import noClassRule, { name as noClassName } from "./no-class.js";
import noConditionalStatementRule, {
    name as noConditionalStatementName,
} from "./no-conditional-statement.js";
import noDataViewMutationRule, {
    name as noDataViewMutationName,
} from "./no-data-view-mutation.js";
import noDateMutationRule, {
    name as noDateMutationName,
} from "./no-date-mutation.js";
import noExpressionStatementRule, {
    name as noExpressionStatementName,
} from "./no-expression-statement.js";
import noFormDataMutationRule, {
    name as noFormDataMutationName,
} from "./no-form-data-mutation.js";
import noHeadersMutationRule, {
    name as noHeadersMutationName,
} from "./no-headers-mutation.js";
import noHistoryMutationRule, {
    name as noHistoryMutationName,
} from "./no-history-mutation.js";
import noLetRule, { name as noLetName } from "./no-let.js";
import noLocationMutationRule, {
    name as noLocationMutationName,
} from "./no-location-mutation.js";
import noLoopStatementRule, {
    name as noLoopStatementName,
} from "./no-loop-statement.js";
import noMapSetMutationRule, {
    name as noMapSetMutationName,
} from "./no-map-set-mutation.js";
import noMethodSignatureRule, {
    name as noMethodSignatureName,
} from "./no-method-signature.js";
import noMixedInterfaceRule, {
    name as noMixedInterfaceName,
} from "./no-mixed-interface.js";
import noProcessEnvMutationRule, {
    name as noProcessEnvMutationName,
} from "./no-process-env-mutation.js";
import noRegexpLastIndexMutationRule, {
    name as noRegexpLastIndexMutationName,
} from "./no-regexp-lastindex-mutation.js";
import noRejectRule, { name as noRejectName } from "./no-reject.js";
import noReflectMutationRule, {
    name as noReflectMutationName,
} from "./no-reflect-mutation.js";
import noStatefulRegexpRule, {
    name as noStatefulRegexpName,
} from "./no-stateful-regexp.js";
import noStorageMutationRule, {
    name as noStorageMutationName,
} from "./no-storage-mutation.js";
import noThisRule, { name as noThisName } from "./no-this.js";
import noThrowRule, { name as noThrowName } from "./no-throw.js";
import noTryRule, { name as noTryName } from "./no-try.js";
import noTypedArrayMutationRule, {
    name as noTypedArrayMutationName,
} from "./no-typed-array-mutation.js";
import noUrlMutationRule, {
    name as noUrlMutationName,
} from "./no-url-mutation.js";
import noUrlSearchParamsMutationRule, {
    name as noUrlSearchParamsMutationName,
} from "./no-url-search-params-mutation.js";
import readonlyArrayRule, {
    name as readonlyArrayName,
} from "./readonly-array.js";
import readonlyKeywordRule, {
    name as readonlyKeywordName,
} from "./readonly-keyword.js";

/** Immutable rule ID union. */
export type ImmutableRuleId =
    | typeof immutableDataName
    | typeof noAtomicsMutationName
    | typeof noBufferMutationName
    | typeof noClassName
    | typeof noConditionalStatementName
    | typeof noDataViewMutationName
    | typeof noDateMutationName
    | typeof noExpressionStatementName
    | typeof noFormDataMutationName
    | typeof noHeadersMutationName
    | typeof noHistoryMutationName
    | typeof noLetName
    | typeof noLocationMutationName
    | typeof noLoopStatementName
    | typeof noMapSetMutationName
    | typeof noMethodSignatureName
    | typeof noMixedInterfaceName
    | typeof noProcessEnvMutationName
    | typeof noRegexpLastIndexMutationName
    | typeof noRejectName
    | typeof noReflectMutationName
    | typeof noStatefulRegexpName
    | typeof noStorageMutationName
    | typeof noThisName
    | typeof noThrowName
    | typeof noTryName
    | typeof noTypedArrayMutationName
    | typeof noUrlMutationName
    | typeof noUrlSearchParamsMutationName
    | typeof readonlyArrayName
    | typeof readonlyKeywordName;

/** Immutable rule module map by bare rule ID. */
export const rules: Readonly<
    Record<ImmutableRuleId, TSESLint.RuleModule<string, readonly unknown[]>>
> = {
    [immutableDataName]: immutableDataRule,
    [noAtomicsMutationName]: noAtomicsMutationRule,
    [noBufferMutationName]: noBufferMutationRule,
    [noClassName]: noClassRule,
    [noConditionalStatementName]: noConditionalStatementRule,
    [noDataViewMutationName]: noDataViewMutationRule,
    [noDateMutationName]: noDateMutationRule,
    [noExpressionStatementName]: noExpressionStatementRule,
    [noFormDataMutationName]: noFormDataMutationRule,
    [noHeadersMutationName]: noHeadersMutationRule,
    [noHistoryMutationName]: noHistoryMutationRule,
    [noLetName]: noLetRule,
    [noLocationMutationName]: noLocationMutationRule,
    [noLoopStatementName]: noLoopStatementRule,
    [noMapSetMutationName]: noMapSetMutationRule,
    [noMethodSignatureName]: noMethodSignatureRule,
    [noMixedInterfaceName]: noMixedInterfaceRule,
    [noProcessEnvMutationName]: noProcessEnvMutationRule,
    [noRegexpLastIndexMutationName]: noRegexpLastIndexMutationRule,
    [noRejectName]: noRejectRule,
    [noReflectMutationName]: noReflectMutationRule,
    [noStatefulRegexpName]: noStatefulRegexpRule,
    [noStorageMutationName]: noStorageMutationRule,
    [noThisName]: noThisRule,
    [noThrowName]: noThrowRule,
    [noTryName]: noTryRule,
    [noTypedArrayMutationName]: noTypedArrayMutationRule,
    [noUrlMutationName]: noUrlMutationRule,
    [noUrlSearchParamsMutationName]: noUrlSearchParamsMutationRule,
    [readonlyArrayName]: readonlyArrayRule,
    [readonlyKeywordName]: readonlyKeywordRule,
};

/* eslint-enable canonical/no-re-export -- end intentional rule-map aggregation exception. */
