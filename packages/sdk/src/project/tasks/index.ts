import { ensureDir, exists, readFile, readTextIfExists, writeFile } from '../../runtime/fs/index.js'
import {
  getTaskDirectoryPath,
  getTaskFilePath,
  getTasksTemplatePath,
  getStageTasksDirectoryPath,
} from '../../runtime/paths/index.js'
import { createTasksMemoryEvents, ensureTasksResult, getInitialTaskItems } from '../../modules/tasks/index.js'
import type { TaskItem, TasksResult } from '../../modules/tasks/index.js'

const renderTaskMarkdown = (task: TaskItem): string => {
  return `# ${task.id}\n\nTitle\n\n- ${task.title}\n\nGoal\n\n- ${task.goal}\n\nStatus\n\n- ${task.status}\n`
}

const ensureTaskFile = (projectRoot: string, stageId: string, task: TaskItem): boolean => {
  ensureDir(getStageTasksDirectoryPath(projectRoot, stageId))
  ensureDir(getTaskDirectoryPath(projectRoot, stageId, task.id))

  const taskFilePath = getTaskFilePath(projectRoot, stageId, task.id)

  if (!exists(taskFilePath) || !readTextIfExists(taskFilePath)?.trim()) {
    const template = readTextIfExists(getTasksTemplatePath())
    writeFile(taskFilePath, template?.trim() ? template : renderTaskMarkdown(task))
    return true
  }

  return false
}

export const ensureTasksStructure = (projectRoot: string, stageId: string): TasksResult => {
  const items = getInitialTaskItems(projectRoot, stageId)
  let createdInitialTask = false

  for (const task of items) {
    createdInitialTask = ensureTaskFile(projectRoot, stageId, task) || createdInitialTask
  }

  return {
    ...ensureTasksResult(stageId, items),
    memoryEvents: createTasksMemoryEvents(createdInitialTask),
  }
}
