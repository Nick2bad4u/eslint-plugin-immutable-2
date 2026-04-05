/**
 * @packageDocumentation
 * Type-level contract tests for public plugin exports.
 */
import type {
    ImmutableConfigs,
    ImmutablePlugin,
    ImmutableRuleId,
    ImmutableRuleName,
} from "eslint-plugin-immutable-2";

import { assertType } from "vitest";

const validConfigName = "recommended";

assertType<keyof ImmutableConfigs>(validConfigName);
// @ts-expect-error Invalid preset key must not satisfy immutable config key union.
assertType<keyof ImmutableConfigs>("legacyPreset");

const validRuleId = "immutable/immutable-data";

assertType<ImmutableRuleId>(validRuleId);
// @ts-expect-error Rule ids must include the `immutable/` namespace prefix.
assertType<ImmutableRuleId>("immutable-data");

type RuleNameFromRuleId = ImmutableRuleId extends `immutable/${infer RuleName}`
    ? RuleName
    : never;

declare const pluginContract: ImmutablePlugin;

assertType<ImmutableRuleName>("immutable-data" satisfies RuleNameFromRuleId);
assertType(pluginContract.configs.recommended);
assertType(pluginContract.configs.all);
assertType(pluginContract.configs);
assertType(pluginContract.meta.name);
assertType(pluginContract.meta.namespace);
