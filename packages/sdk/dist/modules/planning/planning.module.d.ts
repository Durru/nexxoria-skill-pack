import { PlanningResult, PlanningStage } from './planning.types.js';
export declare const getInitialPlanningStages: (projectRoot: string) => PlanningStage[];
export declare const ensurePlanningResult: (stages: PlanningStage[]) => PlanningResult;
export declare const createPlanningMemoryEvents: (createdInitialStage: boolean) => {
    decisions: string[];
};
