/**
 * Reserved project classification field.
 *
 * Current MVP contract:
 * - remains `null` unless some future explicit flow sets it
 * - is NOT inferred automatically in the current system
 */
export type ProjectType = string | null

/**
 * Minimal next-step contract for the current MVP.
 *
 * Resolution order:
 * - no active stage -> define project scope
 * - active stage but no tasks -> define stage scope
 * - active task set exists -> define task scope
 */
export type ProjectNextStep =
  | 'define_project_scope'
  | 'define_stage_scope'
  | 'define_task_scope'
  | null

export interface ProjectState {
  current_stage: string | null
  /**
   * Reserved progress percentage for future evolution.
   * Current MVP contract:
   * - numeric range is semantically 0..100
   * - currently defaults to 0
   * - is NOT automatically calculated yet
   */
  progress: number
  next_step: ProjectNextStep
  project_type: ProjectType
}

export interface StateFlowInput {
  state: ProjectState
  currentStageId: string | null
  hasTasks: boolean
}

export interface StateDerivationResult {
  state: ProjectState
  memoryEvents?: MemoryEventSet
}
import { MemoryEventSet } from '../memory/index.js'
