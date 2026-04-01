import { MemoryEventSet } from '../memory/index.js';
export interface PlanningStage {
    id: string;
    title: string;
    goal: string;
    status: 'pending' | 'active';
    path: string;
}
export interface PlanningResult {
    stages: PlanningStage[];
    memoryEvents?: MemoryEventSet;
}
