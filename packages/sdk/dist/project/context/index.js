import { readTextIfExists, writeTextFile } from '../../runtime/fs/index.js';
import { getConversationContextFilePath, getDraftFilePath, getGlobalArchitectureFilePath, getGlobalContextFilePath, getGlobalDecisionsFilePath, getGlobalErrorsFilePath, getNextStepFilePath, getRoutingFilePath, } from '../../runtime/paths/index.js';
import { ensureProjectContext } from '../../modules/context/index.js';
export const loadContextArtifacts = (projectRoot) => ({
    global: readTextIfExists(getGlobalContextFilePath(projectRoot)),
    conversation: readTextIfExists(getConversationContextFilePath(projectRoot)),
    draft: readTextIfExists(getDraftFilePath(projectRoot)),
    nextStep: readTextIfExists(getNextStepFilePath(projectRoot)),
    routing: readTextIfExists(getRoutingFilePath(projectRoot)),
    decisions: readTextIfExists(getGlobalDecisionsFilePath(projectRoot)),
    architecture: readTextIfExists(getGlobalArchitectureFilePath(projectRoot)),
    errors: readTextIfExists(getGlobalErrorsFilePath(projectRoot)),
});
export const loadProjectContext = (projectRoot) => {
    return ensureProjectContext(readTextIfExists(getGlobalContextFilePath(projectRoot)));
};
export const ensureGlobalContextFile = (projectRoot) => {
    const context = loadProjectContext(projectRoot);
    writeTextFile(getGlobalContextFilePath(projectRoot), context.global);
    return context;
};
export const saveConversationArtifacts = (projectRoot, artifacts) => {
    if (artifacts.global !== undefined)
        writeTextFile(getGlobalContextFilePath(projectRoot), artifacts.global);
    if (artifacts.conversation !== undefined)
        writeTextFile(getConversationContextFilePath(projectRoot), artifacts.conversation);
    if (artifacts.draft !== undefined)
        writeTextFile(getDraftFilePath(projectRoot), artifacts.draft);
    if (artifacts.nextStep !== undefined)
        writeTextFile(getNextStepFilePath(projectRoot), artifacts.nextStep);
    if (artifacts.routing !== undefined)
        writeTextFile(getRoutingFilePath(projectRoot), artifacts.routing);
};
