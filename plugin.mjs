// @ts-nocheck -- runtime shim imports generated dist output that may not exist during typecheck.
import builtPlugin from "./dist/plugin.js";

/** @type {import("eslint").ESLint.Plugin} */
const plugin = {
    ...builtPlugin,
};

export default plugin;
