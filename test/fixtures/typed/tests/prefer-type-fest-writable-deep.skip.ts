interface TeamConfig {
    readonly labels: readonly string[];
    readonly metadata: {
        readonly active: boolean;
    };
}

type DeepMutable<T> = {
    -readonly [Key in keyof T]: T[Key];
};

type MutableDeep<T> = {
    -readonly [Key in keyof T]: T[Key];
};

type MutableTeamConfig = DeepMutable<TeamConfig>;
type MutableTeamConfigAlternative = MutableDeep<TeamConfig>;

declare const teamConfig: MutableTeamConfig;
declare const teamConfigAlternative: MutableTeamConfigAlternative;

JSON.stringify(teamConfig);
JSON.stringify(teamConfigAlternative);

export const __typedFixtureModule = "typed-fixture-module";
