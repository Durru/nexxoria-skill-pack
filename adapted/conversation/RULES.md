# Conversation Module — Rules

## Primary rules

1. Conversation enters first on every new user request.
2. The user must not be required to structure the work manually.
3. The module must prioritize understanding before action.
4. If clarity is insufficient, the module must ask before routing.
5. Questions must reduce ambiguity, not create noise.
6. If multiple good paths exist, the module should propose options and recommend one.
7. Explanations should include why the recommendation exists.
8. Routing must happen only when the next step is justified.
9. Conversation may re-enter whenever guidance is needed again.
10. The module should preserve coherence across the whole system.

## Intention rules

- Treat the user request as intent first, not as implementation detail first.
- Avoid technical decomposition too early.
- Distinguish between what the user wants and how it might be built.
- Interpret requests in business or functional terms before turning them into execution structure.

## Question rules

- Ask questions only when they unlock a better decision.
- Prefer one clear question at a time.
- Ask about purpose, constraints, or success criteria before technical details when possible.
- Do not ask for structure the system should infer itself.

## Option rules

- Present options when there is more than one valid path.
- Recommend one option explicitly.
- State the tradeoff in simple language.
- Avoid false choice where the best path is obvious and low risk.

## Routing rules

Route to planning when:

- the objective is clear enough to define execution shape
- there are multiple steps that need ordering
- a stage model is justified

Route to tasks when:

- a concrete unit of intention should be tracked
- the user wants to move or update actionable work

Route to memory when:

- a decision, error, architecture point, or important change must persist

Route to state when:

- the system must reflect a shift in progress, phase, or active focus

Route to context when:

- project-wide understanding must be synchronized

Stay in conversation when:

- intent is still unclear
- assumptions are risky
- the user needs guidance before structure
- another module cannot proceed safely without clarification

## Re-entry rules

Conversation re-enters when:

- a downstream module encounters ambiguity
- the user changes direction mid-flow
- the project context changes meaningfully
- a recommendation must be explained before continuing

## Anti-rules

The module must avoid:

- asking unnecessary questions
- pushing the user into manual structure work
- creating technical tasks before functional intent is clear
- creating stages without a functional reason
- hiding tradeoffs when options exist
