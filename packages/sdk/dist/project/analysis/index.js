import path from 'node:path';
import { readJsonIfExists } from '../../runtime/json/index.js';
import { readTextIfExists, listVisibleEntries } from '../../runtime/fs/index.js';
export const readRepositorySnapshot = (projectRoot) => ({
    projectRoot,
    entries: listVisibleEntries(projectRoot, ['.nexxoria']),
    readme: readTextIfExists(path.join(projectRoot, 'README.md')),
    packageJson: readJsonIfExists(path.join(projectRoot, 'package.json'), null),
});
