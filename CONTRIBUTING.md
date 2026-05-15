# Contributing

Contributions are welcome! Please first open an issue so that we can discuss before opening a PR. Please include context, reproduction steps, and tests when possible.

## Getting Started

[Install nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) to ensure you're using the right node version. Once that is installed, from the repository directory run:

```
nvm use
```

Enable Corepack so the repo uses its pinned Yarn version

```
corepack enable
```

Build the monorepo

```
corepack yarn install
corepack yarn turbo run build
```

Build the CLI

```
cd apps/cli
corepack yarn install
corepack yarn build
```

## Running Tests

```
cd apps/cli
DEBUG=1 corepack yarn test --full-trace
```

Running a subset of tests

```
cd apps/cli
DEBUG=1 corepack yarn test --full-trace -g "test pattern"
```

Running one test

```
cd apps/cli
DEBUG=1 corepack yarn test-one "<path to .js test file in dist folder>"
```

## Run CLI from Local Build

```
cd apps/cli
corepack yarn cli <command> # (to run `gt <command>`)
```

Linking `gt` to a locally built version (includes a build)

```
cd apps/cli
corepack yarn dev
# then to run commands:
gt <command>
```

## Generating the macOS ARM Binary

Due to limitations with GitHub Actions, we need to manually generate the macOS ARM binary for a release.

From the CLI app directory:

```
corepack yarn build-pkg -t node18-macos -o gt-macos-arm64
```

## Getting Release Binary Hashes

Download all 3 binaries and then run:

```
shasum -a 256 /path/to/mybinary
```
