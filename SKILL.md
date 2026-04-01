# Nexxoria Skill Pack — Core System

## Purpose

This package transforms any project into a structured, guided Nexxoria-style system using internal modules instead of directly exposing external source skills as runtime behavior.

The system is designed to install once, enter through a single point, and guide the user continuously without requiring manual architecture work.

## Core behavior

1. Always enter through conversation first.
2. Understand user intent before structuring work.
3. Ask when clarity is insufficient.
4. Propose options when multiple valid paths exist.
5. Convert clarified intent into stages, tasks, memory, state, and context updates as needed.
6. Keep the user guided at every step.
7. Re-enter conversation whenever the system needs renewed guidance.

## Official MVP modules

- Conversation
- Planning
- Tasks
- Memory
- State
- Context

## Central module

Conversation is the center of the system.

It must:

- enter first
- interpret intention
- ask questions
- propose options
- explain why
- guide the next step
- decide the initial flow
- re-enter when the system needs guidance again

## System rules

- The user never structures manually.
- The system organizes automatically.
- Stages are functional, not technical.
- Stages are created only when justified.
- A task represents intention, not technical size.
- Global memory must always exist.
- Stage-level memory must also exist.
- The system stores decisions, errors, architecture, and relevant changes.
- The system must work for both new projects and existing repositories.

## Internal flow

User prompt → Conversation → Decision → Planning / Tasks / Memory / State / Context → Response

## Source logic policy

External skills are used as source logic only.

They are preserved under `sources/` and adapted into Nexxoria-owned behavior under `adapted/` and `modules/`.

## Automatic project bootstrap

If `.nexxoria/` does not exist in the current project, the conversation module must bootstrap it automatically using Nexxoria templates before deeper routing continues.

Bootstrap creates or repairs the broader `.nexxoria/` project structure. It is separate from conversation artifact persistence.

Bootstrap scaffolding is not equivalent to confirmed structure. Confirmed structure is tracked in `.nexxoria/state/project_state.json` through `draftConfirmed`, `stagesConfirmed`, and `tasksConfirmed`.

## Conversation runtime responsibilities

Conversation must:

- detect intention types such as new project, continuation, task work, doubt, and change
- detect missing `.nexxoria/` structure
- trigger bootstrap automatically
- repair missing `.nexxoria/` parts automatically when the structure is incomplete
- analyze existing repositories heuristically before deeper guidance
- fill global memory with an initial summary, visible structure, architecture signals, inferred decisions, and pending questions
- use onboarding analysis and global memory actively
- avoid redundant questions
- persist synthesized conversation context in `.nexxoria/context/conversation.md`
- generate drafts automatically when enough context exists
- persist the current draft artifact in `.nexxoria/context/draft.md` when available
- summarize existing repositories before asking what remains unresolved
- ask questions in guided order
- produce a first draft for new projects
- persist the current recommended next step in `.nexxoria/context/next-step.md`
- routing is decided from persisted artifacts and current prompt context
- use confirmation flags from `.nexxoria/state/project_state.json` when deciding whether routing can move from conversation to planning or tasks
- the decision is persisted in `.nexxoria/context/routing.md`
- conversation remains the control center even when another module becomes the next target
- route to planning, tasks, memory, state, context, or errors
- re-enter whenever guidance is needed again

These persisted files are conversation artifacts inside `.nexxoria/context/`. They do not replace the wider bootstrap-created `.nexxoria/` structure.

The runtime helper for project initialization lives at `runtime/bootstrap-project.js`.

## Active conversation references

- `adapted/conversation/MODULE.md`
- `adapted/conversation/RULES.md`
- `adapted/conversation/FLOWS.md`

## Installation model

- one package
- one installation
- one primary entrypoint

## Current iteration scope

Completed now:

- base package structure
- installation scaffolding
- preserved conversation source skills
- adapted conversation module
- prepared contracts for the remaining modules

Not fully implemented yet:

- planning runtime
- tasks runtime
- memory runtime
- state runtime
- context runtime

## Goal

Help the user build anything step by step with structure, continuity, and clarity, while keeping the package simple enough to install once and extend module by module.
