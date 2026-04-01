import { NexxoriaOptions, BootstrapResult, HandlePromptResult } from './core/types/index.js'
import { bootstrapProject } from './project/bootstrap/index.js'
import { resolveProjectRoot } from './runtime/paths/index.js'
import { runConversationModule } from './modules/conversation/index.js'
import { ensureProjectStateFile } from './project/state/index.js'
import { ensureGlobalContextFile } from './project/context/index.js'
import { ensurePlanningStructure } from './project/planning/index.js'
import { saveProjectState } from './project/state/index.js'
import { ensureTasksStructure } from './project/tasks/index.js'
import { deriveProjectState } from './modules/state/index.js'
import { ensureGlobalMemory, recordGlobalMemoryEvents } from './project/memory/index.js'

export class Nexxoria {
  private readonly projectRoot: string

  constructor(options: NexxoriaOptions = {}) {
    this.projectRoot = resolveProjectRoot(options.projectRoot)
  }

  bootstrapIfNeeded(): BootstrapResult {
    return bootstrapProject(this.projectRoot)
  }

  async handlePrompt(prompt: string): Promise<HandlePromptResult> {
    const normalizedPrompt = prompt.trim()
    const bootstrap = this.bootstrapIfNeeded()
    const state = ensureProjectStateFile(this.projectRoot)
    const context = ensureGlobalContextFile(this.projectRoot)
    const planning = ensurePlanningStructure(this.projectRoot)
    const currentStageId = state.current_stage ?? planning.stages[0]?.id ?? null
    const tasks = ensureTasksStructure(this.projectRoot, currentStageId ?? 'stage-1')
    ensureGlobalMemory(this.projectRoot)
    const stateResult = deriveProjectState({
      state,
      currentStageId,
      hasTasks: tasks.items.length > 0,
    })
    const finalState = stateResult.state

    if (JSON.stringify(finalState) !== JSON.stringify(state)) {
      saveProjectState(this.projectRoot, finalState)
    }

    const memory = recordGlobalMemoryEvents(this.projectRoot, {
      decisions: [
        ...(planning.memoryEvents?.decisions ?? []),
        ...(tasks.memoryEvents?.decisions ?? []),
      ],
      architecture: [
        ...(stateResult.memoryEvents?.architecture ?? []),
      ],
      errors: [],
    })

    const conversation = runConversationModule({
      prompt: normalizedPrompt,
      bootstrap,
      state: finalState,
      context,
      planning,
      tasks,
    })

    return {
      ...conversation,
      state: finalState,
      context,
      planning: {
        stages: planning.stages.map((stage) => ({
          id: stage.id,
          title: stage.title,
          path: stage.path,
        })),
      },
      tasks: {
        current_stage: tasks.current_stage,
        items: tasks.items.map((task) => ({
          id: task.id,
          title: task.title,
          path: task.path,
        })),
      },
      memory,
    }
  }
}
