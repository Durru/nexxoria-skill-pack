import path from 'node:path'
import { bootstrapProject } from './bootstrap-project.js'
import { detectProjectState } from './project-detection.js'
import { writeTextFile } from './fs-helpers.js'

export const ensureProjectScaffold = (targetDirectory) => {
  const detection = detectProjectState(targetDirectory)
  const bootstrapResult = (!detection.hasNexxoria || detection.missing.length > 0)
    ? bootstrapProject(targetDirectory)
    : { createdDirs: [], createdFiles: [], initialized: true }

  return {
    projectRoot: path.resolve(targetDirectory),
    detection,
    bootstrapResult,
  }
}

export const persistGlobalMemoryArtifacts = (projectRoot, artifacts) => {
  if (artifacts.globalContext !== undefined) {
    writeTextFile(path.join(projectRoot, '.nexxoria/context/global.md'), artifacts.globalContext)
  }

  if (artifacts.decisions !== undefined) {
    writeTextFile(path.join(projectRoot, '.nexxoria/memory/global/decisions.md'), artifacts.decisions)
  }

  if (artifacts.errors !== undefined) {
    writeTextFile(path.join(projectRoot, '.nexxoria/memory/global/errors.md'), artifacts.errors)
  }

  if (artifacts.architecture !== undefined) {
    writeTextFile(path.join(projectRoot, '.nexxoria/memory/global/architecture.md'), artifacts.architecture)
  }
}
