import fs from 'node:fs'
import path from 'node:path'
import { getProjectState } from './project-state.js'

const readIfExists = (filePath) => {
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8')
}

const extractBullets = (content) => {
  if (!content) return []
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
}

export const decideNextRoute = ({ projectRoot, conversationContext, userPrompt = '' }) => {
  const nextStepPath = path.join(projectRoot, '.nexxoria/context/next-step.md')
  const nextStepContent = readIfExists(nextStepPath) || ''
  const nextStepBullets = extractBullets(nextStepContent)
  const nextStep = nextStepBullets[0] || conversationContext.suggestedNextStep || 'summarize findings and propose how to continue'
  const prompt = userPrompt.toLowerCase()
  const state = getProjectState(projectRoot)

  let targetModule = 'conversation'
  let reason = 'default conversation follow-up'
  let needsConfirmation = false
  let proposal = nextStep

  if (conversationContext.unresolvedQuestions.length > 0) {
    targetModule = 'conversation'
    reason = 'there are unresolved questions'
    proposal = 'Clarify the missing information before creating more structure.'
  } else if (prompt.includes('progress') || prompt.includes('estado') || prompt.includes('progreso')) {
    targetModule = 'state'
    reason = 'the user is asking about progress or current state'
    proposal = 'Summarize the current project state and identify what remains.'
  } else if (conversationContext.draft && !state.draftConfirmed) {
    targetModule = 'conversation'
    reason = 'a draft exists but it has not been confirmed yet'
    proposal = 'Review the draft and confirm whether Nexxoria should use it as the project direction.'
    needsConfirmation = true
  } else if (state.draftConfirmed && !state.stagesConfirmed) {
    targetModule = 'planning'
    reason = 'the draft is confirmed but stages are not confirmed yet'
    proposal = 'Define and confirm project stages from the approved draft.'
    needsConfirmation = true
  } else if (state.stagesConfirmed && !state.tasksConfirmed) {
    targetModule = 'tasks'
    reason = 'stages are confirmed but tasks are not confirmed yet'
    proposal = 'Create the first confirmed tasks from the defined stages.'
    needsConfirmation = true
  } else if (prompt.includes('task') || prompt.includes('tarea')) {
    targetModule = 'tasks'
    reason = 'the user is explicitly talking about tasks'
    proposal = 'Work on task creation or task updates.'
  } else if (prompt.includes('decision') || prompt.includes('error') || prompt.includes('arquitect')) {
    targetModule = 'memory'
    reason = 'the prompt points to decisions, errors, or architecture'
    proposal = 'Record the relevant changes in persistent memory.'
  } else if (nextStep.toLowerCase().includes('etapa') || nextStep.toLowerCase().includes('stage')) {
    targetModule = 'conversation'
    reason = 'the persisted next step indicates stage definition but still needs confirmation'
    proposal = `Move into planning after confirmation: ${nextStep}`
    needsConfirmation = true
  } else if (nextStep.toLowerCase().includes('task') || nextStep.toLowerCase().includes('tarea')) {
    targetModule = 'conversation'
    reason = 'the persisted next step indicates task work but still needs confirmation'
    proposal = `Move into tasks after confirmation: ${nextStep}`
    needsConfirmation = true
  }

  return {
    targetModule,
    reason,
    proposal,
    nextStep,
    needsConfirmation,
  }
}

export const persistRoutingDecision = ({ projectRoot, route }) => {
  const content = `# Routing\n\nTarget Module\n\n- ${route.targetModule}\n\nReason\n\n- ${route.reason}\n\nProposal\n\n- ${route.proposal}\n\nNext Step\n\n- ${route.nextStep}\n\nNeeds Confirmation\n\n- ${route.needsConfirmation ? 'Yes' : 'No'}\n`
  fs.mkdirSync(path.join(projectRoot, '.nexxoria/context'), { recursive: true })
  fs.writeFileSync(path.join(projectRoot, '.nexxoria/context/routing.md'), content, 'utf8')
}
