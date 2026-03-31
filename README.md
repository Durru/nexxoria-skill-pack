# Nexxoria Skill Pack

Nexxoria Skill Pack is a single-package foundation for installing a guided project system into OpenCode/OpenCore-style environments.

## What this package provides

- one installation entrypoint
- one primary system skill
- internal modular architecture
- preserved upstream source skills for reference
- an adapted conversation module as the first real system module
- prepared placeholders for planning, tasks, memory, state, and context

## System goals

Nexxoria guides users through project work by helping them:

- clarify what they want to build
- answer key questions
- compare options
- structure work into stages and tasks
- preserve decisions and context
- continue work coherently over time

## Current MVP scope

Implemented in this iteration:

- package infrastructure
- installation scaffolding
- source preservation for conversation logic
- adapted conversation module
- prepared internal module contracts for the remaining MVP modules

Not fully implemented yet:

- planning runtime
- tasks runtime
- memory runtime
- state runtime
- context runtime

## Repository structure

```text
nexxoria-skill-pack/
  README.md
  SKILL.md
  package.json
  opencode/
    plugin.js
  modules/
  adapted/
  sources/
  templates/
  system/
  install/
  tmp/
```

## Installation

See:

- `install/install.md`
- `install/bootstrap.md`

## Single entrypoint

The package is designed around a single primary entrypoint:

- `SKILL.md` for the system behavior definition

The package runtime entrypoint is:

- `opencode/plugin.js`

## Conversation module

The conversation module is the center of the MVP.

It always enters first, interprets intent, asks clarifying questions when needed, proposes options, guides the user, and decides when control should pass to another internal module.

## Source preservation

Original source skills are preserved under:

- `sources/conversation/using-superpowers/`
- `sources/conversation/brainstorming/`

These are reference sources only, not the direct runtime of Nexxoria.
