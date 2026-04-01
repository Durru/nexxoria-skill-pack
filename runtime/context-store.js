import path from 'node:path'
import { readTextIfExists, writeTextFile } from './fs-helpers.js'

export const loadContextArtifacts = (projectRoot) => {
  const contextRoot = path.join(projectRoot, '.nexxoria/context')
  const memoryRoot = path.join(projectRoot, '.nexxoria/memory/global')

  return {
    global: readTextIfExists(path.join(contextRoot, 'global.md')),
    conversation: readTextIfExists(path.join(contextRoot, 'conversation.md')),
    draft: readTextIfExists(path.join(contextRoot, 'draft.md')),
    nextStep: readTextIfExists(path.join(contextRoot, 'next-step.md')),
    routing: readTextIfExists(path.join(contextRoot, 'routing.md')),
    decisions: readTextIfExists(path.join(memoryRoot, 'decisions.md')),
    architecture: readTextIfExists(path.join(memoryRoot, 'architecture.md')),
    errors: readTextIfExists(path.join(memoryRoot, 'errors.md')),
  }
}

export const saveConversationArtifacts = (projectRoot, artifacts) => {
  const contextRoot = path.join(projectRoot, '.nexxoria/context')
  if (artifacts.conversation !== undefined) writeTextFile(path.join(contextRoot, 'conversation.md'), artifacts.conversation)
  if (artifacts.draft !== undefined) writeTextFile(path.join(contextRoot, 'draft.md'), artifacts.draft)
  if (artifacts.nextStep !== undefined) writeTextFile(path.join(contextRoot, 'next-step.md'), artifacts.nextStep)
  if (artifacts.routing !== undefined) writeTextFile(path.join(contextRoot, 'routing.md'), artifacts.routing)
  if (artifacts.global !== undefined) writeTextFile(path.join(contextRoot, 'global.md'), artifacts.global)
}
