import { Nexxoria } from '@nexxoria/sdk';
import { renderHandlePromptResult } from './render.js';
export const runContinueCommand = async (projectRoot) => {
    const sdk = new Nexxoria({ projectRoot });
    const result = await sdk.handlePrompt('continue the current project flow');
    return renderHandlePromptResult(result);
};
