import { Nexxoria } from '../../../sdk/src/index.js'

export const runPromptCommand = async (projectRoot: string, prompt: string): Promise<string> => {
  const sdk = new Nexxoria({ projectRoot })
  const result = await sdk.handlePrompt(prompt)

  return [
    'Nexxoria prompt',
    `status: ${result.status}`,
    `message: ${result.message}`,
    `current stage: ${result.state.current_stage ?? 'none'}`,
    `next step: ${result.state.next_step ?? 'none'}`,
    `tasks: ${result.tasks.items.length}`,
  ].join('\n')
}
