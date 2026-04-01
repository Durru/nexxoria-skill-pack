import type { ProjectContext } from '../../modules/context/index.js';
export interface ContextArtifacts {
    global: string | null;
    conversation: string | null;
    draft: string | null;
    nextStep: string | null;
    routing: string | null;
    decisions: string | null;
    architecture: string | null;
    errors: string | null;
}
export declare const loadContextArtifacts: (projectRoot: string) => ContextArtifacts;
export declare const loadProjectContext: (projectRoot: string) => ProjectContext;
export declare const ensureGlobalContextFile: (projectRoot: string) => ProjectContext;
export declare const saveConversationArtifacts: (projectRoot: string, artifacts: Partial<Record<"global" | "conversation" | "draft" | "nextStep" | "routing", string>>) => void;
