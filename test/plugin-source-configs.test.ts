/**
 * @packageDocumentation
 * Integration coverage for source-level immutable plugin preset wiring.
 */
import type { AsyncReturnType } from "type-fest";

import { describe, expect, it, vi } from "vitest";

/** Import `src/plugin` fresh for each assertion set. */
const loadSourcePlugin = async () => {
    vi.resetModules();
    const pluginModule = await import("../src/plugin");
    return pluginModule.default;
};

/** Plugin config object shape inferred from the loaded source plugin. */
type PluginConfig = PluginType["configs"][keyof PluginType["configs"]];
/** Resolved plugin module type for async source import helper. */
type PluginType = AsyncReturnType<typeof loadSourcePlugin>;

/** Convert a preset rules object into deterministic `[ruleId, level]` entries. */
const getRuleEntries = (
    config: Readonly<PluginConfig>
): (readonly [string, unknown])[] => Object.entries(config.rules ?? {});

const immutableConfigNames = [
    "all",
    "recommended",
    "immutable",
    "functional",
    "functional-lite",
] as const;

describe("source plugin config wiring", () => {
    it("builds immutable presets from src/plugin", async () => {
        const plugin = await loadSourcePlugin();
        const all = plugin.configs.all;
        const recommended = plugin.configs.recommended;
        const immutable = plugin.configs.immutable;
        const functional = plugin.configs.functional;
        const functionalLite = plugin.configs["functional-lite"];

        expect(getRuleEntries(all).length).toBeGreaterThan(0);
        expect(getRuleEntries(recommended).length).toBeGreaterThan(0);
        expect(getRuleEntries(immutable).length).toBeGreaterThan(0);
        expect(getRuleEntries(functional).length).toBeGreaterThan(0);
        expect(getRuleEntries(functionalLite).length).toBeGreaterThan(0);

        expect(Object.keys(all.rules)).toContain("immutable/immutable-data");
        expect(Object.keys(all.rules)).toContain("immutable/no-expression-statement");
        expect(Object.keys(all.rules)).toContain("immutable/readonly-array");

        expect(Object.keys(recommended.rules)).toEqual(
            expect.arrayContaining([
                "immutable/immutable-data",
                "immutable/no-let",
                "immutable/readonly-array",
                "immutable/readonly-keyword",
            ])
        );

        expect(functionalLite.rules).toHaveProperty(
            "immutable/no-conditional-statement"
        );
        expect(functional.rules).toHaveProperty("immutable/no-expression-statement");
        expect(functional.rules).toHaveProperty("immutable/no-try", "error");

        expect(plugin.meta.name).toBe("eslint-plugin-immutable");
    });

    it("registers parser defaults, files, and plugin namespace", async () => {
        const plugin = await loadSourcePlugin();
        const recommendedConfig = plugin.configs.recommended;

        expect(recommendedConfig.files).toStrictEqual([
            "**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}",
        ]);
        expect(recommendedConfig.plugins).toHaveProperty("immutable");
        expect(recommendedConfig.plugins?.["immutable"]).toHaveProperty("rules");
        expect(recommendedConfig.languageOptions).toHaveProperty("parser");
        expect(recommendedConfig.languageOptions).toHaveProperty(
            "parserOptions"
        );
        expect(recommendedConfig.languageOptions?.["parserOptions"]).toEqual({
            ecmaVersion: "latest",
            sourceType: "module",
        });

        for (const configName of immutableConfigNames) {
            const parserOptions =
                plugin.configs[configName].languageOptions?.["parserOptions"];

            expect(parserOptions).toEqual(
                expect.objectContaining({
                    ecmaVersion: "latest",
                    sourceType: "module",
                })
            );
        }
    });
});
