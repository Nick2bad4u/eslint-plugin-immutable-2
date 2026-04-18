const monitorStatuses = ["down", "up"] as const;

const lastStatus = monitorStatuses[monitorStatuses.length - 1]; // NOSONAR(typescript:S6461) -- intentional: this is the pattern the rule detects

String(lastStatus);

export const typedFixtureModule = "typed-fixture-module";
