import { Nexxoria } from '@nexxoria/sdk'
import { renderHandlePromptResult } from './render.js'

export const runStatusCommand = async (projectRoot: string): Promise<string> => {
  const sdk = new Nexxoria({ projectRoot })
  const result = await sdk.handlePrompt('status')

  return renderHandlePromptResult(result)
}
