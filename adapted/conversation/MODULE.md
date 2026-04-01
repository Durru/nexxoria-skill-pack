# Conversation Module

## Purpose

The conversation module is the operational center of the Nexxoria system.

Its job is to receive the user first, understand what they actually want, reduce ambiguity, and guide the next system decision without forcing the user to structure work manually.

## Why this module is central

Every other module depends on the quality of the initial understanding.

If conversation is weak:

- planning becomes premature
- tasks become noisy
- memory stores the wrong things
- context drifts
- state becomes misleading

If conversation is strong:

- planning starts from real intent
- tasks reflect meaningful goals
- memory captures relevant decisions
- context stays coherent
- the user feels guided instead of abandoned

## Responsibilities

- enter first in every new interaction
- interpret user intent
- detect ambiguity and missing information
- detect whether `.nexxoria/` exists in the current project
- bootstrap `.nexxoria/` automatically when missing
- ask clarifying questions when required
- propose options when multiple valid paths exist
- create initial project drafts for new work
- explain the reason behind guidance
- decide whether to continue in conversation or derive to another module
- re-enter when another module needs user-facing guidance again
- initialize project memory, state, stages, tasks, and logs through the bootstrap structure
- persist conversation artifacts after synthesis so guidance survives across sessions
- distinguish bootstrap scaffolding from user-confirmed project structure before routing aggressively into planning or tasks

## Core operating model

The conversation module does not exist to chat for the sake of chatting.

It exists to convert unclear intent into actionable direction.

This module absorbs orchestration discipline from `using-superpowers` and clarification-plus-draft guidance from `brainstorming`, but exposes them as Nexxoria-owned behavior.

Conversation must actively use onboarding results and global memory instead of treating each session like a blank start.

Conversation must treat bootstrap-created stage and task files as scaffolding only. Confirmation-aware routing depends on `.nexxoria/state/project_state.json`, where `draftConfirmed`, `stagesConfirmed`, and `tasksConfirmed` define whether the project can move from conversation into planning or tasks.

The module therefore works in five sequential responsibilities:

1. receive the prompt
2. classify the intention
3. measure clarity
4. guide the user through the next best step
5. decide the next module handoff or stay in conversation

## Input

- raw user request
- current project context when available
- existing memory and prior decisions when available
- current stage or active work status when available

## Output

One of these outcomes:

- clarified intent
- a set of options with recommendation
- a decision to route into planning
- a decision to route into tasks
- a decision to record memory-relevant information
- a decision to update state/context
- a decision to remain in conversation and keep guiding

The conversation module uses two different persistence layers:

- bootstrap structure, which creates or repairs the wider `.nexxoria/` project container
- conversation artifacts, which persist the current conversational synthesis inside that structure

Conversation artifacts must be persisted into `.nexxoria/context/` using:

- `.nexxoria/context/conversation.md`
- `.nexxoria/context/draft.md`
- `.nexxoria/context/next-step.md`

These artifacts represent:

- `conversation.md`: the current synthesized understanding of intent, known facts, and unresolved questions
- `draft.md`: the current conversation draft when enough context exists to generate one
- `next-step.md`: the current recommended next step for routing or continued guidance

Conversation uses persisted next-step and routing artifacts to decide the next system move instead of responding generically.

## Relationship with the other modules

### Planning
Conversation sends work to planning once the system understands the user's objective well enough to shape structured execution and `draftConfirmed` is true.

### Tasks
Conversation sends work to tasks when a concrete unit of intention should be tracked or progressed and `stagesConfirmed` is true while `tasksConfirmed` is still false.

### Memory
Conversation identifies important decisions, constraints, failures, or changes that must persist.

### State
Conversation helps determine what phase or operational status the project is currently in, including whether `draftConfirmed`, `stagesConfirmed`, and `tasksConfirmed` have advanced.

### Context
Conversation provides the narrative layer that keeps the current work connected to the broader project situation, including the persisted conversation artifacts that later sessions can reuse.

## Re-entry rule

Conversation is not just the start of the flow.

It can re-enter at any point when:

- the system detects ambiguity
- the user changes direction
- multiple paths become possible
- a module needs user clarification
- a decision should be explained before proceeding

## MVP boundary

In this iteration, the conversation module is defined as the first real module of the Nexxoria system.

Its behavior is specified and documented so it can act as the architectural base for future runtime implementation.
