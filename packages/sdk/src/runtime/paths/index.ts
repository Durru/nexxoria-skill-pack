import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sdkRoot = path.resolve(__dirname, '../..')

const NEXXORIA_DIRNAME = '.nexxoria'
const CONTEXT_DIRNAME = 'context'
const MEMORY_DIRNAME = 'memory'
const STAGES_DIRNAME = 'stages'
const STATE_DIRNAME = 'state'
const LOGS_DIRNAME = 'logs'
const GLOBAL_DIRNAME = 'global'
const STAGE_MEMORY_DIRNAME = 'stages'
const TAGS_DIRNAME = 'tags'
const TASKS_DIRNAME = 'tasks'

const GLOBAL_CONTEXT_FILENAME = 'global.md'
const CONVERSATION_FILENAME = 'conversation.md'
const DRAFT_FILENAME = 'draft.md'
const NEXT_STEP_FILENAME = 'next-step.md'
const ROUTING_FILENAME = 'routing.md'
const DECISIONS_FILENAME = 'decisions.md'
const ERRORS_FILENAME = 'errors.md'
const ARCHITECTURE_FILENAME = 'architecture.md'
const PROJECT_STATE_FILENAME = 'project_state.json'
const STAGE_FILENAME = 'STAGE.md'
const TASK_FILENAME = 'TASK.md'
const STAGE_MEMORY_FILENAME = 'memory.md'
const TASK_TEMPLATE_FILENAME = 'task.md'

const templatesRoot = path.join(sdkRoot, 'templates')

export const resolveProjectRoot = (projectRoot?: string): string => path.resolve(projectRoot ?? process.cwd())
export const getProjectRoot = (projectRoot?: string): string => resolveProjectRoot(projectRoot)
export const getNexxoriaRoot = (projectRoot: string): string => path.join(getProjectRoot(projectRoot), NEXXORIA_DIRNAME)
export const getContextPath = (projectRoot: string): string => path.join(getNexxoriaRoot(projectRoot), CONTEXT_DIRNAME)
export const getMemoryPath = (projectRoot: string): string => path.join(getNexxoriaRoot(projectRoot), MEMORY_DIRNAME)
export const getStagesPath = (projectRoot: string): string => path.join(getNexxoriaRoot(projectRoot), STAGES_DIRNAME)
export const getStatePath = (projectRoot: string): string => path.join(getNexxoriaRoot(projectRoot), STATE_DIRNAME)
export const getLogsPath = (projectRoot: string): string => path.join(getNexxoriaRoot(projectRoot), LOGS_DIRNAME)

export const getGlobalMemoryDirectoryPath = (projectRoot: string): string => path.join(getMemoryPath(projectRoot), GLOBAL_DIRNAME)
export const getStageMemoryDirectoryPath = (projectRoot: string): string => path.join(getMemoryPath(projectRoot), STAGE_MEMORY_DIRNAME)
export const getTagsMemoryDirectoryPath = (projectRoot: string): string => path.join(getMemoryPath(projectRoot), TAGS_DIRNAME)
export const getStageDirectoryPath = (projectRoot: string, stageId: string): string => path.join(getStagesPath(projectRoot), stageId)
export const getStageTasksDirectoryPath = (projectRoot: string, stageId: string): string => path.join(getStageDirectoryPath(projectRoot, stageId), TASKS_DIRNAME)
export const getTaskDirectoryPath = (projectRoot: string, stageId: string, taskId: string): string => path.join(getStageTasksDirectoryPath(projectRoot, stageId), taskId)

export const getGlobalContextFilePath = (projectRoot: string): string => path.join(getContextPath(projectRoot), GLOBAL_CONTEXT_FILENAME)
export const getConversationContextFilePath = (projectRoot: string): string => path.join(getContextPath(projectRoot), CONVERSATION_FILENAME)
export const getDraftFilePath = (projectRoot: string): string => path.join(getContextPath(projectRoot), DRAFT_FILENAME)
export const getNextStepFilePath = (projectRoot: string): string => path.join(getContextPath(projectRoot), NEXT_STEP_FILENAME)
export const getRoutingFilePath = (projectRoot: string): string => path.join(getContextPath(projectRoot), ROUTING_FILENAME)
export const getDecisionsFilePath = (projectRoot: string): string => path.join(getMemoryPath(projectRoot), DECISIONS_FILENAME)
export const getErrorsFilePath = (projectRoot: string): string => path.join(getMemoryPath(projectRoot), ERRORS_FILENAME)
export const getArchitectureFilePath = (projectRoot: string): string => path.join(getMemoryPath(projectRoot), ARCHITECTURE_FILENAME)
export const getGlobalDecisionsFilePath = (projectRoot: string): string => path.join(getGlobalMemoryDirectoryPath(projectRoot), DECISIONS_FILENAME)
export const getGlobalErrorsFilePath = (projectRoot: string): string => path.join(getGlobalMemoryDirectoryPath(projectRoot), ERRORS_FILENAME)
export const getGlobalArchitectureFilePath = (projectRoot: string): string => path.join(getGlobalMemoryDirectoryPath(projectRoot), ARCHITECTURE_FILENAME)
export const getProjectStateFilePath = (projectRoot: string): string => path.join(getStatePath(projectRoot), PROJECT_STATE_FILENAME)
export const getStageFilePath = (projectRoot: string, stageId: string): string => path.join(getStageDirectoryPath(projectRoot, stageId), STAGE_FILENAME)
export const getTaskFilePath = (projectRoot: string, stageId: string, taskId: string): string => path.join(getTaskDirectoryPath(projectRoot, stageId, taskId), TASK_FILENAME)
export const getStageMemoryFilePath = (projectRoot: string, stageId: string): string => path.join(getStageMemoryDirectoryPath(projectRoot), stageId, STAGE_MEMORY_FILENAME)

export const getTemplatesRoot = (): string => templatesRoot
export const getGlobalContextTemplatePath = (): string => path.join(templatesRoot, 'context', GLOBAL_CONTEXT_FILENAME)
export const getDecisionsTemplatePath = (): string => path.join(templatesRoot, 'memory', DECISIONS_FILENAME)
export const getErrorsTemplatePath = (): string => path.join(templatesRoot, 'memory', ERRORS_FILENAME)
export const getArchitectureTemplatePath = (): string => path.join(templatesRoot, 'memory', ARCHITECTURE_FILENAME)
export const getProjectStateTemplatePath = (): string => path.join(templatesRoot, 'state', PROJECT_STATE_FILENAME)
export const getSystemTemplatesRoot = (): string => path.join(templatesRoot, 'system')
export const getConversationTemplatePath = (): string => path.join(getSystemTemplatesRoot(), 'context', CONVERSATION_FILENAME)
export const getDraftTemplatePath = (): string => path.join(getSystemTemplatesRoot(), 'context', DRAFT_FILENAME)
export const getNextStepTemplatePath = (): string => path.join(getSystemTemplatesRoot(), 'context', NEXT_STEP_FILENAME)
export const getRoutingTemplatePath = (): string => path.join(getSystemTemplatesRoot(), 'context', ROUTING_FILENAME)
export const getTasksTemplatePath = (): string => path.join(templatesRoot, 'tasks', TASK_TEMPLATE_FILENAME)
