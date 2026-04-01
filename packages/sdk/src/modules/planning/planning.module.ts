import { PlanningResult, PlanningStage } from './planning.types.js'

export const getInitialPlanningStages = (projectRoot: string): PlanningStage[] => [
  {
    id: 'stage-1',
    title: 'Define project scope',
    goal: 'Clarify what this project needs to achieve first.',
    status: 'active',
    path: `${projectRoot}/.nexxoria/stages/stage-1/STAGE.md`,
  },
]

export const ensurePlanningResult = (stages: PlanningStage[]): PlanningResult => ({
  stages,
})

export const createPlanningMemoryEvents = (createdInitialStage: boolean) => ({
  decisions: createdInitialStage ? ['Initialized first planning stage: stage-1.'] : [],
})
