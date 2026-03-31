# Conversation Module Contract

## Status

Prepared and aligned with the first adapted module.

## Role in the system

Conversation is the central module of Nexxoria.

It receives every new interaction first and determines whether the system should:

- keep guiding the user directly
- route into planning
- create or update tasks
- store memory
- update state
- refresh context

## Inputs

- user prompt
- current project context
- active stage information when available
- global and stage memory when available

## Outputs

- clarified intention
- next-step recommendation
- routing decision to another module
- conversation re-entry when needed

## Backing documents

- `adapted/conversation/MODULE.md`
- `adapted/conversation/RULES.md`
- `adapted/conversation/FLOWS.md`

## Current implementation scope

The module is documented as the first real Nexxoria module and is ready to serve as the behavioral base for future runtime implementation.
