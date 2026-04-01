import { NexxoriaOptions, BootstrapResult, HandlePromptResult } from './core/types/index.js';
export declare class Nexxoria {
    private readonly projectRoot;
    constructor(options?: NexxoriaOptions);
    bootstrapIfNeeded(): BootstrapResult;
    handlePrompt(prompt: string): Promise<HandlePromptResult>;
}
