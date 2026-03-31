# Bootstrap Guide

## Purpose

Define the initial package startup behavior for Nexxoria.

## What bootstrap does in this iteration

- confirms the package entrypoint is available
- exposes the primary system entrypoint
- signals that the base package is ready

## Command

```bash
npm run bootstrap
```

## Expected result

The command prints a short package status message and points the user to:

- `SKILL.md`
- `install/install.md`
- `install/bootstrap.md`

## Why this is enough for now

This iteration focuses on building a clean, installable base package and a well-defined conversation module, without adding premature runtime complexity.
