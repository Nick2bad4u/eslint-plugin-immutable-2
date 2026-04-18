type EnvironmentName = "dev" | "prod" | string; // NOSONAR(typescript:S3512) -- intentional: this is the pattern the rule detects

const environment: EnvironmentName = "dev";

String(environment);

export const __typedFixtureModule = "typed-fixture-module";
