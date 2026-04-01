import { MemoryEventSet, MemoryResult } from './memory.types.js';
export declare const ensureMemoryResult: (memory: MemoryResult) => MemoryResult;
export declare const mergeMemoryEvents: (memory: MemoryResult, events: MemoryEventSet) => MemoryResult;
