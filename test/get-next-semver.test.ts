import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = fileURLToPath(
    new URL("../scripts/get-next-semver.mjs", import.meta.url)
);

const getNextSemver = (version?: string, releaseType?: string) =>
    spawnSync(
        process.execPath,
        [
            scriptPath,
            version,
            releaseType,
        ].filter((argument): argument is string => argument !== undefined),
        { encoding: "utf8" }
    );

describe("get next semantic version", () => {
    it.each([
        [
            "patch",
            "1.2.6",
            "1.2.7",
        ],
        [
            "minor",
            "1.2.6",
            "1.3.0",
        ],
        [
            "major",
            "1.2.6",
            "2.0.0",
        ],
        [
            "patch",
            "0.0.0",
            "0.0.1",
        ],
    ])("increments a %s release", (releaseType, version, expectedVersion) => {
        expect.assertions(3);

        const result = getNextSemver(version, releaseType);

        expect(result.status).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toBe(expectedVersion);
    });

    it.each([
        [
            "a missing version",
            undefined,
            undefined,
            "Missing current semantic version.",
        ],
        [
            "a malformed version",
            "1.2",
            "patch",
            "Invalid semantic version: 1.2",
        ],
        [
            "a prerelease version",
            "1.2.6-beta.1",
            "patch",
            "Invalid semantic version: 1.2.6-beta.1",
        ],
        [
            "an invalid release type",
            "1.2.6",
            "prerelease",
            "Invalid release type: prerelease",
        ],
        [
            "a missing release type",
            "1.2.6",
            undefined,
            "Invalid release type: (missing)",
        ],
    ])("rejects %s", (_description, version, releaseType, expectedMessage) => {
        expect.assertions(2);

        const result = getNextSemver(version, releaseType);

        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain(expectedMessage);
    });
});
