# readonly-keyword

Require readonly modifiers where possible.

## Targeted pattern scope

This rule targets class fields, TypeScript property signatures, and TypeScript index signatures.

## What this rule reports

- Missing `readonly` on class properties
- Missing `readonly` on interface/type property signatures
- Missing `readonly` on index signatures

## Why this rule exists

Readonly properties communicate immutability at the type level and prevent accidental mutation.

## ❌ Incorrect

```ts
interface State {
  value: number;
}
```

## ✅ Correct

```ts
interface State {
  readonly value: number;
}
```

## Additional examples

```ts
// ❌ Mutable class field and index signature
class Settings {
  theme = "dark";
}

interface Cache {
  [key: string]: string;
}

// ✅ Readonly members communicate intent
class Settings {
  readonly theme = "dark";
}

interface Cache {
  readonly [key: string]: string;
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
      "immutable/readonly-keyword": "error",
    },
  },
];
```

## When not to use it

Avoid this rule in models that are intentionally mutable during their lifecycle (for example form-draft objects, active-record entities, or mutable adapter DTOs). Enforcing readonly in those domains can push developers toward unnecessary type assertions.

> **Rule catalog ID:** R914

## Further reading

- [TypeScript readonly modifier](https://www.typescriptlang.org/docs/handbook/2/classes.html#readonly)
