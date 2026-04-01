import type { ProjectState } from '../../modules/state/index.js';
export declare const loadProjectState: (projectRoot: string) => ProjectState;
export declare const saveProjectState: (projectRoot: string, nextState: ProjectState) => void;
export declare const ensureProjectStateFile: (projectRoot: string) => ProjectState;
