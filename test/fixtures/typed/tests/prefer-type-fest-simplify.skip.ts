import type { Expand } from "immutable";

type ShouldBeSkippedInTestFile = Expand<UserProfile>;

interface UserProfile {
    readonly id: string;
}

declare const shouldBeSkippedInTestFile: ShouldBeSkippedInTestFile;

String(shouldBeSkippedInTestFile);

export const __typedFixtureModule = "typed-fixture-module";
