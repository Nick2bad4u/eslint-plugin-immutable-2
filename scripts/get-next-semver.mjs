#!/usr/bin/env node

const [version, releaseType] = process.argv.slice(2);

if (version === undefined) {
    throw new TypeError("Missing current semantic version.");
}

const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/v.exec(version);

if (match === null) {
    throw new TypeError(`Invalid semantic version: ${version}`);
}

const major = Number(match[1]);
const minor = Number(match[2]);
const patch = Number(match[3]);
const nextVersion =
    releaseType === "major"
        ? `${major + 1}.0.0`
        : releaseType === "minor"
          ? `${major}.${minor + 1}.0`
          : releaseType === "patch"
            ? `${major}.${minor}.${patch + 1}`
            : undefined;

if (nextVersion === undefined) {
    throw new TypeError(`Invalid release type: ${releaseType ?? "(missing)"}`);
}

process.stdout.write(nextVersion);
