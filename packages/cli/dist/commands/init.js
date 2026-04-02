import { Nexxoria } from '@nexxoria/sdk';
import { renderHandlePromptResult } from './render.js';
export const runInitCommand = async (projectRoot) => {
    const sdk = new Nexxoria({ projectRoot });
    const bootstrap = sdk.bootstrapIfNeeded();
    const followUpPrompt = bootstrap.created || bootstrap.repaired
        ? 'quiero organizar este proyecto'
        : 'status';
    const result = await sdk.handlePrompt(followUpPrompt);
    return renderHandlePromptResult(result);
};
