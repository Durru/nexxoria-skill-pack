import { HandlePromptResult } from '@nexxoria/sdk'

export const renderHandlePromptResult = (result: HandlePromptResult): string => {
  const lines: string[] = []

  lines.push('')
  lines.push('🧠 Nexxoria')
  lines.push('-------------------')
  lines.push(result.message)
  lines.push('')

  if (result.state) {
    lines.push('📍 Estado:')
    lines.push(`Stage: ${result.state.current_stage ?? 'none'}`)
    lines.push(`Next: ${result.state.next_step ?? 'none'}`)
  }

  if (result.tasks?.items?.length) {
    lines.push('')
    lines.push('🧩 Tasks:')
    result.tasks.items.forEach((task) => {
      lines.push(`- ${task.title}`)
    })
  }

  return lines.join('\n')
}
