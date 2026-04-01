import { Nexxoria } from '@nexxoria/sdk';
import { renderHandlePromptResult } from './render.js';
export const runPromptCommand = async (projectRoot, prompt) => {
    const sdk = new Nexxoria({ projectRoot });
    const result = await sdk.handlePrompt(prompt);
    return renderHandlePromptResult(result);
};
