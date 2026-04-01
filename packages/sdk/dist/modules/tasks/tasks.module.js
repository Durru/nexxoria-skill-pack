export const getInitialTaskItems = (projectRoot, stageId) => [
    {
        id: 'task-1',
        title: 'Define first task scope',
        goal: 'Clarify the first concrete piece of work inside the current stage.',
        status: 'active',
        path: `${projectRoot}/.nexxoria/stages/${stageId}/tasks/task-1/TASK.md`,
    },
];
export const ensureTasksResult = (currentStage, items) => ({
    current_stage: currentStage,
    items,
});
export const createTasksMemoryEvents = (createdInitialTask) => ({
    decisions: createdInitialTask ? ['Initialized first task inside the active stage: task-1.'] : [],
});
