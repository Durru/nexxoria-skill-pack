import { readJsonIfExists, writeJsonFile } from '../../runtime/json/index.js'
import { getProjectStateFilePath } from '../../runtime/paths/index.js'
import { getDefaultProjectState, ensureProjectState } from '../../modules/state/index.js'
import type { ProjectState } from '../../modules/state/index.js'

export const loadProjectState = (projectRoot: string): ProjectState => {
  const state = readJsonIfExists<Partial<ProjectState>>(getProjectStateFilePath(projectRoot), getDefaultProjectState())
  return ensureProjectState(state)
}

export const saveProjectState = (projectRoot: string, nextState: ProjectState): void => {
  writeJsonFile(getProjectStateFilePath(projectRoot), nextState)
}

export const ensureProjectStateFile = (projectRoot: string): ProjectState => {
  const state = loadProjectState(projectRoot)
  saveProjectState(projectRoot, state)
  return state
}
