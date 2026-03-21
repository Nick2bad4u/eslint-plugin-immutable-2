/**
 * @packageDocumentation
 * Type-level contract tests for public plugin exports.
 */
import type {
    ImmutableConfigs,
    ImmutablePlugin,
    ImmutablePresetConfig,
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
assertType<ImmutablePresetConfig>(pluginContract.configs.recommended);
assertType<ImmutablePresetConfig>(pluginContract.configs.all);
assertType<ImmutableConfigs>(pluginContract.configs);
assertType<string>(pluginContract.meta.name);
assertType<string>(pluginContract.meta.namespace);
