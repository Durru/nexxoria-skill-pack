import { readTextIfExists, writeTextFile } from '../../runtime/fs/index.js'
import {
  getArchitectureFilePath,
  getDecisionsFilePath,
  getErrorsFilePath,
  getArchitectureTemplatePath,
  getDecisionsTemplatePath,
  getErrorsTemplatePath,
} from '../../runtime/paths/index.js'
import { ensureMemoryResult, mergeMemoryEvents } from '../../modules/memory/index.js'
import type { MemoryEventSet, MemoryResult } from '../../modules/memory/index.js'

const ensureMemoryFile = (targetPath: string, templatePath: string): string => {
  const current = readTextIfExists(targetPath)
  if (current && current.trim()) return current

  const template = readTextIfExists(templatePath) ?? ''
  writeTextFile(targetPath, template)
  return template
}

export const ensureGlobalMemory = (projectRoot: string): MemoryResult => {
  return ensureMemoryResult({
    global: {
      decisions: ensureMemoryFile(getDecisionsFilePath(projectRoot), getDecisionsTemplatePath()),
      architecture: ensureMemoryFile(getArchitectureFilePath(projectRoot), getArchitectureTemplatePath()),
      errors: ensureMemoryFile(getErrorsFilePath(projectRoot), getErrorsTemplatePath()),
    },
  })
}

export const recordGlobalMemoryEvents = (projectRoot: string, events: MemoryEventSet): MemoryResult => {
  const current = ensureGlobalMemory(projectRoot)
  const next = mergeMemoryEvents(current, events)

  writeTextFile(getDecisionsFilePath(projectRoot), next.global.decisions)
  writeTextFile(getArchitectureFilePath(projectRoot), next.global.architecture)
  writeTextFile(getErrorsFilePath(projectRoot), next.global.errors)

  return next
}
