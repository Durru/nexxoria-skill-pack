export const renderGlobalMemoryArtifacts = (analysis) => ({
  globalContext: `# Global Context\n\n- Project: ${analysis.projectName}\n- Type: ${analysis.projectType}\n- Summary: ${analysis.summary || 'Not inferred yet'}\n`,
  decisions: `# Global Decisions\n\n${analysis.inferredDecisions.map((item) => `- ${item}`).join('\n') || '- No inferred decisions yet'}\n`,
  errors: '# Global Errors\n\n- No major errors recorded during onboarding\n',
  architecture: `# Global Architecture\n\n${analysis.architectureSignals.map((item) => `- ${item}`).join('\n') || '- Architecture not inferred yet'}\n`,
})
