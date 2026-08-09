import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import immutablePlugin from "../src/plugin";

const packageJsonValue: unknown = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8")
);
const packageVersion: unknown =
    typeof packageJsonValue === "object" && packageJsonValue !== null
        ? Reflect.get(packageJsonValue, "version")
        : undefined;
const packagePeerDependencies: unknown =
    typeof packageJsonValue === "object" && packageJsonValue !== null
        ? Reflect.get(packageJsonValue, "peerDependencies")
        : undefined;
const packageTypeScriptPeerRange: unknown =
    typeof packagePeerDependencies === "object" &&
    packagePeerDependencies !== null
        ? Reflect.get(packagePeerDependencies, "typescript")
        : undefined;

describe("plugin entry module", () => {
    it("exports default plugin object with rule and config registries", () => {
        expect.hasAssertions();
        expect(immutablePlugin).toHaveProperty("rules");
        expect(immutablePlugin).toHaveProperty("configs");
        expect(immutablePlugin).toHaveProperty("meta");
    });

    it("uses immutable identity metadata", () => {
        expect.hasAssertions();
        expect(immutablePlugin.meta).toMatchObject({
            name: "eslint-plugin-immutable-2",
            namespace: "immutable",
        });
        expect(immutablePlugin.meta.version).toBe(packageVersion);
    });

    it("does not advertise TypeScript versions unsupported by its parser", () => {
        expect.hasAssertions();
        expect(packageTypeScriptPeerRange).toBe(">=5.0.0 <6.1.0");
    });

    it("contains all migrated immutable rules", () => {
        expect.hasAssertions();
        expect(
            Object.keys(immutablePlugin.rules).toSorted((left, right) =>
                left.localeCompare(right)
            )
        ).toStrictEqual([
            "immutable-data",
            "no-abort-controller-mutation",
            "no-atomics-mutation",
            "no-buffer-mutation",
            "no-cache-api-mutation",
            "no-class",
            "no-conditional-statement",
            "no-cookie-mutation",
            "no-data-view-mutation",
            "no-date-mutation",
            "no-dom-token-list-mutation",
            "no-expression-statement",
            "no-form-data-mutation",
            "no-headers-mutation",
            "no-history-mutation",
            "no-let",
            "no-location-mutation",
            "no-loop-statement",
            "no-map-set-mutation",
            "no-method-signature",
            "no-mixed-interface",
            "no-process-env-mutation",
            "no-reflect-mutation",
            "no-regexp-lastindex-mutation",
            "no-reject",
            "no-stateful-regexp",
            "no-storage-mutation",
            "no-this",
            "no-throw",
            "no-try",
            "no-typed-array-mutation",
            "no-url-mutation",
            "no-url-search-params-mutation",
            "readonly-array",
            "readonly-keyword",
        ]);
    });

    it("declares the supported ESLint language for every rule", () => {
        expect.hasAssertions();

        for (const rule of Object.values(immutablePlugin.rules)) {
            expect(rule?.meta?.languages).toStrictEqual(["js/js"]);
        }
    });
});
