export interface NexxoriaOptions {
  projectRoot?: string
}

export interface BootstrapResult {
  projectRoot: string
  nexxoriaRoot: string
  created: boolean
  repaired: boolean
}

export interface HandlePromptResult {
  message: string
  status: 'needs_input' | 'bootstrapped' | 'ready'
  intent: 'empty_input' | 'status' | 'continue' | 'organize_project' | 'clarify_request'
  bootstrap: BootstrapResult
  state: {
    current_stage: string | null
    /** Reserved progress percentage (0..100). Current MVP keeps it at 0. */
    progress: number
    /** Minimal derived step aligned with the current persisted structure. */
    next_step: 'define_project_scope' | 'define_stage_scope' | 'define_task_scope' | null
    /** Reserved field for future explicit project typing. Not inferred automatically yet. */
    project_type: string | null
  }
  context: {
    global: string
  }
  planning: {
    stages: Array<{
      id: string
      title: string
      path: string
    }>
  }
  tasks: {
    current_stage: string
    items: Array<{
      id: string
      title: string
      path: string
    }>
  }
  memory: {
    global: {
      decisions: string
      architecture: string
      errors: string
    }
  }
}
