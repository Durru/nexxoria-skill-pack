# Planning Module

Planning turns clarified intent into stage-based execution when staged structure is justified.

Planning is a routing target when Nexxoria has a confirmed draft and needs to define or confirm stages.

Bootstrap-created stage files are not enough on their own. Planning should be entered after `.nexxoria/state/project_state.json` records `draftConfirmed: true` and before `stagesConfirmed` becomes true.

Planning decides stage structure. Runtime only materializes files and folders from that decision.

Executable entrypoint: `modules/planning/index.js`
