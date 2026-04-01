import path from 'node:path'
import { readRepositorySnapshot } from '../../runtime/repository-io.js'
import { ensureProjectScaffold, persistGlobalMemoryArtifacts } from '../../runtime/onboarding-store.js'
import { loadContextArtifacts, saveConversationArtifacts } from '../../runtime/context-store.js'
import { getProjectState } from '../../runtime/project-state.js'
import { collectKnownFacts, buildConversationArtifacts, buildRoutingArtifact } from '../context/index.js'
import { deriveSuggestedNextStep } from '../state/index.js'
import { decideDraft } from '../planning/index.js'
import { renderGlobalMemoryArtifacts } from '../memory/index.js'
import { decideTaskRoutingIntent } from '../tasks/index.js'

const summarizeReadme = (content) => {
  if (!content) return null
  return content.split('\n').map((line) => line.trim()).filter(Boolean).slice(0, 8).join(' ')
}

const analyzeRepository = (snapshot) => {
  const directories = snapshot.entries.filter((entry) => entry.type === 'dir').map((entry) => entry.name)
  const files = snapshot.entries.filter((entry) => entry.type === 'file').map((entry) => entry.name)

  const projectType = snapshot.packageJson?.name
    ? 'node-project'
    : files.includes('go.mod')
      ? 'go-project'
      : files.includes('Cargo.toml')
        ? 'rust-project'
        : 'unknown-project'

  const architectureSignals = [
    directories.includes('src') ? 'has src directory' : null,
    directories.includes('app') ? 'has app directory' : null,
    directories.includes('components') ? 'has components directory' : null,
    directories.includes('packages') ? 'has packages directory' : null,
    files.includes('package.json') ? 'has package.json' : null,
    files.includes('README.md') ? 'has README.md' : null,
  ].filter(Boolean)

  const summary = summarizeReadme(snapshot.readme)

  return {
    projectRoot: snapshot.projectRoot,
    projectName: snapshot.packageJson?.name || path.basename(snapshot.projectRoot),
    projectType,
    summary,
    directories,
    files,
    architectureSignals,
    inferredDecisions: [
      projectType !== 'unknown-project' ? `project type inferred as ${projectType}` : null,
      snapshot.packageJson?.private ? 'package appears private' : null,
    ].filter(Boolean),
    pendingQuestions: [
      summary ? null : 'What is the main goal of this project?',
      architectureSignals.length ? null : 'What are the main parts of this repository?',
    ].filter(Boolean),
  }
}

const analyzeProject = ({ projectRoot, detection }) => {
  if (!detection.appearsExistingRepo) {
    return {
      projectRoot,
      projectName: path.basename(projectRoot),
      projectType: 'new-project',
      summary: 'New project initialization in progress',
      directories: [],
      files: [],
      architectureSignals: ['fresh Nexxoria bootstrap'],
      inferredDecisions: ['project is being initialized from a new prompt'],
      pendingQuestions: ['What is the main goal of this project?', 'What should the project be called?'],
    }
  }

  return analyzeRepository(readRepositorySnapshot(projectRoot))
}

const decideConversationContext = ({ projectRoot, analysis, detection, projectState, persistedArtifacts, userPrompt }) => {
  const mode = detection.appearsExistingRepo ? 'existing-project' : 'new-project'
  const unresolvedQuestions = projectState.draftConfirmed ? [] : analysis.pendingQuestions.filter(Boolean)
  const knownFacts = collectKnownFacts({
    analysis,
    projectState,
    persistedContext: persistedArtifacts.global,
    decisionsContent: persistedArtifacts.decisions,
    architectureContent: persistedArtifacts.architecture,
  })

  const shouldGenerateDraft = mode === 'existing-project'
    ? Boolean(analysis.summary || analysis.architectureSignals.length)
    : userPrompt.trim().length > 0

  return {
    mode,
    knownFacts,
    unresolvedQuestions,
    shouldAskMore: unresolvedQuestions.length > 0,
    shouldGenerateDraft,
    suggestedNextStep: deriveSuggestedNextStep({ mode, projectState }),
    draft: shouldGenerateDraft ? decideDraft({ mode, analysis, knownFacts }) : null,
  }
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

const decideRoute = ({ projectRoot, conversationContext, userPrompt, projectState, persistedArtifacts }) => {
  const nextStepBullets = extractBullets(persistedArtifacts.nextStep || '')
  const nextStep = nextStepBullets[0] || conversationContext.suggestedNextStep || 'summarize findings and propose how to continue'
  const prompt = userPrompt.toLowerCase()

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
  } else if (conversationContext.draft && !projectState.draftConfirmed) {
    targetModule = 'conversation'
    reason = 'a draft exists but it has not been confirmed yet'
    proposal = 'Review the draft and confirm whether Nexxoria should use it as the project direction.'
    needsConfirmation = true
  } else if (projectState.draftConfirmed && !projectState.stagesConfirmed) {
    targetModule = 'planning'
    reason = 'the draft is confirmed but stages are not confirmed yet'
    proposal = 'Define and confirm project stages from the approved draft.'
    needsConfirmation = true
  } else if (projectState.stagesConfirmed && !projectState.tasksConfirmed) {
    targetModule = 'tasks'
    reason = 'stages are confirmed but tasks are not confirmed yet'
    proposal = 'Create the first confirmed tasks from the defined stages.'
    needsConfirmation = true
  } else if (decideTaskRoutingIntent(prompt)) {
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

export const runConversationModule = ({ projectRoot, userPrompt }) => {
  const scaffold = ensureProjectScaffold(projectRoot)
  const persistedContext = loadContextArtifacts(projectRoot)
  const decisions = persistedContext.decisions || ''
  const architecture = persistedContext.architecture || ''
  const analysis = analyzeProject({ projectRoot: scaffold.projectRoot, detection: scaffold.detection })
  const memoryArtifacts = renderGlobalMemoryArtifacts(analysis)
  persistGlobalMemoryArtifacts(scaffold.projectRoot, memoryArtifacts)

  const projectState = getProjectState(scaffold.projectRoot)
  const enrichedArtifacts = {
    ...persistedContext,
    decisions,
    architecture,
  }

  const conversationContext = decideConversationContext({
    projectRoot: scaffold.projectRoot,
    analysis,
    detection: scaffold.detection,
    projectState,
    persistedArtifacts: enrichedArtifacts,
    userPrompt,
  })

  const route = decideRoute({
    projectRoot: scaffold.projectRoot,
    conversationContext,
    userPrompt,
    projectState,
    persistedArtifacts,
  })

  const artifacts = buildConversationArtifacts(conversationContext)
  saveConversationArtifacts(scaffold.projectRoot, {
    ...artifacts,
    routing: buildRoutingArtifact(route),
  })

  return {
    scaffold,
    analysis,
    conversationContext,
    route,
  }
}
