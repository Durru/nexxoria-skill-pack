import path from 'node:path'
import { readJsonIfExists } from '../../runtime/json/index.js'
import { readTextIfExists, listVisibleEntries } from '../../runtime/fs/index.js'

export interface RepositorySnapshot {
  projectRoot: string
  entries: Array<{ name: string; type: 'dir' | 'file' }>
  readme: string | null
  packageJson: Record<string, unknown> | null
}

export const readRepositorySnapshot = (projectRoot: string): RepositorySnapshot => ({
  projectRoot,
  entries: listVisibleEntries(projectRoot, ['.nexxoria']),
  readme: readTextIfExists(path.join(projectRoot, 'README.md')),
  packageJson: readJsonIfExists<Record<string, unknown> | null>(path.join(projectRoot, 'package.json'), null),
})
