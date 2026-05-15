# gt-gh

GitHub-only stacked changes CLI compatible with Graphite-style `gt` commands.

## Install

```bash
npm install -g gt-gh
```

Then run:

```bash
gt --help
```

If you already have another `gt` binary installed, use the package-specific binary:

```bash
gt-gh --help
```

## Quick start

```bash
gt init --trunk main
gt create my-change -a -m "My change"
gt submit
gt submit --stack
```

## Notes

- PR operations use the GitHub CLI (`gh`), not Graphite APIs.
- Authenticate GitHub first with `gh auth login` or `gt auth`.
- Graphite-platform-only features such as AI metadata and merge-when-ready are not supported.
