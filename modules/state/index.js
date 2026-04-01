export const deriveSuggestedNextStep = ({ mode, projectState }) => {
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
