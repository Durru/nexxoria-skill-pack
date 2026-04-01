import { readTextIfExists, writeTextFile } from '../fs/index.js';
export const writeJsonFile = (filePath, value) => {
    writeTextFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
};
export const readJsonIfExists = (filePath, fallback) => {
    const content = readTextIfExists(filePath);
    if (!content)
        return fallback;
    return JSON.parse(content);
};
