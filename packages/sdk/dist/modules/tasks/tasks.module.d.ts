import { TaskItem, TasksResult } from './tasks.types.js';
export declare const getInitialTaskItems: (projectRoot: string, stageId: string) => TaskItem[];
export declare const ensureTasksResult: (currentStage: string, items: TaskItem[]) => TasksResult;
export declare const createTasksMemoryEvents: (createdInitialTask: boolean) => {
    decisions: string[];
};
