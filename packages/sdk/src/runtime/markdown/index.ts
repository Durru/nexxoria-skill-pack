export const renderBulletList = (values: string[], emptyValue: string): string => {
  return values.map((item) => `- ${item}`).join('\n') || emptyValue
}

export const extractBulletValues = (content: string | null): string[] => {
  if (!content) return []
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
}
