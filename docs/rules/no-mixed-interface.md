# no-mixed-interface

Keep interface members structurally consistent.

## Targeted pattern scope

This rule targets `TSInterfaceDeclaration` members and checks transitions between member shapes.

## What this rule reports

- Interfaces mixing method signatures and property signatures
- Interfaces mixing incompatible member kinds in sequence

## Why this rule exists

Consistent member style improves readability and avoids accidental API shape drift.

## ❌ Incorrect

```ts
interface Api {
  run(): void;
  readonly label: string;
}
```

## ✅ Correct

```ts
interface Api {
  readonly run: () => void;
  readonly label: string;
}
```

> **Rule catalog ID:** R908

## Further reading

- [TypeScript interface declarations](https://www.typescriptlang.org/docs/handbook/2/objects.html)
