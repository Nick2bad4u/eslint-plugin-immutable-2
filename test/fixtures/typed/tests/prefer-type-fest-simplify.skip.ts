type Expand<TValue> = TValue extends infer TInferred
    ? {
          [TKey in keyof TInferred]: TInferred[TKey];
      }
    : never;

type ShouldBeSkippedInTestFile = Expand<UserProfile>;

interface UserProfile {
    readonly id: string;
}

declare const shouldBeSkippedInTestFile: ShouldBeSkippedInTestFile;

JSON.stringify(shouldBeSkippedInTestFile);

export const __typedFixtureModule = "typed-fixture-module";
