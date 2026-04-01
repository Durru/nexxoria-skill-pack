# Tasks Module

Tasks track intention-based units of work and their progression.

Tasks is a routing target when stages are confirmed or when the user explicitly asks to create or update work items.

Bootstrap-created task files are scaffolding only. Tasks should become the default routing target after `.nexxoria/state/project_state.json` records `stagesConfirmed: true` while `tasksConfirmed` is still false.
