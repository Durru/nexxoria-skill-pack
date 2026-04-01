import { MemoryEventSet } from '../memory/index.js';
export interface TaskItem {
    id: string;
    title: string;
    goal: string;
    status: 'pending' | 'active';
    path: string;
}
export interface TasksResult {
    current_stage: string;
    items: TaskItem[];
    memoryEvents?: MemoryEventSet;
}
