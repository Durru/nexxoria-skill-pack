import { Nexxoria } from '../../../sdk/src/index.js'

export const runContinueCommand = async (projectRoot: string): Promise<string> => {
  const sdk = new Nexxoria({ projectRoot })
  const result = await sdk.handlePrompt('continue the current project flow')

  return [
    'Nexxoria continue',
    `status: ${result.status}`,
    `message: ${result.message}`,
    `current stage: ${result.state.current_stage ?? 'none'}`,
    `next step: ${result.state.next_step ?? 'none'}`,
  ].join('\n')
}
