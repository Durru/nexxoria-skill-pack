import fs from 'node:fs'
import path from 'node:path'
import { getProjectState } from './project-state.js'

const normalizeWhitespace = (value) => value.trim().replace(/\s+/g, ' ')

const normalizeKnownFact = (value) => {
  const normalized = normalizeWhitespace(value).toLowerCase()

  if (normalized.startsWith('project type:')) {
    return `project type:${normalized.slice('project type:'.length).trim()}`
  }

  if (normalized.startsWith('summary:')) {
    return `summary:${normalized.slice('summary:'.length).trim()}`
  }

  if (normalized.startsWith('project summary:')) {
    return `summary:${normalized.slice('project summary:'.length).trim()}`
  }

  return normalized
}

const unique = (values, normalize = (value) => value) => {
  const seen = new Set()

  return values.filter((value) => {
    if (!value) return false

    const normalizedValue = normalize(value)
    if (seen.has(normalizedValue)) return false

    seen.add(normalizedValue)
    return true
  })
}

const readIfExists = (filePath) => {
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8')
}

const extractBulletValues = (content) => {
  if (!content) return []
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
}

const renderBulletList = (values, emptyValue) => values.map((item) => `- ${item}`).join('\n') || emptyValue

const renderConversationContext = (context) => `# Conversation Context

Mode

- ${context.mode}

Known Facts

${renderBulletList(context.knownFacts, '- None yet')}

Unresolved Questions

${renderBulletList(context.unresolvedQuestions, '- None')}
`

const renderDraft = (context) => {
  if (!context.draft) return '# Draft\n\n- No draft available yet\n'
  return `# Draft

Description

- ${context.draft.description}

Suggested Stages

${renderBulletList(context.draft.suggestedStages, '- None yet')}

Organization

${renderBulletList(context.draft.organization, '- None yet')}
`
}

const renderNextStep = (context) => `# Next Step

- ${context.suggestedNextStep}

Questions Needed

- ${context.shouldAskMore ? 'Yes' : 'No'}

Draft Ready

- ${context.shouldGenerateDraft ? 'Yes' : 'No'}
`

const writeText = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

const buildDraft = ({ mode, analysis, knownFacts }) => {
  const summary = analysis.summary || 'Project direction still needs confirmation'
  const stageSuggestion = mode === 'existing-project'
    ? ['Understand current structure', 'Plan next change', 'Implement safely']
    : ['Define scope', 'Build core', 'Refine and ship']

  return {
    description: summary,
    suggestedStages: stageSuggestion,
    organization: knownFacts.slice(0, 5),
  }
}

export const buildConversationContext = ({ projectRoot, onboarding, userPrompt = '' }) => {
  const contextPath = path.join(projectRoot, '.nexxoria/context/global.md')
  const decisionsPath = path.join(projectRoot, '.nexxoria/memory/global/decisions.md')
  const architecturePath = path.join(projectRoot, '.nexxoria/memory/global/architecture.md')
  const projectState = getProjectState(projectRoot)

  const contextContent = readIfExists(contextPath)
  const decisionsContent = readIfExists(decisionsPath)
  const architectureContent = readIfExists(architecturePath)

  const knownFacts = unique([
    `project type: ${onboarding.analysis.projectType}`,
    onboarding.analysis.summary ? `summary: ${onboarding.analysis.summary}` : null,
    `draft confirmed: ${projectState.draftConfirmed ? 'yes' : 'no'}`,
    `stages confirmed: ${projectState.stagesConfirmed ? 'yes' : 'no'}`,
    `tasks confirmed: ${projectState.tasksConfirmed ? 'yes' : 'no'}`,
    ...extractBulletValues(contextContent),
    ...extractBulletValues(decisionsContent),
    ...extractBulletValues(architectureContent),
  ], normalizeKnownFact)

  const mode = onboarding.detection.appearsExistingRepo ? 'existing-project' : 'new-project'
  const unresolvedQuestions = projectState.draftConfirmed
    ? []
    : onboarding.analysis.pendingQuestions.filter(Boolean)

  const enoughForDraft = mode === 'existing-project'
    ? Boolean(onboarding.analysis.summary || onboarding.analysis.architectureSignals.length)
    : userPrompt.trim().length > 0

  return {
    mode,
    knownFacts,
    unresolvedQuestions,
    shouldAskMore: unresolvedQuestions.length > 0,
    shouldGenerateDraft: enoughForDraft,
    suggestedNextStep: statefulNextStep({ mode, projectState }),
    draft: enoughForDraft ? buildDraft({ mode, analysis: onboarding.analysis, knownFacts }) : null,
  }
}

const statefulNextStep = ({ mode, projectState }) => {
  if (projectState.stagesConfirmed && !projectState.tasksConfirmed) {
    return 'create the first confirmed tasks from the defined stages'
  }

  if (projectState.draftConfirmed && !projectState.stagesConfirmed) {
    return 'define and confirm project stages from the approved draft'
  }

  return mode === 'existing-project'
    ? 'summarize findings and propose how to continue'
    : 'clarify the project goal and propose an initial structure'
}

export const persistConversationContext = ({ projectRoot, context }) => {
  writeText(path.join(projectRoot, '.nexxoria/context/conversation.md'), renderConversationContext(context))
  writeText(path.join(projectRoot, '.nexxoria/context/draft.md'), renderDraft(context))
  writeText(path.join(projectRoot, '.nexxoria/context/next-step.md'), renderNextStep(context))
}
