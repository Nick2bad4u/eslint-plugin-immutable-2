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

## Additional examples

```ts
// ❌ Mixed member styles in one interface
interface Repository {
  find(id: string): Promise<Item>;
  readonly save: (item: Item) => Promise<void>;
}

// ✅ Uniform function-property member style
interface Repository {
  readonly find: (id: string) => Promise<Item>;
  readonly save: (item: Item) => Promise<void>;
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
      "immutable/no-mixed-interface": "error",
    },
  },
];
```

## When not to use it

This rule may be too strict when you maintain ambient typings that must mirror external API shapes exactly. For declaration files sourced from third-party contracts, preserving upstream style can be more important than enforcing internal consistency.

> **Rule catalog ID:** R908

## Further reading

- [TypeScript interface declarations](https://www.typescriptlang.org/docs/handbook/2/objects.html)
