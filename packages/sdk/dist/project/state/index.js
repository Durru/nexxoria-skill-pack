import { readJsonIfExists, writeJsonFile } from '../../runtime/json/index.js';
import { getProjectStateFilePath } from '../../runtime/paths/index.js';
import { getDefaultProjectState, ensureProjectState } from '../../modules/state/index.js';
export const loadProjectState = (projectRoot) => {
    const state = readJsonIfExists(getProjectStateFilePath(projectRoot), getDefaultProjectState());
    return ensureProjectState(state);
};
export const saveProjectState = (projectRoot, nextState) => {
    writeJsonFile(getProjectStateFilePath(projectRoot), nextState);
};
export const ensureProjectStateFile = (projectRoot) => {
    const state = loadProjectState(projectRoot);
    saveProjectState(projectRoot, state);
    return state;
};
