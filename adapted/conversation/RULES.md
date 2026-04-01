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

## Bootstrap rules

- If `.nexxoria/` is missing, bootstrap it before deeper project orchestration.
- Bootstrap must not block guidance.
- Bootstrap creates or repairs project structure; it is not the same thing as persisting conversation artifacts.

## Confirmation rules

- Bootstrap-created stage and task files are scaffolding, not proof of confirmation.
- Use `.nexxoria/state/project_state.json` confirmation flags to decide whether routing can move from conversation to planning or tasks.
- `draftConfirmed` gates routing from conversation toward planning.
- `stagesConfirmed` gates routing from planning toward tasks.
- `tasksConfirmed` reflects whether task structure is confirmed rather than merely scaffolded.

## Intention detection rules

- Distinguish at minimum: new project, continue project, create task, doubt, change.

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
- Use workflow selection discipline before acting.
- Prefer question-driven clarification before premature structure.
- Use draft-first guidance for underdefined project requests.

## New project question order

When the user is starting a new project, ask in this order when needed:
1. objective
2. project name
3. references or inspiration
4. initial stages

## Context usage rules

- Do not ask for facts already inferred by onboarding or stored in global memory.
- Prefer summarizing what Nexxoria already knows before asking follow-up questions.
- Ask only the questions that remain unresolved.
- If enough context exists, generate a draft before asking more.

## Persistence rules

- Persist conversation artifacts after onboarding-aware analysis and before later routing depends on them.
- Persist synthesized conversation context in `.nexxoria/context/conversation.md`.
- Persist the current draft in `.nexxoria/context/draft.md` when enough context exists to generate one.
- Persist the current recommended next step in `.nexxoria/context/next-step.md`.
- Treat these files as conversation artifacts, not as replacements for the broader bootstrap-created `.nexxoria/` structure.

## Option rules

- Present options when there is more than one valid path.
- Recommend one option explicitly.
- State the tradeoff in simple language.
- Avoid false choice where the best path is obvious and low risk.

## Routing rules

- If unresolved questions exist, stay in conversation.
- If a draft exists but `draftConfirmed` is false, stay in conversation until the draft is confirmed.
- If `draftConfirmed` is true and `stagesConfirmed` is false, route toward planning.
- If `stagesConfirmed` is true and `tasksConfirmed` is false, route toward tasks.
- If the user asks for progress, route toward state.
- If the prompt is about decisions, errors, or architecture, route toward memory.

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
