import { BootstrapResult } from '../../core/types/index.js'
import { ProjectState } from '../state/index.js'
import { ProjectContext } from '../context/index.js'
import { PlanningResult } from '../planning/index.js'
import { TasksResult } from '../tasks/index.js'
import { MemoryResult } from '../memory/index.js'

export type HandlePromptStatus = 'needs_input' | 'bootstrapped' | 'ready'

export type ConversationIntent =
  | 'empty_input'
  | 'status'
  | 'continue'
  | 'organize_project'
  | 'clarify_request'

export interface ConversationInput {
  prompt: string
  bootstrap: BootstrapResult
  state: ProjectState
  context: ProjectContext
  planning: PlanningResult
  tasks: TasksResult
  memory: MemoryResult
}

export interface ConversationResult {
  message: string
  status: HandlePromptStatus
  bootstrap: BootstrapResult
  intent: ConversationIntent
}
