# Regolith

[![Rust](https://img.shields.io/badge/Rust-1A5D8A?style=for-the-badge&logo=rust&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=rust&sort=stargazers)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=typescript)

<!-- TODO: Update the links to the yet to be published package -->
[![Version](https://img.shields.io/npm/v/is_254_or_larger?style=for-the-badge)](https://www.npmjs.com/package/is_254_or_larger)
[![NPM Downloads](https://img.shields.io/npm/dy/is_254_or_larger?style=for-the-badge)](https://www.npmjs.com/package/is_254_or_larger)
[![CI](https://img.shields.io/github/actions/workflow/status/jakeroggenbuck/regolith/CI.yml?branch=main&style=for-the-badge)](https://github.com/JakeRoggenbuck/regolith/actions)

A TypeScript and JavaScript library immune to Regular Expression Denial of Service (ReDoS) attacks by using Rust and linear RegEx under the hood. Regolith has a linear worst case time complexity, compared to the default RegExp found in TypeScript and JavaScript, which has an exponential worst case.

**Motivation:** I wanted a Regex library for TypeScript and JavaScript where I didn't have to worry about ReDoS attacks.

> [!IMPORTANT]
> Regolith is still early in development! We need help building and getting developer adoption!

## Drop-in Replacement

Regolith attempts to be a drop-in replacement for RegExp and requires minimal (to no) changes to be used instead. The goal of Regolith is to allow developers to easily build software that is immune to ReDoS attacks.

<img src="./images/regolith-drop-in.svg">

## Preventing ReDoS Attacks

### What are ReDoS attacks

Regular Expression Denial of Service (ReDoS) attacks occur when vulnerable Regex patterns are executed with specificly contructed inputs that results in an inefficient execution. This can be exploited to cause services to become unavailable because the services are stuck trying to compute a difficult to compute Regex.

Read more: [owasp.org](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) & [learn.snyk.io](https://learn.snyk.io/lesson/redos/?ecosystem=javascript)

### Exponential Worst Case

Here is an example of how Python has an exponetial increase in execution time for worst case.

<img src="https://github.com/user-attachments/assets/bc346814-92ca-44c9-b906-d9fa22df7095" width="700" />

This is the same case for TypeScript and JavaScript.

### Linear vs Exponential Regex Libraries

Here is a table showing popular languages and if their Regex library has a linear worst case or an exponential worst case. It also includes experimental results for how long execution took for a vulnerable Regex pattern that can be attacked with ReDoS and an input of size 30. 

<img src="https://github.com/user-attachments/assets/e3e3fd36-35de-4958-b092-80ee04a590ec" width="700" />

Note that TypeScript and JavaScript do not have a linear worst case for Regex, making them vulnerable to these types of attacks.

More information and images: [Jake Roggenbuck - Preventing ReDoS Attacks - 2025](https://jr0.org/cdn/Roggenbuck-Jake-Preventing-ReDoS-Attacks-2025.pdf)

### Impact

> [!NOTE]  
> ReDoS attacks happen relatively frequently to popular libraries costing millions of hours of work. This can be prevented with linear regex engines like Regolith.

These vulnerabilities happen relatively often in popular libraries. It's no one's fault specifically, it just comes down to the fact that the language allows for these things to happen.

A recent example of a ReDoS vulneravility is [CVE-2025-5889](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2025-5889) from [brace-expansion](https://github.com/juliangruber/brace-expansion). Again, this isn't any fault of that project, it's simply an issue with the language allowing this to happen. Measures can be put into place to reduce the risk of this, but it's hard to spot and test for these issues.

The [brace-expansion](https://github.com/juliangruber/brace-expansion) project is used by 42.5 million other projects on GitHub. Meaning if everyone were to patch their software (which the hopefully will), that's 42.5 million pull requests, and 42.5 million build minutes, and probably more than 42 million engineering minutes as well. All of that for a single vulnerability, and that's just a lower bound of effort spent on this.

Other versions of [brace-expansion](https://github.com/juliangruber/brace-expansion) had these patches backported to them, needing updates for version [1](https://github.com/juliangruber/brace-expansion/commit/c3c73c8b088defc70851843be88ccc3af08e7217), [2](https://github.com/juliangruber/brace-expansion/commit/36603d5f3599a37af9e85eda30acd7d28599c36e), [3](https://github.com/juliangruber/brace-expansion/commit/15f9b3c75ebf5988198241fecaebdc45eff28a9f), and the current version [4](https://github.com/juliangruber/brace-expansion/pull/65).

Having a library that is immune to these vulnerabilities would save that effort if widely adopted. Adoption of libraries is difficult, especially when they aren't very flashy, but helping library mainainers and engineers not worry about ReDoS for one library, one project at a time, is our goal.

### Trade-off

The Rust [Regex library](https://docs.rs/regex/latest/regex/) purposefully excludes features that make Regex engines particularly vulnerable to ReDoS attacks. Those features being backreferences and look-around. Excluding those features allow [Regex](https://docs.rs/regex/latest/regex/) to guarantee linear time execution.

Since Regolith uses Rust bindings to implement the Rust [Regex library](https://docs.rs/regex/latest/regex/) to achieve linear time worst case, this means that backreferences and look-around aren't available in Regolith either.

This trade-off has proven to be worth it for the Rust community of libraries and projects.

<!-- TODO
Explain specifically what backreferences and look-around are.
-->

<!-- TODO
### How Regolith prevents them
- Talk about NFA
- Talk about Rust Regex
-->

### Results
<!-- TODO
- Talk about all the different CVEs that happen and how they can be avoided
-->

Since ReDoS vulnerabilites are hard to spot, there are rather frequent CVEs that get submitted. Having a RegEx library that has a linear worst case time would completely prevent all of these potential issues.

### Rust Regex under the hood

Regolith makes JavaScript bindings (using [napi-rs](https://github.com/napi-rs/napi-rs)) that implement the features of the very popular [Regex library](https://docs.rs/regex/latest/regex/) for Rust. Initially when I had this idea for this library, I wanted to implement my own linear time regex engine. Now there is a chance I still end up doing that, I realized it's better to not duplicate the work of the already excellent [Regex library](https://docs.rs/regex/latest/regex/) and focus on making these JavaScript and TypeScript bindings the best they can be. The focus of this project is to deliver the best linear time regex engine to TypeScript and JavaScript, where it prevously hasn't been widely available to use.

My full appreciation goes out to the developers of the Rust Regex library, who enabled this project to exist.

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

### Docs

#### 1. Important Files

| name           | purpose                                                                                                               | docs                                                                                          |
|----------------|-----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| `build.rs`     | Runs the setup for [napi-rs](https://github.com/napi-rs/napi-rs)                                                      |                                                                                               |
| `Cargo.lock`   | Automatically generated by Cargo to keep track of Rust package versions                                               |                                                                                               |
| `Cargo.toml`   | Contains information about the Rust crate; like the name, version, and dependencies                                   |                                                                                               |
| `index.d.ts`   | Type information automatically generated by [napi-rs](https://github.com/napi-rs/napi-rs)                             |                                                                                               |
| `index.js`     | The main entry point for the library that is automatically generated by [napi-rs](https://github.com/napi-rs/napi-rs) |                                                                                               |
| `package.json` | Information about the Regolith package                                                                                |                                                                                               |
| `rustfmt.toml` | A config for the Rust formatter                                                                                       |                                                                                               |
| `yarn.lock`    | Keeps track of the dependency version for yarn and it automatically generated                                         |                                                                                               |
| `.npmignore`   | Keeps files and directories out of what is shipped in the library                                                     | [Link](https://docs.npmjs.com/cli/v10/using-npm/developers#keeping-files-out-of-your-package) |
| `.yarnrc.yml`  | Configure yarn settings                                                                                               |                                                                                               |

#### 2. Formatting

##### 2.1 Rust Format

Use `cargo fmt`. This is actually checked in the automated tests when you create a pull request. You can also see [rustfmt.toml](./rustfmt.toml) for the config for `cargo fmt`.

##### 2.2 TypeScript / JavaScript Format

Use [prettier](https://github.com/prettier/prettier) with `prettier --write <file>` or `prettier --write .` to format all `.ts` and `.js` files.

### Report a Bug

If you find a bug, please send me an email at `bug at jr0 dot org` or and [open an issue](https://github.com/JakeRoggenbuck/regolith/issues).

### Motivation and Background

I was initially inspired to build this library after doing [undergraduate research](https://jr0.org/cdn/Roggenbuck-Jake-Preventing-ReDoS-Attacks-2025.pdf) to learn more about why certain languages have problems with ReDoS and others don't. This led me to a question I couldn't answer: "Why isn't the most popilar Regex library a linear time engine for languages like TypeScript, JavaScript, and Python?" You'd think that having a library that cannot get attacked (in a common way software often gets attacked) would be more commonly used. I found an example called [regexy](https://github.com/nitely/regexy) in Python, but there hasn't been an update in 8 years, and it was archived in 2024. There is also [rure-python](https://github.com/davidblewett/rure-python) but this has not been updated in 6 years either. JavaScript has some more popular libraries that adress this issue too. One is called [re2js](https://github.com/le0pard/re2js), which wraps Google's [RE2 library](https://github.com/google/re2) written in C++. [re2js](https://github.com/le0pard/re2js) has a different API as the default RegExp from JavaScript, requiring some reworking on code that needs to be migrated over. The other is called [node-re2](https://github.com/uhop/node-re2), and this library also provides bindings for Google's [RE2 library](https://github.com/google/re2). [node-re2](https://github.com/uhop/node-re2) does have an API similar to JavaScript's RegExp. Even with these libraries, anecdotally it feels like the vast majority or projects still use the default regex for their respective languages; libraries that are vulnerable to ReDoS attacks. I could not find an exact percentage for how many projects use linear time engines vs exponential engines so this should be something to either find out from literature or maybe even try to answer this question directly, by reviewing packages published and trying to calculate a percentage.

Ultimitely, I wanted a Regex library for TypeScript and JavaScript where I didn't have to worry about ReDoS attacks. My hope is that this library brings value to your software as well.
