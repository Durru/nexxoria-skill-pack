import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const defaultProjectState = {
  currentStage: 'stage-1',
  currentTask: 'task-1',
  status: 'initialized',
  initializedBy: 'nexxoria',
  draftConfirmed: false,
  stagesConfirmed: false,
  tasksConfirmed: false,
}

const structure = {
  '.nexxoria/context/global.md': '# Global Context\n\n- Project-wide working context\n',
  '.nexxoria/memory/global/decisions.md': '# Global Decisions\n\n- Record cross-project decisions here\n',
  '.nexxoria/memory/global/errors.md': '# Global Errors\n\n- Record important failures and resolutions here\n',
  '.nexxoria/memory/global/architecture.md': '# Global Architecture\n\n- Record architecture notes here\n',
  '.nexxoria/memory/stages/stage-1/memory.md': '# Stage 1 Memory\n\n- Record stage-local decisions and context here\n',
  '.nexxoria/stages/stage-1/STAGE.md': '# Stage 1\n\nName\n\n- Setup\n\nPurpose\n\n- Bootstrap the project and define the initial direction\n',
  '.nexxoria/stages/stage-1/tasks/task-1/TASK.md': '# Task 1\n\nIntent\n\n- Initial bootstrap task\n\nStatus\n\n- pending\n',
  '.nexxoria/state/project_state.json': JSON.stringify(defaultProjectState, null, 2) + '\n',
}

const directories = [
  '.nexxoria',
  '.nexxoria/context',
  '.nexxoria/memory',
  '.nexxoria/memory/global',
  '.nexxoria/memory/stages',
  '.nexxoria/memory/stages/stage-1',
  '.nexxoria/memory/tags',
  '.nexxoria/stages',
  '.nexxoria/stages/stage-1',
  '.nexxoria/stages/stage-1/tasks',
  '.nexxoria/stages/stage-1/tasks/task-1',
  '.nexxoria/state',
  '.nexxoria/logs',
]

const writeIfMissing = (filePath, content) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8')
    return true
  }
  return false
}

const repairProjectState = (projectRoot) => {
  const statePath = path.join(projectRoot, '.nexxoria/state/project_state.json')
  if (!fs.existsSync(statePath)) return false

  const currentState = JSON.parse(fs.readFileSync(statePath, 'utf8'))
  const mergedState = { ...defaultProjectState, ...currentState }

  if (JSON.stringify(currentState) === JSON.stringify(mergedState)) {
    return false
  }

  fs.writeFileSync(statePath, JSON.stringify(mergedState, null, 2) + '\n', 'utf8')
  return true
}

export const bootstrapProject = (targetDirectory) => {
  const projectRoot = path.resolve(targetDirectory)
  const createdDirs = []
  const createdFiles = []

  for (const relativeDir of directories) {
    const absoluteDir = path.join(projectRoot, relativeDir)
    if (!fs.existsSync(absoluteDir)) {
      fs.mkdirSync(absoluteDir, { recursive: true })
      createdDirs.push(relativeDir)
    }
  }

  for (const [relativeFile, content] of Object.entries(structure)) {
    const absoluteFile = path.join(projectRoot, relativeFile)
    if (writeIfMissing(absoluteFile, content)) {
      createdFiles.push(relativeFile)
    }
  }

  if (repairProjectState(projectRoot) && !createdFiles.includes('.nexxoria/state/project_state.json')) {
    createdFiles.push('.nexxoria/state/project_state.json')
  }

  return {
    projectRoot,
    createdDirs,
    createdFiles,
    initialized: fs.existsSync(path.join(projectRoot, '.nexxoria')),
  }
}

const runFromCli = () => {
  const targetDirectory = process.argv[2] || process.cwd()
  const result = bootstrapProject(targetDirectory)
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  runFromCli()
}

export const nexxoriaRuntime = {
  repoRoot,
  bootstrapProject,
}
