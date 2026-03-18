---
title: ADR 0005 - Runtime vs Type-Level Rule Families
description: Decision record for keeping immutable-data and functional-constraint rules as distinct families.
sidebar_position: 5
---

# ADR 0005: Keep immutable-data and functional-constraint rules as separate families

- Status: Accepted
- Date: 2026-02-25

## Context

The plugin enforces two different policy categories:

1. **Immutable-data enforcement**: prevent mutable state and encourage readonly declarations (`immutable-data`, `readonly-array`, `readonly-keyword`).
2. **Functional constraints**: restrict imperative control-flow and side-effect patterns (`no-let`, `no-loop-statement`, `no-expression-statement`, `no-throw`, etc.).

Mixing these categories into one conceptual family created confusion in rollout planning because data-mutation policy and control-flow policy have different migration costs and team impact.

## Decision

Keep two explicit rule families and document them as separate design tracks:

- `immutable-data` / `readonly-*` rules are treated as data immutability standardization.
- `no-*` functional rules are treated as control-flow and side-effect restrictions.

Rule docs, release notes, and migration guidance should continue to preserve this split.

## Rationale

1. **Clear risk model**: data immutability migrations are usually mechanical; functional-constraint migrations may require structural refactors.
2. **Cleaner rollout strategy**: teams can phase readonly/data rules and control-flow restrictions independently.
3. **Better rule authoring discipline**: rule metadata, fixes, and examples remain aligned with the migration category.

## Consequences

- Documentation and changelogs should explicitly label which family a rule belongs to.
- Bulk autofix campaigns can be grouped by risk profile (data-shape vs control-flow).
- New rules should declare category intent up front during design/review.

## Revisit Triggers

Re-evaluate if:

- the project introduces cross-family rules that intentionally combine data-shape and control-flow transformations,
- or users report that the split no longer reflects how migration work is planned.
