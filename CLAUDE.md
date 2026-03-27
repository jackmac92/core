# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

`s-scripts` is a script dispatch framework — a CLI tool (`s`) that turns a filesystem hierarchy into a command palette with tab completion. Scripts are organized into subdirectories under `$SCRIPTS_PATH`, and `s <cmd> <subcmd>` walks the tree to find and execute the right file.

## Key Concepts

### How `s` Dispatches Scripts
`bin/s` iterates over colon-separated `$SCRIPTS_PATH` dirs, calling `checkScriptDir` which walks the argument list to traverse subdirectories. When it finds an executable file matching the full argument path, it runs it. The first match across all script dirs wins.

Special execution modes (checked in order):
- `script.inproc` sidecar → `source` the script (runs in current shell)
- `script.direnv` sidecar or `.envrc` in dir → wraps with `direnv exec`
- Otherwise → executes directly

### Script Lookup: `which` / `whicha`
`s which <name>` → resolves to a single path (first match).
`s whicha <name>` → lists all matches (exact file, then parent dir, then first root as fallback). Used by `new`, `edit`, `cat`.

### Help System
- `script.help` sidecar file → used by tab completion and `s help <name>`
- Without a `.help` file, help falls back to the first `# comment` line in the script

### Special Script Flags
- `.inproc` sidecar → script is sourced instead of executed (for shell builtins/aliases)
- `.direnv` sidecar → script runs under `direnv exec`

### Completion (`completion/_s`)
- Zsh compdef-based, reads `$SCRIPTS_PATH` at completion time
- Caches per-directory with `_store_cache`/`_retrieve_cache`; invalidated when files change
- `S_SCRIPT_PASSTHRU_CMDS` — commands that stay in same dir instead of descending: `cat which whicha mkhelp new edit delete debug rename duplicate`
- `S_SCRIPT_IGNORED_DIRNAMES` — dirs skipped during completion: `goss.d`

### Meta Scripts (`scripts/meta/`)
Built-in introspection subcommands:
- `last-invoked` / `last-executed` — query SQLite DB for recent script runs
- `dangling-docs` — find `.help` files with no corresponding script
- `needs-docs` — scripts missing `.help` files
- `list-all` / `list-all-full-paths` / `search-all` — enumerate scripts across `$SCRIPTS_PATH`
- `reflect` — introspection helpers
- `source-s-scripts-envd` — source environment for scripts

### SQLite Tracking
`s` records invocations and completions in `$SCRIPTS_LOCAL_DIR/s-scripts-meta.db` (tables: `invocations`, `executions`). Requires `jo` and `sqlite-utils`.

## Testing Completion

Test the `_s` zsh completion function without a live shell:

```sh
zsh scripts/test_s_completion.zsh "s meta "
```

The script loads `completion/_s` and runs `_s` against a simulated word list, printing completions to stdout.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `SCRIPTS_PATH` | Colon-separated list of script root dirs (default includes several `~/.local/...` paths) |
| `SCRIPTS_LOCAL_DIR` | Where the SQLite DB lives |
| `S_DEBUGGER` | Set to any value to enable `set -x` tracing in `bin/s` |
| `S_INNER_CALL` | Set by `s` to prevent recursive top-level tracking |
| `INHIBIT_S_INNER_CALL` | Prevent `s` from setting `S_INNER_CALL` |
| `S_FORCE_INPROC` | Force all scripts to be sourced instead of executed |

## Adding a New Script

```sh
s new <category> <name>        # creates file, opens $EDITOR
s new <category> <name> -- <cmd>  # creates file with <cmd> as body, no editor
```

`new` uses `s which` to resolve the target path within `$SCRIPTS_PATH`, then creates a `#!/usr/bin/env bash` stub.

## Nix Integration

`modules/s-scripts.nix` is a Home Manager module that exposes `options.sScripts.{enable,scriptsPaths,runScripts}` for declarative integration.
