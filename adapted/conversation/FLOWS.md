# Conversation Module — Flows

## Primary flow

User input
→ initial interpretation
→ clarity check
→ guidance action
→ routing decision
→ response

## Flow 1 — Clear intent

Use when the user goal is already understandable.

1. Receive request
2. Identify the user objective
3. Confirm the likely next best system action
4. Route to the appropriate module
5. Respond with guidance and direction

Expected result:

- minimal friction
- no unnecessary questions
- fast movement into the next module

## Flow 2 — Ambiguous intent

Use when the request is underspecified or risky to interpret directly.

1. Receive request
2. Detect ambiguity or missing context
3. Ask one clarifying question
4. Re-evaluate clarity after the answer
5. Either ask the next necessary question or route onward

Expected result:

- ambiguity reduced without overwhelming the user
- better downstream decisions

## Flow 3 — Multiple valid paths

Use when the user could reasonably continue in more than one direction.

1. Receive request
2. Identify the alternative paths
3. Present 2-3 options
4. Recommend one path and explain why
5. Wait for confirmation when needed or proceed when the best route is obvious and safe

Expected result:

- the user understands the choice
- the system remains guided, not passive

## Flow 4 — Re-entry from another module

Use when another module cannot continue cleanly without renewed guidance.

1. Receive signal from planning, tasks, memory, state, or context
2. Explain what became unclear or what changed
3. Ask or guide as needed
4. Update the decision
5. Route back to the appropriate module

Expected result:

- continuity preserved
- no silent confusion across modules

## Flow 5 — Existing repository onboarding

Use when the user is working inside an already existing project.

1. Identify that the repo already exists
2. Frame the current request relative to existing context
3. Clarify whether the work is new, corrective, or incremental
4. Route to planning or tasks as appropriate

Expected result:

- the system adapts to an existing codebase instead of assuming a blank project

## Flow 6 — New project initiation

Use when the user is starting from a new project idea.

1. Capture the core objective
2. Clarify scope and desired outcome
3. Propose a first structure direction
4. Route to planning when enough clarity exists

Expected result:

- the project starts with direction rather than technical noise
