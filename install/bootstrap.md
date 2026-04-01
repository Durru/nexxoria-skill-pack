# Bootstrap Guide

## Purpose

Define how Nexxoria becomes active in OpenCode after cloning by Git.

## Command

```bash
./install.sh
```

## What the script does

1. resolves the current repository path
2. creates `opencode.json` if it does not exist
3. appends the Nexxoria plugin reference if missing
4. leaves the repository ready for OpenCode discovery after restart

## Expected activation path

After bootstrap and OpenCode restart:

- OpenCode loads `.opencode/plugins/nexxoria.js`
- the plugin registers `skills/` as a discovered skills path
- OpenCode can discover the `nexxoria` skill
- bootstrap guidance is injected into the first user message of the session

## Project bootstrap behavior

After the plugin is active, Nexxoria uses conversation as the entry module.
If the target project does not yet contain `.nexxoria/`, Nexxoria bootstraps the structure automatically from templates.

## Why this activation model

This keeps Nexxoria:

- portable by Git
- simple to install
- consistent with OpenCode plugin loading
- ready to evolve without rebuilding the infrastructure

## Modes

- `./install.sh` → installs from GitHub (recommended)
- `./install.sh local` → loads the plugin directly from the cloned local repository for development
