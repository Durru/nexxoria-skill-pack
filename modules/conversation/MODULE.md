# Conversation Module

Conversation is the operating center of Nexxoria.

It always enters first, interprets intention, detects whether project structure exists, triggers bootstrap when needed through runtime executors, generates drafts, persists conversation artifacts through runtime persistence, and routes to the appropriate internal module.

Bootstrap-created stage and task files are scaffolding only. Conversation owns the confirmation-aware routing decision and must use `.nexxoria/state/project_state.json` to distinguish scaffolding from confirmed structure through `draftConfirmed`, `stagesConfirmed`, and `tasksConfirmed`.

The module consumes onboarding output, global memory, and synthesized conversation context to avoid redundant questioning, generate drafts when enough information is already available, and keep routing decisions grounded in known project context.

Bootstrap and conversation persistence are different responsibilities.

Bootstrap creates or repairs the broader `.nexxoria/` structure required for Nexxoria to operate.

Conversation persistence writes conversation-specific artifacts into that structure:

- `.nexxoria/context/conversation.md` for synthesized understanding, known facts, and unresolved questions
- `.nexxoria/context/draft.md` for the current draft when one is available
- `.nexxoria/context/next-step.md` for the current recommended next step

Routing is decided from persisted artifacts and current prompt context, and the decision is persisted in `.nexxoria/context/routing.md`.

Conversation should route toward planning after `draftConfirmed` is true, route toward tasks after `stagesConfirmed` is true and `tasksConfirmed` is false, and otherwise keep the user in conversation when structure is still unconfirmed.

Conversation remains the control center even when another module becomes the next target.

The module should stay in conversation when intent is still unclear, route only when the next step is justified, and keep these persisted artifacts aligned with the latest synthesized conversation state.

Executable entrypoint: `modules/conversation/index.js`
