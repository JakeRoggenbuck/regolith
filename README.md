# Regolith
A TypeScript (currently JS) library immune to ReDoS attacks by using Rust under the hood.

^^ This needs a better explanation about how it's a categorically different way of doing regex that cannot be attack by ReDoS in the same way by not supporting the features that cause ReDoS.

## Building

```sh
yarn build
```

## Running

```sh
node
```

```ts
import { Regolith } from './regolith';

const integerPattern = new Regolith("^\\d+$");

console.log("Integer test:", integerPattern.test("12345")); // true
console.log("Integer test:", integerPattern.test("12a45")); // false
```

## Testing

```
yarn test
```
