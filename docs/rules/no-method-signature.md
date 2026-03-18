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

## Additional examples

```ts
// ❌ Optional method signature
interface Formatter {
  format?(value: string): string;
}

// ✅ Optional readonly function property
interface Formatter {
  readonly format?: (value: string) => string;
}
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    plugins: { immutable },
    rules: {
      "immutable/no-method-signature": "error",
    },
  },
];
```

## When not to use it

If your TypeScript style guide intentionally uses method signatures for readability (especially in public library interfaces with overload-heavy APIs), this rule may conflict with established conventions. In that case, keep a consistent method-signature style instead of mixing both forms.

> **Rule catalog ID:** R907

## Further reading

- [TypeScript interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
