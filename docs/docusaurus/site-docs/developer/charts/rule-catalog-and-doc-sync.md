---
title: Rule Source and Docs Synchronization
description: How rule source files, preset definitions, docs pages, and sync scripts stay aligned in eslint-plugin-immutable-2.
sidebar_position: 4
---

# Rule catalog and docs synchronization

Use this diagram to understand how a single rule change propagates through runtime metadata, hand-authored docs, generated tables, and validation tests.

```mermaid
flowchart TB
    classDef src fill:#1e293b,stroke:#93c5fd,color:#f8fafc,stroke-width:1px
    classDef catalog fill:#312e81,stroke:#a5b4fc,color:#eef2ff,stroke-width:1px
    classDef docs fill:#14532d,stroke:#86efac,color:#f0fdf4,stroke-width:1px
    classDef tests fill:#7f1d1d,stroke:#fca5a5,color:#fef2f2,stroke-width:1px
    classDef output fill:#0f766e,stroke:#5eead4,color:#ecfeff,stroke-width:1px

    RuleSource[src/rules/*.ts]
    RuleCreator[src/util/rule.ts]
    PresetSource[src/configs/rule-sets.ts]
    PluginBuild[src/plugin.ts + dist/plugin.js]
    RuleDocs[docs/rules/*.md]
    PresetDocs[docs/rules/presets/*.md]
    ReadmeSync[scripts/sync-readme-rules-table.mjs]
    PresetSync[scripts/sync-presets-rules-matrix.mjs]
    RuleSidebar[docs/docusaurus/sidebars.rules.ts]
    IntegrityTests[test/docs-integrity.test.ts]
    HeadingTests[test/docs-heading-snapshots.test.ts]
    PresetTests[test/configs.test.ts + test/plugin-source-configs.test.ts]
    BuiltDocs[Docusaurus Rule Pages + README]

    RuleSource --> RuleCreator
    RuleSource --> PluginBuild
    PresetSource --> PluginBuild
    PluginBuild --> ReadmeSync
    PluginBuild --> PresetSync
    RuleDocs --> RuleSidebar
    RuleSidebar --> BuiltDocs

    ReadmeSync --> BuiltDocs
    PresetSync --> PresetDocs
    RuleDocs --> IntegrityTests
    RuleDocs --> HeadingTests
    PluginBuild --> PresetTests
    PresetDocs --> PresetTests
    RuleDocs --> BuiltDocs

    class RuleSource,RuleCreator,PresetSource src
    class PluginBuild,ReadmeSync,PresetSync catalog
    class RuleDocs,PresetDocs,RuleSidebar docs
    class IntegrityTests,HeadingTests,PresetTests tests
    class BuiltDocs output
```

## Why this matters

- Runtime metadata and docs URLs come directly from rule source.
- Sync scripts catch drift between preset membership and published tables.
- Docs tests keep hand-authored rule pages present and structurally consistent.

## Common maintenance workflow

1. Update rule logic and `meta.docs` fields in the rule source.
2. Update rule docs if examples/options changed.
3. Re-run README/preset sync scripts when preset or metadata surfaces change.
4. Run docs and preset validation tests before merging.
