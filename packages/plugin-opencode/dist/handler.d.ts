import type { OpenCodeConfig, OpenCodeOutput } from './types.js';
export declare const createOpenCodeHandler: () => {
    config: (config: OpenCodeConfig) => Promise<void>;
    'experimental.chat.messages.transform': (_input: unknown, output: OpenCodeOutput) => Promise<void>;
};
