/* eslint-disable canonical/no-re-export -- registry modules intentionally compose imported presets into exported maps. */

import type { Linter } from "eslint";

import allConfig from "./all.js";
import functionalLiteConfig from "./functional-lite.js";
import functionalConfig from "./functional.js";
import immutableConfig from "./immutable.js";

/** Immutable plugin preset names. */
export const immutableConfigNames = [
    "all",
    "functional",
    "functional-lite",
    "immutable",
    "recommended",
] as const;

/** Immutable plugin preset name union. */
export type ImmutableConfigName = (typeof immutableConfigNames)[number];

/** Immutable config map by preset name. */
type ImmutableConfigMap = Record<ImmutableConfigName, Linter.Config>;

/** Immutable plugin preset definitions. */
export const immutableConfigsByName: ImmutableConfigMap = {
    all: allConfig,
    functional: functionalConfig,
    "functional-lite": functionalLiteConfig,
    immutable: immutableConfig,
    recommended: immutableConfig,
};

/* eslint-enable canonical/no-re-export -- end intentional preset-map aggregation exception. */
