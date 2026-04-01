import fs from 'node:fs';
import path from 'node:path';
export const ensureDir = (directoryPath) => {
    fs.mkdirSync(directoryPath, { recursive: true });
};
export const writeFile = (filePath, content) => {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf8');
};
export const readFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
};
export const exists = (targetPath) => {
    return fs.existsSync(targetPath);
};
export const readTextIfExists = (filePath) => {
    if (!exists(filePath))
        return null;
    return readFile(filePath);
};
export const writeTextFile = (filePath, content) => {
    writeFile(filePath, content);
};
export const listVisibleEntries = (directoryPath, excludedNames = []) => {
    return fs.readdirSync(directoryPath, { withFileTypes: true })
        .filter((entry) => !excludedNames.includes(entry.name))
        .map((entry) => ({ name: entry.name, type: entry.isDirectory() ? 'dir' : 'file' }));
};
