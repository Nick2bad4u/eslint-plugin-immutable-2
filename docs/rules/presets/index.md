---
title: Presets
description: Preset reference and selection guide for eslint-plugin-immutable-2.
---

# Presets

Use one of these presets based on how aggressively you want to enforce immutable and functional patterns.

| Preset          | Config key                             | Use when                                                              |
| --------------- | -------------------------------------- | --------------------------------------------------------------------- |
| Functional Lite | `immutable.configs["functional-lite"]` | You want functional constraints with a lower migration burden.        |
| Functional      | `immutable.configs.functional`         | You want strong functional constraints across the codebase.           |
| Immutable       | `immutable.configs.immutable`          | You want immutable-data defaults without the full functional surface. |
| Recommended     | `immutable.configs.recommended`        | Alias of `immutable` for a familiar default key.                      |
| All             | `immutable.configs.all`                | You want every rule in this plugin enabled.                           |

Each preset page in this section includes:

- when to use it
- exact config key
- copy/paste Flat Config snippet

See detailed preset pages for exact rule sets:

- [Functional Lite](./functional-lite.md)
- [Functional](./functional.md)
- [Immutable](./immutable.md)
- [Recommended](./recommended.md)
- [All](./all.md)
