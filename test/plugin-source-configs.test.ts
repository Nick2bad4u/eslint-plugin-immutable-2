/**
 * @packageDocumentation
 * Integration coverage for source-level immutable plugin preset wiring.
 */
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
type PluginType = Awaited<ReturnType<typeof loadSourcePlugin>>;

/** Convert a preset rules object into deterministic `[ruleId, level]` entries. */
const getRuleEntries = (
    config: Readonly<PluginConfig>
): (readonly [string, unknown])[] => Object.entries(config.rules ?? {});

/** Collect a preset's rule IDs into a stable set for relationship assertions. */
const getRuleIds = (config: Readonly<PluginConfig>): Set<string> =>
    new Set(Object.keys(config.rules ?? {}));

const immutableConfigNames = [
    "all",
    "recommended",
    "immutable",
    "functional",
    "functional-lite",
] as const;

describe("source plugin config wiring", () => {
    it("builds immutable presets from src/plugin", async () => {
        expect.hasAssertions();

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
        expect(Object.keys(all.rules)).toContain(
            "immutable/no-expression-statement"
        );
        expect(Object.keys(all.rules)).toContain("immutable/readonly-array");

        expect(Object.keys(recommended.rules)).toStrictEqual(
            expect.arrayContaining([
                "immutable/immutable-data",
                "immutable/no-map-set-mutation",
                "immutable/no-regexp-lastindex-mutation",
                "immutable/no-stateful-regexp",
            ])
        );
        expect(recommended.rules).not.toHaveProperty("immutable/no-let");
        expect(recommended.rules).not.toHaveProperty(
            "immutable/no-method-signature"
        );
        expect(recommended.rules).not.toHaveProperty(
            "immutable/readonly-array"
        );
        expect(recommended.rules).not.toHaveProperty(
            "immutable/readonly-keyword"
        );

        expect(functionalLite.rules).toHaveProperty(
            "immutable/no-conditional-statement"
        );
        expect(
            functionalLite.rules?.["immutable/no-conditional-statement"]
        ).toStrictEqual(["error", { allowReturningBranches: true }]);
        expect(functionalLite.rules).toHaveProperty(
            "immutable/no-loop-statement",
            "error"
        );
        expect(functionalLite.rules).toHaveProperty(
            "immutable/no-mixed-interface",
            "error"
        );
        expect(functionalLite.rules).not.toHaveProperty("immutable/no-class");
        expect(functionalLite.rules).not.toHaveProperty("immutable/no-this");
        expect(functionalLite.rules).not.toHaveProperty("immutable/no-throw");
        expect(functional.rules).toHaveProperty(
            "immutable/no-expression-statement"
        );
        expect(functional.rules).toHaveProperty("immutable/no-class", "error");
        expect(functional.rules).toHaveProperty(
            "immutable/no-conditional-statement",
            "error"
        );
        expect(functional.rules).toHaveProperty(
            "immutable/no-method-signature",
            "error"
        );
        expect(functional.rules).toHaveProperty("immutable/no-this", "error");
        expect(functional.rules).toHaveProperty("immutable/no-throw", "error");
        expect(functional.rules).toHaveProperty("immutable/no-try", "error");

        expect(plugin.meta.name).toBe("eslint-plugin-immutable-2");
    });

    it("keeps preset rule sets layered logically", async () => {
        expect.hasAssertions();

        const plugin = await loadSourcePlugin();
        const recommendedRuleIds = getRuleIds(plugin.configs.recommended);
        const immutableRuleIds = getRuleIds(plugin.configs.immutable);
        const functionalLiteRuleIds = getRuleIds(
            plugin.configs["functional-lite"]
        );
        const functionalRuleIds = getRuleIds(plugin.configs.functional);
        const allRuleIds = getRuleIds(plugin.configs.all);

        expect(immutableRuleIds.difference(recommendedRuleIds)).toStrictEqual(
            new Set([
                "immutable/no-let",
                "immutable/no-method-signature",
                "immutable/readonly-array",
                "immutable/readonly-keyword",
            ])
        );
        expect(recommendedRuleIds.difference(immutableRuleIds)).toStrictEqual(
            new Set()
        );
        expect(
            functionalLiteRuleIds.difference(immutableRuleIds)
        ).toStrictEqual(
            new Set([
                "immutable/no-conditional-statement",
                "immutable/no-loop-statement",
                "immutable/no-mixed-interface",
            ])
        );
        expect(
            functionalRuleIds.difference(functionalLiteRuleIds)
        ).toStrictEqual(
            new Set([
                "immutable/no-class",
                "immutable/no-expression-statement",
                "immutable/no-this",
                "immutable/no-throw",
                "immutable/no-try",
            ])
        );
        expect(allRuleIds.difference(functionalRuleIds)).toStrictEqual(
            new Set(["immutable/no-reject"])
        );
        expect(plugin.configs.immutable.rules).toHaveProperty(
            "immutable/no-method-signature",
            "warn"
        );
        expect(plugin.configs.functional.rules).toHaveProperty(
            "immutable/no-method-signature",
            "error"
        );
        expect(plugin.configs.all.rules).toHaveProperty(
            "immutable/no-method-signature",
            "error"
        );
        expect(plugin.configs.all.rules).toHaveProperty(
            "immutable/no-conditional-statement",
            "error"
        );
    });

    it("registers parser defaults, files, and plugin namespace", async () => {
        expect.hasAssertions();

        const plugin = await loadSourcePlugin();
        const recommendedConfig = plugin.configs.recommended;

        expect(recommendedConfig.files).toStrictEqual([
            "**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}",
        ]);
        expect(recommendedConfig.plugins).toHaveProperty("immutable");
        expect(recommendedConfig.plugins?.["immutable"]).toHaveProperty(
            "rules"
        );
        expect(recommendedConfig.languageOptions).toHaveProperty("parser");
        expect(recommendedConfig.languageOptions).toHaveProperty(
            "parserOptions"
        );
        expect(
            recommendedConfig.languageOptions?.["parserOptions"]
        ).toStrictEqual({
            ecmaVersion: "latest",
            sourceType: "module",
        });

        for (const configName of immutableConfigNames) {
            const parserOptions =
                plugin.configs[configName].languageOptions?.["parserOptions"];

            expect(parserOptions).toStrictEqual(
                expect.objectContaining({
                    ecmaVersion: "latest",
                    sourceType: "module",
                })
            );
        }
    });
});
