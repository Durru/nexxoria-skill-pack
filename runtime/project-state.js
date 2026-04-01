import fs from 'node:fs'
import path from 'node:path'

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
  if (!fs.existsSync(filePath)) return { ...defaultState }
  return { ...defaultState, ...JSON.parse(fs.readFileSync(filePath, 'utf8')) }
}

export const saveProjectState = (projectRoot, nextState) => {
  const filePath = path.join(projectRoot, '.nexxoria/state/project_state.json')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(nextState, null, 2) + '\n', 'utf8')
}
