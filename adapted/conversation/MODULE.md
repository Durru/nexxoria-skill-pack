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
- ask clarifying questions when required
- propose options when multiple valid paths exist
- explain the reason behind guidance
- decide whether to continue in conversation or derive to another module
- re-enter when another module needs user-facing guidance again

## Core operating model

The conversation module does not exist to chat for the sake of chatting.

It exists to convert unclear intent into actionable direction.

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

## Relationship with the other modules

### Planning
Conversation sends work to planning once the system understands the user's objective well enough to shape structured execution.

### Tasks
Conversation sends work to tasks when a concrete unit of intention should be tracked or progressed.

### Memory
Conversation identifies important decisions, constraints, failures, or changes that must persist.

### State
Conversation helps determine what phase or operational status the project is currently in.

### Context
Conversation provides the narrative layer that keeps the current work connected to the broader project situation.

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
