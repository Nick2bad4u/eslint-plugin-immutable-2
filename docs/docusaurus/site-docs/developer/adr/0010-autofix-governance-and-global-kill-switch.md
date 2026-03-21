---
title: ADR 0010 - Conservative Autofix Governance Without Runtime Toggles
description: Decision record for keeping autofix policy conservative and rule-local instead of exposing plugin-wide runtime switches.
sidebar_position: 10
---

# ADR 0010: Keep autofix governance conservative and rule-local

- Status: Accepted
- Date: 2026-02-28

## Context

This plugin includes a mix of report-only rules, suggestion-backed migrations,
and a smaller set of safe local autofixes.

The current implementation does **not** expose custom `settings.immutable`
runtime toggles, nor does it perform import insertion or other cross-file
rewrite orchestration. Fix policy is decided inside each rule through ordinary
`context.report({ fix })` or `context.report({ suggest })` behavior.

## Decision

Adopt a formal autofix governance model with these constraints:

1. Rules should only emit `fix` when safety is deterministic.
2. Rules should emit `suggest` for behavior-sensitive migrations.
3. The plugin should not advertise plugin-wide runtime autofix toggles until a
   real implementation need exists.

## Rationale

1. **Operational safety**: today’s fixers are small, local text rewrites that
   can be governed accurately at rule level.
2. **Predictable rollout**: teams can already stage adoption through preset
   choice, severity changes, and `--fix` usage in CI.
3. **Honest documentation**: exposing nonexistent runtime toggles would make
   setup docs actively misleading.

## Consequences

- Fix behavior is intentionally conservative, but implemented rule-by-rule.
- Rule authors must classify fixes as deterministic (`fix`) vs contextual (`suggest`).
- Public docs should describe preset choice, rule options, and `--fix` usage as the current rollout controls.

## Revisit Triggers

Re-evaluate if:

- the plugin adds broader rewrite classes that need shared orchestration,
- ESLint introduces stronger first-class fix governance primitives,
- or contributors report a concrete need for plugin-level suppression beyond normal config/severity workflows.
