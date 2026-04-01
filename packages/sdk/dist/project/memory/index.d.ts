import type { MemoryEventSet, MemoryResult } from '../../modules/memory/index.js';
export declare const ensureGlobalMemory: (projectRoot: string) => MemoryResult;
export declare const recordGlobalMemoryEvents: (projectRoot: string, events: MemoryEventSet) => MemoryResult;
