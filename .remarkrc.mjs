import { createConfig } from "remark-config-nick2bad4u";
import { isMap, isScalar, parseDocument } from "yaml";

const FIRST_HEADING_LEVEL_PLUGIN_NAME = "remark-lint:first-heading-level";

/**
 * Check whether YAML frontmatter declares a top-level title key.
 *
 * @param {string} value - Raw frontmatter text.
 *
 * @returns Whether the frontmatter supplies the rendered page title.
 */
const hasYamlFrontmatterTitle = (value) => {
    const document = parseDocument(value);
    if (document.errors.length > 0 || !isMap(document.contents)) {
        return false;
    }

    return document.contents.items.some(
        ({ key }) => isScalar(key) && key.value === "title"
    );
};

/**
 * Enforce an H1 for standalone Markdown and an H2 after a frontmatter title.
 *
 * @returns Remark transformer that understands Docusaurus title frontmatter.
 */
const remarkLintFrontmatterFirstHeadingLevel =
    () =>
    /**
     * @param {import("mdast").Root} tree - Parsed Markdown document.
     * @param {import("vfile").VFile} file - Current virtual file.
     */
    (tree, file) => {
        const frontmatter = tree.children.find(
            (node) =>
                node.type === "yaml" &&
                "value" in node &&
                typeof node.value === "string" &&
                hasYamlFrontmatterTitle(node.value)
        );
        const firstHeading = tree.children.find(
            (node) => node.type === "heading"
        );

        if (firstHeading?.type !== "heading") {
            return;
        }

        const expectedDepth = frontmatter === undefined ? 1 : 2;
        if (firstHeading.depth !== expectedDepth) {
            file.message(
                `Unexpected first heading rank \`${String(firstHeading.depth)}\`, expected rank \`${String(expectedDepth)}\``,
                firstHeading,
                FIRST_HEADING_LEVEL_PLUGIN_NAME
            );
        }
    };

const sharedRemarkConfig = createConfig({
    plugins: [],
    settings: {},
});

/** @type {import("remark-config-nick2bad4u").RemarkConfig} */
const remarkConfig = {
    ...sharedRemarkConfig,
    plugins: [
        ...sharedRemarkConfig.plugins.filter((entry) => {
            const plugin = Array.isArray(entry) ? entry[0] : entry;
            return (
                typeof plugin !== "function" ||
                plugin.name !== FIRST_HEADING_LEVEL_PLUGIN_NAME
            );
        }),
        remarkLintFrontmatterFirstHeadingLevel,
    ],
};

export default remarkConfig;
