export const getInitialPlanningStages = (projectRoot) => [
    {
        id: 'stage-1',
        title: 'Define project scope',
        goal: 'Clarify what this project needs to achieve first.',
        status: 'active',
        path: `${projectRoot}/.nexxoria/stages/stage-1/STAGE.md`,
    },
];
export const ensurePlanningResult = (stages) => ({
    stages,
});
export const createPlanningMemoryEvents = (createdInitialStage) => ({
    decisions: createdInitialStage ? ['Initialized first planning stage: stage-1.'] : [],
});
