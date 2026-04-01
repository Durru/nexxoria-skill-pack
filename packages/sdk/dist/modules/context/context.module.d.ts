import { ProjectContext } from './context.types.js';
export declare const getDefaultProjectContext: () => ProjectContext;
export declare const ensureProjectContext: (globalContext: string | null | undefined) => ProjectContext;
