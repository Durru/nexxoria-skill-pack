import { ProjectNextStep, ProjectState, StateDerivationResult, StateFlowInput } from './state.types.js';
declare const resolveNextStep: ({ currentStageId, hasTasks, }: {
    currentStageId: string | null;
    hasTasks: boolean;
}) => ProjectNextStep;
export declare const getDefaultProjectState: () => ProjectState;
export declare const ensureProjectState: (state: Partial<ProjectState> | null | undefined) => ProjectState;
export declare const deriveProjectState: ({ state, currentStageId, hasTasks }: StateFlowInput) => StateDerivationResult;
export { resolveNextStep };
