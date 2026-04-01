import { Nexxoria } from '@nexxoria/sdk'
import { renderHandlePromptResult } from './render.js'

export const runContinueCommand = async (projectRoot: string): Promise<string> => {
  const sdk = new Nexxoria({ projectRoot })
  const result = await sdk.handlePrompt('continue the current project flow')

  return renderHandlePromptResult(result)
}
