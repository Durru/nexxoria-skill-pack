import { ensureDir, exists, readTextIfExists, writeTextFile } from '../../runtime/fs/index.js'
import { getStageDirectoryPath, getStageFilePath, getStagesPath } from '../../runtime/paths/index.js'
import { createPlanningMemoryEvents, ensurePlanningResult, getInitialPlanningStages } from '../../modules/planning/index.js'
import type { PlanningResult, PlanningStage } from '../../modules/planning/index.js'

const renderStageMarkdown = (stage: PlanningStage): string => {
  return `# ${stage.id}\n\nTitle\n\n- ${stage.title}\n\nGoal\n\n- ${stage.goal}\n\nStatus\n\n- ${stage.status}\n`
}

const ensureStageFile = (projectRoot: string, stage: PlanningStage): boolean => {
  ensureDir(getStageDirectoryPath(projectRoot, stage.id))
  const stageFilePath = getStageFilePath(projectRoot, stage.id)

  if (!exists(stageFilePath) || !readTextIfExists(stageFilePath)?.trim()) {
    writeTextFile(stageFilePath, renderStageMarkdown(stage))
    return true
  }

  return false
}

export const ensurePlanningStructure = (projectRoot: string): PlanningResult => {
  ensureDir(getStagesPath(projectRoot))

  const stages = getInitialPlanningStages(projectRoot)
  let createdInitialStage = false
  for (const stage of stages) {
    createdInitialStage = ensureStageFile(projectRoot, stage) || createdInitialStage
  }

  return {
    ...ensurePlanningResult(stages),
    memoryEvents: createPlanningMemoryEvents(createdInitialStage),
  }
}
