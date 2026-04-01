import fs from 'node:fs'
import path from 'node:path'

const REQUIRED_PATHS = [
  '.nexxoria/context/global.md',
  '.nexxoria/memory/global/decisions.md',
  '.nexxoria/memory/global/errors.md',
  '.nexxoria/memory/global/architecture.md',
  '.nexxoria/memory/stages/stage-1/memory.md',
  '.nexxoria/stages/stage-1/STAGE.md',
  '.nexxoria/stages/stage-1/tasks/task-1/TASK.md',
  '.nexxoria/state/project_state.json',
  '.nexxoria/logs',
]

export const detectProjectState = (targetDirectory) => {
  const projectRoot = path.resolve(targetDirectory)
  const nexxoriaRoot = path.join(projectRoot, '.nexxoria')
  const exists = fs.existsSync(nexxoriaRoot)

  const missing = REQUIRED_PATHS.filter((relativePath) => !fs.existsSync(path.join(projectRoot, relativePath)))

  const visibleEntries = fs.readdirSync(projectRoot, { withFileTypes: true })
    .filter((entry) => entry.name !== '.nexxoria' && entry.name !== '.git')
    .map((entry) => entry.name)

  return {
    projectRoot,
    nexxoriaRoot,
    initialized: exists && missing.length === 0,
    hasNexxoria: exists,
    missing,
    appearsExistingRepo: visibleEntries.length > 0,
    visibleEntries,
  }
}
