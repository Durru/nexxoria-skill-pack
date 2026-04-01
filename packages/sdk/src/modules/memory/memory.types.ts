export interface MemoryGlobal {
  decisions: string
  architecture: string
  errors: string
}

export interface MemoryResult {
  global: MemoryGlobal
}

export interface MemoryEventSet {
  decisions?: string[]
  architecture?: string[]
  errors?: string[]
}

export interface MemoryEventCarrier {
  memoryEvents?: MemoryEventSet
}
