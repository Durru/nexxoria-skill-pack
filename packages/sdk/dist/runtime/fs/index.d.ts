type VisibleEntry = {
    name: string;
    type: 'dir' | 'file';
};
export declare const ensureDir: (directoryPath: string) => void;
export declare const writeFile: (filePath: string, content: string) => void;
export declare const readFile: (filePath: string) => string;
export declare const exists: (targetPath: string) => boolean;
export declare const readTextIfExists: (filePath: string) => string | null;
export declare const writeTextFile: (filePath: string, content: string) => void;
export declare const listVisibleEntries: (directoryPath: string, excludedNames?: string[]) => VisibleEntry[];
export {};
