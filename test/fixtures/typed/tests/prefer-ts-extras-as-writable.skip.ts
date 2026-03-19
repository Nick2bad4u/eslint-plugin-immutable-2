type Writable<TValue> = {
    -readonly [TKey in keyof TValue]: TValue[TKey];
};

type ReadonlyRecord = {
    readonly id: number;
    readonly name: string;
};

declare const readonlyRecord: ReadonlyRecord;

const mutableRecord = readonlyRecord as Writable<ReadonlyRecord>;

String(mutableRecord);

export const __typedFixtureModule = "typed-fixture-module";
