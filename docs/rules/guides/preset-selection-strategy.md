---
title: Preset selection strategy
description: Choose the right eslint-plugin-immutable-2 preset and roll it out with minimal migration risk.
---

# Preset selection strategy

This guide helps teams pick a preset based on migration tolerance, type-checking maturity, and rollout velocity.

## Decision checkpoints

Use these checkpoints before choosing a preset:

1. **Type information availability**: Do you run ESLint with project-aware type services in CI/local workflows?
2. **Migration bandwidth**: Can the team handle broad replacement churn this quarter?
3. **Runtime sensitivity**: Do you need to review behavior-sensitive changes manually before broad adoption?
4. **Convergence target**: Do you intend to land on `functional`/`all`, or stay at an immutable baseline?

## Recommended starting points

### `recommended` (alias of `immutable`)

Choose this when:

- You need a low-friction baseline with practical immutable constraints.
- You want immediate value with low code churn.

### `functional-lite`

Choose this when:

- You want structural functional constraints beyond `immutable` without jumping straight to the strictest statement bans.
- You want conditional restrictions but still need returning branches to remain legal.
- You can absorb moderate migration effort.

### `functional`

Choose this when:

- You want strict functional style, including class, `this`, `throw`, `try`, and expression-statement bans, without enabling every possible rule.
- Your team is ready for higher migration effort.

### `all`

Choose this when:

- You want full plugin coverage and can manage incremental cleanup.
- You actively maintain migration and suppression hygiene.

## Rollout playbook

1. Start with `warn` for one target folder/package.
2. Record baseline violations and identify high-churn rule families.
3. Run autofix in scoped batches, then run full tests/typecheck.
4. Promote to `error` after each batch reaches zero violations.
5. Repeat until all target folders are converged.

## Validation gates

- `npm run lint`
- `npm run typecheck`
- `npm run test`

For monorepos, run package-level gates first, then full-repo gates.

## Escalation policy

If a rule creates migration risk or noisy output:

1. Keep the preset enabled.
2. Temporarily lower that single rule to `warn` or `off` with a tracking note.
3. Re-enable after targeted remediation.

This preserves preset consistency while avoiding long-lived blind spots.
