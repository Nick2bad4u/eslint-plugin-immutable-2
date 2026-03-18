---
title: Presets
description: Preset reference and selection guide for eslint-plugin-immutable-2.
---

# Presets

Use one of these presets based on how strongly you want to enforce immutable and functional patterns.

| Preset | Config key | Use when |
| --- | --- | --- |
| Functional Lite | `immutable.configs["functional-lite"]` | You want functional constraints with lower migration cost. |
| Functional | `immutable.configs.functional` | You want strong functional-style constraints across most code. |
| Immutable | `immutable.configs.immutable` | You want immutable defaults without the full functional surface. |
| Recommended | `immutable.configs.recommended` | Alias of `immutable` for a familiar default key. |
| All | `immutable.configs.all` | You want every rule in this plugin enabled. |

See detailed pages:

- [Functional Lite](./functional-lite.md)
- [Functional](./functional.md)
- [Immutable](./immutable.md)
- [Recommended](./recommended.md)
- [All](./all.md)