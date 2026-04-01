import { TaskItem, TasksResult } from './tasks.types.js'

export const getInitialTaskItems = (projectRoot: string, stageId: string): TaskItem[] => [
  {
    id: 'task-1',
    title: 'Define first task scope',
    goal: 'Clarify the first concrete piece of work inside the current stage.',
    status: 'active',
    path: `${projectRoot}/.nexxoria/stages/${stageId}/tasks/task-1/TASK.md`,
  },
]

export const ensureTasksResult = (currentStage: string, items: TaskItem[]): TasksResult => ({
  current_stage: currentStage,
  items,
})

export const createTasksMemoryEvents = (createdInitialTask: boolean) => ({
  decisions: createdInitialTask ? ['Initialized first task inside the active stage: task-1.'] : [],
})
