import { BootstrapResult } from '../../core/types/index.js'
import { ProjectState } from '../state/index.js'
import { ProjectContext } from '../context/index.js'
import { PlanningResult } from '../planning/index.js'
import { TasksResult } from '../tasks/index.js'

export type HandlePromptStatus = 'needs_input' | 'bootstrapped' | 'ready'

export interface ConversationInput {
  prompt: string
  bootstrap: BootstrapResult
  state: ProjectState
  context: ProjectContext
  planning: PlanningResult
  tasks: TasksResult
}

export interface ConversationResult {
  message: string
  status: HandlePromptStatus
  bootstrap: BootstrapResult
}
