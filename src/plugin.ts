/**
 * @packageDocumentation
 * Public plugin entrypoint for eslint-plugin-immutable exports and preset wiring.
 */
import type { ESLint, Linter } from "eslint";
import type { Except } from "type-fest";

import typeScriptParser from "@typescript-eslint/parser";
import { safeCastTo } from "ts-extras";

import packageJson from "../package.json" with { type: "json" };
import {
    type ImmutableConfigName,
    immutableConfigNames as immutableConfigNameList,
    immutableConfigsByName,
} from "./configs/config-registry.js";
import { rules as immutableRules } from "./rules/rule-registry.js";

/** Default file globs targeted by plugin presets when `files` is omitted. */
const DEFAULT_FILES = ["**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}"] as const;

/** Base parser options applied across immutable presets. */
const defaultParserOptions: NonNullable<
    NonNullable<Linter.Config["languageOptions"]>["parserOptions"]
> = {
    ecmaVersion: "latest",
    sourceType: "module",
};

/** Flat-config preset shape produced by this plugin. */
export type ImmutablePresetConfig = Linter.Config & {
    readonly rules: NonNullable<Linter.Config["rules"]>;
};

/** Fully-qualified immutable rule identifier. */
export type ImmutableRuleId = `immutable/${ImmutableRuleName}`;

/** Unqualified rule name supported by eslint-plugin-immutable. */
export type ImmutableRuleName = keyof typeof immutableRules;

/** Contract for the `configs` object exported by this plugin. */
type ImmutableConfigsContract = Record<
    ImmutableConfigName,
    ImmutablePresetConfig
>;

/** Fully assembled plugin contract used by the runtime default export. */
type ImmutablePluginContract = Except<ESLint.Plugin, "configs" | "rules"> & {
    readonly configs: ImmutableConfigsContract;
    readonly meta: {
        readonly name: string;
        readonly namespace: string;
        readonly version: string;
    };
    readonly processors: NonNullable<ESLint.Plugin["processors"]>;
    readonly rules: NonNullable<ESLint.Plugin["rules"]>;
};

const getPackageVersion = (pkg: unknown): string => {
    if (typeof pkg !== "object" || pkg === null) {
        return "0.0.0";
    }

    const version = Reflect.get(pkg, "version");
    return typeof version === "string" ? version : "0.0.0";
};

const packageJsonValue = packageJson as unknown;

const immutableEslintRules: NonNullable<ESLint.Plugin["rules"]> &
    typeof immutableRules = immutableRules as NonNullable<
    ESLint.Plugin["rules"]
> &
    typeof immutableRules;

const withImmutablePlugin = (
    config: Readonly<Linter.Config>,
    plugin: Readonly<ESLint.Plugin>
): ImmutablePresetConfig => {
    const existingLanguageOptions = config.languageOptions ?? {};
    const parserOptionsInput = existingLanguageOptions["parserOptions"];

    const parserOptions = {
        ...defaultParserOptions,
        ...safeCastTo<
            NonNullable<
                NonNullable<Linter.Config["languageOptions"]>["parserOptions"]
            >
        >(
            parserOptionsInput !== null &&
                typeof parserOptionsInput === "object" &&
                !Array.isArray(parserOptionsInput)
                ? parserOptionsInput
                : {}
        ),
    };

    return {
        ...config,
        files: config.files ?? [...DEFAULT_FILES],
        languageOptions: {
            ...existingLanguageOptions,
            parser: existingLanguageOptions["parser"] ?? typeScriptParser,
            parserOptions,
        },
        plugins: {
            ...config.plugins,
            immutable: plugin,
        },
        rules: config.rules ?? {},
    };
};

const pluginForConfigs: ESLint.Plugin = {
    rules: immutableEslintRules,
};

const createImmutableConfigsDefinition = (): ImmutableConfigsContract => {
    const configs = {} as ImmutableConfigsContract;

    for (const configName of immutableConfigNameList) {
        configs[configName] = withImmutablePlugin(
            immutableConfigsByName[configName],
            pluginForConfigs
        );
    }

    return configs;
};

const immutableConfigs: ImmutableConfigsContract =
    createImmutableConfigsDefinition();

/** Runtime type for all exported preset configurations. */
export type ImmutableConfigs = typeof immutableConfigs;

/** Main plugin object exported for ESLint consumption. */
const immutablePlugin: ImmutablePluginContract = {
    configs: immutableConfigs,
    meta: {
        name: "eslint-plugin-immutable-2",
        namespace: "immutable",
        version: getPackageVersion(packageJsonValue),
    },
    processors: {},
    rules: immutableEslintRules,
};

/** Runtime type for the plugin object exported as default. */
export type ImmutablePlugin = typeof immutablePlugin;

/** Default plugin export consumed by ESLint flat config. */
export default immutablePlugin;
