export declare const NexxoriaPlugin: () => Promise<{
    config: (config: import("./types.js").OpenCodeConfig) => Promise<void>;
    'experimental.chat.messages.transform': (_input: unknown, output: import("./types.js").OpenCodeOutput) => Promise<void>;
}>;
