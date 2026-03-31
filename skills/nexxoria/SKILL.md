---
name: nexxoria
description: Single-entry Nexxoria system for OpenCode that guides intent through conversation first and routes work into internal modules.
---

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

## Active conversation references

- `adapted/conversation/MODULE.md`
- `adapted/conversation/RULES.md`
- `adapted/conversation/FLOWS.md`

## Installation model

- one package
- one installation
- one primary entrypoint skill

## Current iteration scope

Completed now:

- base package structure
- OpenCode plugin activation
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
