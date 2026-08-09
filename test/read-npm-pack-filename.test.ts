import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = fileURLToPath(
    new URL("../scripts/read-npm-pack-filename.mjs", import.meta.url)
);

const runParser = async (packMetadata: unknown) => {
    const temporaryDirectory = await mkdtemp(
        path.join(tmpdir(), "eslint-plugin-immutable-2-pack-")
    );
    const metadataPath = path.join(temporaryDirectory, "npm-pack.json");

    try {
        await writeFile(metadataPath, JSON.stringify(packMetadata), "utf8");

        return spawnSync(process.execPath, [scriptPath, metadataPath], {
            encoding: "utf8",
        });
    } finally {
        await rm(temporaryDirectory, { force: true, recursive: true });
    }
};

describe("read npm pack filename", () => {
    it("reads npm 12 object-shaped metadata", async () => {
        expect.assertions(3);

        const result = await runParser({
            "eslint-plugin-immutable-2": {
                filename: "eslint-plugin-immutable-2-1.2.5.tgz",
            },
        });

        expect(result.status).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toBe("eslint-plugin-immutable-2-1.2.5.tgz");
    });

    it("keeps accepting npm 11 array-shaped metadata", async () => {
        expect.assertions(3);

        const result = await runParser([
            { filename: "eslint-plugin-immutable-2-1.2.5.tgz" },
        ]);

        expect(result.status).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toBe("eslint-plugin-immutable-2-1.2.5.tgz");
    });

    it.each([
        [
            "ambiguous metadata",
            [{ filename: "first.tgz" }, { filename: "second.tgz" }],
        ],
        ["a blank filename", [{ filename: "" }]],
        ["a non-tarball filename", [{ filename: "package.zip" }]],
        ["a path instead of a basename", [{ filename: "../package.tgz" }]],
    ])("rejects %s", async (_description, packMetadata) => {
        expect.assertions(2);

        const result = await runParser(packMetadata);

        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain("Unexpected npm pack --json output.");
    });
});
