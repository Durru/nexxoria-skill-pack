import { ensureDir, exists, readFile, writeFile } from '../../runtime/fs/index.js';
import { getArchitectureFilePath, getArchitectureTemplatePath, getContextPath, getDecisionsFilePath, getDecisionsTemplatePath, getErrorsFilePath, getErrorsTemplatePath, getGlobalContextFilePath, getGlobalContextTemplatePath, getLogsPath, getMemoryPath, getNexxoriaRoot, getProjectRoot, getProjectStateFilePath, getProjectStateTemplatePath, getStagesPath, getStatePath, } from '../../runtime/paths/index.js';
const ensureBaseDirectories = (projectRoot) => {
    ensureDir(getNexxoriaRoot(projectRoot));
    ensureDir(getContextPath(projectRoot));
    ensureDir(getMemoryPath(projectRoot));
    ensureDir(getStagesPath(projectRoot));
    ensureDir(getStatePath(projectRoot));
    ensureDir(getLogsPath(projectRoot));
};
const ensureFileFromTemplate = (targetFilePath, templateFilePath) => {
    if (exists(targetFilePath))
        return false;
    writeFile(targetFilePath, readFile(templateFilePath));
    return true;
};
export const bootstrapProject = (projectRoot) => {
    const resolvedProjectRoot = getProjectRoot(projectRoot);
    const nexxoriaRoot = getNexxoriaRoot(resolvedProjectRoot);
    const alreadyExists = exists(nexxoriaRoot);
    ensureBaseDirectories(resolvedProjectRoot);
    const createdFiles = [
        ensureFileFromTemplate(getGlobalContextFilePath(resolvedProjectRoot), getGlobalContextTemplatePath()),
        ensureFileFromTemplate(getProjectStateFilePath(resolvedProjectRoot), getProjectStateTemplatePath()),
        ensureFileFromTemplate(getDecisionsFilePath(resolvedProjectRoot), getDecisionsTemplatePath()),
        ensureFileFromTemplate(getErrorsFilePath(resolvedProjectRoot), getErrorsTemplatePath()),
        ensureFileFromTemplate(getArchitectureFilePath(resolvedProjectRoot), getArchitectureTemplatePath()),
    ];
    return {
        projectRoot: resolvedProjectRoot,
        nexxoriaRoot,
        created: !alreadyExists,
        repaired: alreadyExists && createdFiles.some(Boolean),
    };
};
