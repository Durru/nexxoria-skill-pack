# Nexxoria Skill Pack

Nexxoria Skill Pack is a Git-installable OpenCode package that activates a single Nexxoria system skill and routes work through internal modules.

## What this package provides

- one dominant OpenCode skill: `nexxoria`
- one plugin-based activation path for Git installs
- one conversation-first system entry
- preserved upstream source skills for reference only
- adapted Nexxoria-owned module documents
- executable internal modules that own product decisions

## Activation model

This repository is designed to be installed by Git and activated through OpenCode's plugin mechanism.

### Primary entrypoints

- human/canonical system definition: `SKILL.md`
- OpenCode-discoverable skill: `skills/nexxoria/SKILL.md`
- OpenCode plugin: `.opencode/plugins/nexxoria.js`
- project bootstrap runtime: `runtime/bootstrap-project.js`

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

This uses the GitHub repository as the default OpenCode plugin source.

For local development only:

```bash
./install.sh local
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

## Current architecture scope

Implemented in this iteration:

- Git-activable OpenCode plugin setup
- canonical system definition
- OpenCode-discoverable Nexxoria skill
- source preservation for conversation logic
- adapted conversation module
- executable conversation, planning, tasks, memory, state, and context modules
- runtime helpers reduced to filesystem, scaffold, repository snapshot, and persistence

## Managed project structure

When Nexxoria starts working in a project that does not yet contain `.nexxoria/`, the conversation module bootstraps:

- project brief
- project state
- project context
- global memory
- stage memory structure
- tag memory structure
- stages index
- tasks index
- decision, error, change, and architecture logs

This bootstrap-created structure is the project container Nexxoria needs before deeper routing and persistence can happen.

## Bootstrap scaffolding vs confirmed structure

Nexxoria creates minimal stage and task scaffolding during bootstrap so the project has a working structure.

That scaffolding does not automatically mean the project has confirmed stages or confirmed tasks.

Confirmed project structure is tracked in `.nexxoria/state/project_state.json` using:

- `draftConfirmed`
- `stagesConfirmed`
- `tasksConfirmed`

Conversation and routing should use those confirmation flags when deciding whether the project should remain in conversation, move into planning, or move into tasks.

Architecture rule:

- modules decide
- runtime executes

See `docs/architecture-rules.md` for the canonical rule.

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

This is now implemented as executable code in `modules/conversation/index.js`.

## Source preservation

Original source skills are preserved under:

- `sources/conversation/using-superpowers/`
- `sources/conversation/brainstorming/`

These are source references only. Nexxoria runtime behavior belongs to Nexxoria-owned skills and module documents.

## Runtime bootstrap

The repository now includes a real bootstrap runtime at `runtime/bootstrap-project.js`.

It creates the `.nexxoria/` project structure with:

- global context
- global memory
- stage-1 memory
- stage-1 task scaffolding
- project state

The runtime is intentionally mechanical. It must not interpret product intent or decide flow. Decision logic belongs to the modules.

## Automatic onboarding behavior

For new projects, Nexxoria bootstraps `.nexxoria/`, initializes memory, and starts guided conversation.

For existing repositories, Nexxoria creates or repairs `.nexxoria/`, reads a repository snapshot, lets the conversation module interpret that snapshot, writes initial global memory, and then asks only the questions that remain unresolved.

## Persisted conversation artifacts

After bootstrap or repair establishes the `.nexxoria/` structure, the conversation flow persists conversation-specific artifacts into:

- `.nexxoria/context/conversation.md`
- `.nexxoria/context/draft.md`
- `.nexxoria/context/next-step.md`

These files are not the full bootstrap structure. They are conversation artifacts that capture the current synthesized understanding, the current draft when available, and the current recommended next step.

This persistence allows future sessions to continue from structured conversation context instead of restarting from scratch.

## Intelligent routing

Nexxoria reads persisted conversation artifacts and routing signals to decide whether the next step belongs to conversation, planning, tasks, memory, or state.

It persists the routing decision in:

- `.nexxoria/context/routing.md`

Routing is decided by `modules/conversation/index.js`, not by the runtime.
