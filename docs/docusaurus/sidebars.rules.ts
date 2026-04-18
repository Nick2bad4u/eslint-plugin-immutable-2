/**
 * @packageDocumentation
 * Sidebar generation for immutable rule documentation.
 */

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/** Complete sidebar structure for docs site navigation. */
const sidebars = {
    rules: [
        {
            className: "sb-doc-overview",
            id: "overview",
            label: "🏁 Overview",
            type: "doc",
        },
        {
            className: "sb-doc-getting-started",
            id: "getting-started",
            label: "🚀 Getting Started",
            type: "doc",
        },
        {
            className: "sb-cat-guides",
            collapsed: true,
            customProps: {
                badge: "guides",
            },
            type: "category",
            label: "🧭 Adoption & Rollout",
            link: {
                type: "generated-index",
                title: "Adoption & Rollout",
                description:
                    "Shared migration, rollout, and fix-safety guidance for rule adoption.",
            },
            items: [
                {
                    id: "guides/adoption-checklist",
                    label: "✅ Adoption checklist",
                    type: "doc",
                },
                {
                    id: "guides/rollout-and-fix-safety",
                    label: "🛡️ Rollout and fix safety",
                    type: "doc",
                },
                {
                    id: "guides/preset-selection-strategy",
                    label: "💭 Preset selection strategy",
                    type: "doc",
                },
                {
                    id: "guides/type-aware-linting-readiness",
                    label: "🧪 Type-aware linting readiness",
                    type: "doc",
                },
                {
                    id: "guides/snapshot-testing",
                    label: "🧷 Snapshot testing",
                    type: "doc",
                },
            ],
        },
        {
            className: "sb-cat-presets",
            collapsed: true,
            customProps: {
                badge: "presets",
            },
            type: "category",
            label: "Presets",
            link: {
                type: "doc",
                id: "presets/index",
            },
            items: [
                {
                    className: "sb-preset-functional-lite",
                    id: "presets/functional-lite",
                    label: "🟢 Functional Lite",
                    type: "doc",
                },
                {
                    className: "sb-preset-functional",
                    id: "presets/functional",
                    label: "🟡 Functional",
                    type: "doc",
                },
                {
                    className: "sb-preset-immutable",
                    id: "presets/immutable",
                    label: "🟠 Immutable",
                    type: "doc",
                },
                {
                    className: "sb-preset-recommended",
                    id: "presets/recommended",
                    label: "🔵 Recommended",
                    type: "doc",
                },
                {
                    className: "sb-preset-all",
                    id: "presets/all",
                    label: "🟣 All",
                    type: "doc",
                },
            ],
        },
        {
            className: "sb-cat-rules",
            collapsed: true,
            customProps: {
                badge: "rules",
            },
            type: "category",
            label: "Rules",
            link: {
                type: "generated-index",
                title: "Rule Reference",
                slug: "/",
                description:
                    "Rule documentation for every eslint-plugin-immutable-2 rule.",
            },
            items: [
                {
                    id: "immutable-data",
                    label: "immutable-data",
                    type: "doc",
                },
                {
                    id: "no-class",
                    label: "no-class",
                    type: "doc",
                },
                {
                    id: "no-conditional-statement",
                    label: "no-conditional-statement",
                    type: "doc",
                },
                {
                    id: "no-expression-statement",
                    label: "no-expression-statement",
                    type: "doc",
                },
                {
                    id: "no-let",
                    label: "no-let",
                    type: "doc",
                },
                {
                    id: "no-loop-statement",
                    label: "no-loop-statement",
                    type: "doc",
                },
                {
                    id: "no-method-signature",
                    label: "no-method-signature",
                    type: "doc",
                },
                {
                    id: "no-mixed-interface",
                    label: "no-mixed-interface",
                    type: "doc",
                },
                {
                    id: "no-reject",
                    label: "no-reject",
                    type: "doc",
                },
                {
                    id: "no-this",
                    label: "no-this",
                    type: "doc",
                },
                {
                    id: "no-throw",
                    label: "no-throw",
                    type: "doc",
                },
                {
                    id: "no-try",
                    label: "no-try",
                    type: "doc",
                },
                {
                    id: "readonly-array",
                    label: "readonly-array",
                    type: "doc",
                },
                {
                    id: "readonly-keyword",
                    label: "readonly-keyword",
                    type: "doc",
                },
            ],
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
