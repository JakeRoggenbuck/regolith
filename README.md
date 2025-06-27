# Regolith

[![Rust](https://img.shields.io/badge/Rust-1A5D8A?style=for-the-badge&logo=rust&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=rust&sort=stargazers)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=typescript)

<!-- TODO: Update the links to the yet to be published package -->
[![Version](https://img.shields.io/npm/v/is_254_or_larger?style=for-the-badge)](https://www.npmjs.com/package/is_254_or_larger)
[![NPM Downloads](https://img.shields.io/npm/dy/is_254_or_larger?style=for-the-badge)](https://www.npmjs.com/package/is_254_or_larger)
[![CI](https://img.shields.io/github/actions/workflow/status/jakeroggenbuck/regolith/CI.yml?branch=main&style=for-the-badge)](https://github.com/JakeRoggenbuck/regolith/actions)

A TypeScript and JavaScript library immune to Regular Expression Denial of Service (ReDoS) attacks by using Rust and linear RegEx under the hood. Regolith has a linear worst case time complexity, compared to the default RegExp found in TypeScript and JavaScript, which has an exponential worst case.

Regolith attempts to be a drop-in replacement for RegExp and requires minimal (to no) changes to be used instead. The goal of Regolith is to allow developers to easily build software that is immune to ReDoS attacks.

<img src="./images/regolith-drop-in.svg">

> [!IMPORTANT]
> Regolith is still early in development! We need help building and getting developer adoption!

## Preventing ReDoS Attacks

### What are ReDoS attacks

[https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)

Here is an example of how Python has an exponetial increase in execution time for worst case.

![image](https://github.com/user-attachments/assets/bc346814-92ca-44c9-b906-d9fa22df7095)

Here is a table showing some popular languages and if their RegEx library has an exponential worst case or not.

![image](https://github.com/user-attachments/assets/e3e3fd36-35de-4958-b092-80ee04a590ec)

Images: Jake Roggenbuck - Preventing ReDoS Attacks - 2025

### How Regolith prevents them
- Talk about NFA
- Talk about Rust Regex

### What the result is
- Talk about all the different CVEs that happen and how they can be avoided

Since ReDoS vulnerabilites are hard to spot, there are rather frequent CVEs that get submitted. Having a RegEx library that has a linear worst case time would completely prevent all of these potential issues.

## Usage (Quick Start)

#### 1. Install

```
npm i regolith
```

#### 2. Try it out

```ts
import { Regolith } from 'regolith';

const pattern = new Regolith("^\\d+$");

pattern.test("12345");  // true
pattern.test("Hello");  // false
```

## Development

These are instructions only if you want to build this library yourself (e.g. for development).

### Building

1. Before you build, you will need to have yarn installed. [Here](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) is a guide for installing yarn.
2. You will also need Rust, and you can install Rust with [rustup](https://rustup.rs/).

```sh
yarn build
```

Running `yarn build` will build the Rust package, and you should see the Rust compiler complete the build process.

![image](https://github.com/user-attachments/assets/2d73edf6-284e-4443-b108-e57f3ca38b02)

### Running

Now we can test to see if Regolith was built correctly. We can open the `node` REPL and load the library.

```sh
node
```

After opening the shell, you can load the libary with:

```ts
const { Regolith } = await import("./index.js");
```

After that, you can use Regolith as normal.

```ts
const integerPattern = new Regolith("^\\d+$");
integerPattern.test("123");
```

Here is an example of running Regolith in the REPL to test if it built correctly.

![image](https://github.com/user-attachments/assets/4282491b-4f2e-4e88-ad6e-7e49f0958164)


### Testing

#### Testing the TS/JS library

```
yarn test
```

You should see the tests complete. Currently, there are 93 tests that get run.

![image](https://github.com/user-attachments/assets/2b7a8140-a4f9-430d-8c59-d6369efa67ed)

#### Testing the Rust bindings

```
cargo test
```

Here is what the output should look like:

![image](https://github.com/user-attachments/assets/86d5ec69-6cc4-4ba5-bf9b-e6005023e329)

### Publishing Checklist

1. Increment the version in [package.json](./package.json)
2. All changes are merged into main
3. Run the tests with `yarn test`
4. Run `npm login`
5. Run `npm publish`

### Report a Bug

If you find a bug, please send me an email at `bug at jr0 dot org` or and [open an issue](https://github.com/JakeRoggenbuck/regolith/issues).
