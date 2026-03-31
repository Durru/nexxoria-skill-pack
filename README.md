# Nexxoria Skill Pack

Nexxoria Skill Pack is a Git-installable OpenCode package that activates a single Nexxoria system skill and routes work through internal modules.

## What this package provides

- one dominant OpenCode skill: `nexxoria`
- one plugin-based activation path for Git installs
- one conversation-first system entry
- preserved upstream source skills for reference only
- adapted Nexxoria-owned module documents
- prepared MVP module contracts for future implementation

## Activation model

This repository is designed to be installed by Git and activated through OpenCode's plugin mechanism.

### Primary entrypoints

- human/canonical system definition: `SKILL.md`
- OpenCode-discoverable skill: `skills/nexxoria/SKILL.md`
- OpenCode plugin: `.opencode/plugins/nexxoria.js`

## Quick install by Git

Clone the repo:

```bash
git clone https://github.com/Durru/nexxoria-skill-pack.git
cd nexxoria-skill-pack
```

Run bootstrap:

```bash
./install.sh
```

Restart OpenCode.

Then verify that the skill is available and use `nexxoria` as the installed system skill.

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

- Git-activable OpenCode plugin setup
- canonical system definition
- OpenCode-discoverable Nexxoria skill
- source preservation for conversation logic
- adapted conversation module
- prepared internal module contracts for planning, tasks, memory, state, and context

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
  .opencode/plugins/nexxoria.js
  skills/nexxoria/SKILL.md
  install.sh
  modules/
  adapted/
  sources/
  templates/
  system/
  install/
```

## Conversation module

The conversation module is the center of the MVP.

It always enters first, interprets intent, asks clarifying questions when needed, proposes options, guides the user, and decides when control should pass to another internal module.

## Source preservation

Original source skills are preserved under:

- `sources/conversation/using-superpowers/`
- `sources/conversation/brainstorming/`

These are source references only. Nexxoria runtime behavior belongs to Nexxoria-owned skills and module documents.
