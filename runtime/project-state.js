import path from 'node:path'
import { readJsonIfExists, writeJsonFile } from './fs-helpers.js'

const defaultState = {
  currentStage: 'stage-1',
  currentTask: 'task-1',
  status: 'initialized',
  initializedBy: 'nexxoria',
  draftConfirmed: false,
  stagesConfirmed: false,
  tasksConfirmed: false,
}

export const getProjectState = (projectRoot) => {
  const filePath = path.join(projectRoot, '.nexxoria/state/project_state.json')
  return { ...defaultState, ...(readJsonIfExists(filePath, {}) || {}) }
}

export const saveProjectState = (projectRoot, nextState) => {
  const filePath = path.join(projectRoot, '.nexxoria/state/project_state.json')
  writeJsonFile(filePath, nextState)
}
