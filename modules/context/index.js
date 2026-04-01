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

export const buildConversationArtifacts = (context) => ({
  conversation: `# Conversation Context\n\nMode\n\n- ${context.mode}\n\nKnown Facts\n\n${renderBulletList(context.knownFacts, '- None yet')}\n\nUnresolved Questions\n\n${renderBulletList(context.unresolvedQuestions, '- None')}\n`,
  draft: context.draft
    ? `# Draft\n\nDescription\n\n- ${context.draft.description}\n\nSuggested Stages\n\n${renderBulletList(context.draft.suggestedStages, '- None yet')}\n\nOrganization\n\n${renderBulletList(context.draft.organization, '- None yet')}\n`
    : '# Draft\n\n- No draft available yet\n',
  nextStep: `# Next Step\n\n- ${context.suggestedNextStep}\n\nQuestions Needed\n\n- ${context.shouldAskMore ? 'Yes' : 'No'}\n\nDraft Ready\n\n- ${context.shouldGenerateDraft ? 'Yes' : 'No'}\n`,
})

export const buildRoutingArtifact = (route) => `# Routing\n\nTarget Module\n\n- ${route.targetModule}\n\nReason\n\n- ${route.reason}\n\nProposal\n\n- ${route.proposal}\n\nNext Step\n\n- ${route.nextStep}\n\nNeeds Confirmation\n\n- ${route.needsConfirmation ? 'Yes' : 'No'}\n`

export const collectKnownFacts = ({ analysis, projectState, persistedContext, decisionsContent, architectureContent }) => unique([
  `project type: ${analysis.projectType}`,
  analysis.summary ? `summary: ${analysis.summary}` : null,
  `draft confirmed: ${projectState.draftConfirmed ? 'yes' : 'no'}`,
  `stages confirmed: ${projectState.stagesConfirmed ? 'yes' : 'no'}`,
  `tasks confirmed: ${projectState.tasksConfirmed ? 'yes' : 'no'}`,
  ...extractBulletValues(persistedContext),
  ...extractBulletValues(decisionsContent),
  ...extractBulletValues(architectureContent),
], normalizeKnownFact)
