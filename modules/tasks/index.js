export const decideTaskRoutingIntent = (prompt) => {
  const normalizedPrompt = prompt.toLowerCase()
  return normalizedPrompt.includes('task') || normalizedPrompt.includes('tarea')
}
