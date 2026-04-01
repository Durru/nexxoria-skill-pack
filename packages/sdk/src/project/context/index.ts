import { readTextIfExists, writeTextFile } from '../../runtime/fs/index.js'
import {
  getConversationContextFilePath,
  getDraftFilePath,
  getGlobalArchitectureFilePath,
  getGlobalContextFilePath,
  getGlobalDecisionsFilePath,
  getGlobalErrorsFilePath,
  getNextStepFilePath,
  getRoutingFilePath,
} from '../../runtime/paths/index.js'
import { ensureProjectContext, getDefaultProjectContext } from '../../modules/context/index.js'
import type { ProjectContext } from '../../modules/context/index.js'

export interface ContextArtifacts {
  global: string | null
  conversation: string | null
  draft: string | null
  nextStep: string | null
  routing: string | null
  decisions: string | null
  architecture: string | null
  errors: string | null
}

export const loadContextArtifacts = (projectRoot: string): ContextArtifacts => ({
  global: readTextIfExists(getGlobalContextFilePath(projectRoot)),
  conversation: readTextIfExists(getConversationContextFilePath(projectRoot)),
  draft: readTextIfExists(getDraftFilePath(projectRoot)),
  nextStep: readTextIfExists(getNextStepFilePath(projectRoot)),
  routing: readTextIfExists(getRoutingFilePath(projectRoot)),
  decisions: readTextIfExists(getGlobalDecisionsFilePath(projectRoot)),
  architecture: readTextIfExists(getGlobalArchitectureFilePath(projectRoot)),
  errors: readTextIfExists(getGlobalErrorsFilePath(projectRoot)),
})

export const loadProjectContext = (projectRoot: string): ProjectContext => {
  return ensureProjectContext(readTextIfExists(getGlobalContextFilePath(projectRoot)))
}

export const ensureGlobalContextFile = (projectRoot: string): ProjectContext => {
  const context = loadProjectContext(projectRoot)
  writeTextFile(getGlobalContextFilePath(projectRoot), context.global)
  return context
}

export const saveConversationArtifacts = (
  projectRoot: string,
  artifacts: Partial<Record<'global' | 'conversation' | 'draft' | 'nextStep' | 'routing', string>>
): void => {
  if (artifacts.global !== undefined) writeTextFile(getGlobalContextFilePath(projectRoot), artifacts.global)
  if (artifacts.conversation !== undefined) writeTextFile(getConversationContextFilePath(projectRoot), artifacts.conversation)
  if (artifacts.draft !== undefined) writeTextFile(getDraftFilePath(projectRoot), artifacts.draft)
  if (artifacts.nextStep !== undefined) writeTextFile(getNextStepFilePath(projectRoot), artifacts.nextStep)
  if (artifacts.routing !== undefined) writeTextFile(getRoutingFilePath(projectRoot), artifacts.routing)
}
