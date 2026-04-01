export const decideDraft = ({ mode, analysis, knownFacts }) => {
  const summary = analysis.summary || 'Project direction still needs confirmation'
  const suggestedStages = mode === 'existing-project'
    ? ['Understand current structure', 'Plan next change', 'Implement safely']
    : ['Define scope', 'Build core', 'Refine and ship']

  return {
    description: summary,
    suggestedStages,
    organization: knownFacts.slice(0, 5),
  }
}
