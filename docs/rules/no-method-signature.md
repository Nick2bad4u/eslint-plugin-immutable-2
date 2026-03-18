# no-method-signature

Disallow interface method signatures.

## Targeted pattern scope

This rule targets `TSMethodSignature` nodes in TypeScript interfaces.

## What this rule reports

- Method signatures inside interfaces, such as `run(): void`

## Why this rule exists

Readonly function-valued properties are more explicit and align with immutable interface design.

## ❌ Incorrect

```ts
interface Service {
  run(input: string): number;
}
```

## ✅ Correct

```ts
interface Service {
  readonly run: (input: string) => number;
}
```

> **Rule catalog ID:** R907

## Further reading

- [TypeScript interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
