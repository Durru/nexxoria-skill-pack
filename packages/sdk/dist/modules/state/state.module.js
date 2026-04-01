const resolveNextStep = ({ currentStageId, hasTasks, }) => {
    if (!currentStageId)
        return 'define_project_scope';
    if (!hasTasks)
        return 'define_stage_scope';
    return 'define_task_scope';
};
const defaultState = {
    current_stage: null,
    progress: 0,
    next_step: 'define_project_scope',
    project_type: null,
};
export const getDefaultProjectState = () => ({ ...defaultState });
export const ensureProjectState = (state) => {
    return {
        ...defaultState,
        ...(state ?? {}),
    };
};
export const deriveProjectState = ({ state, currentStageId, hasTasks }) => {
    const ensuredState = ensureProjectState(state);
    const derivedState = {
        ...ensuredState,
        current_stage: ensuredState.current_stage ?? currentStageId,
        next_step: resolveNextStep({
            currentStageId: ensuredState.current_stage ?? currentStageId,
            hasTasks,
        }),
    };
    return {
        state: derivedState,
        memoryEvents: {
            architecture: [
                'Consolidated official SDK state shape: current_stage, progress, next_step, project_type.',
            ],
        },
    };
};
export { resolveNextStep };
