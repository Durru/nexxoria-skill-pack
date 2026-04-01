# State Module

State reflects current project status, active focus, and workflow progression.

State is a routing target when the user wants progress, status, or current focus.

State should also reflect confirmation-aware project progress from `.nexxoria/state/project_state.json`, including `draftConfirmed`, `stagesConfirmed`, and `tasksConfirmed`.

State decides how progress and focus should be represented. Runtime only saves state outputs.

Executable entrypoint: `modules/state/index.js`
