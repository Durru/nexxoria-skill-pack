import path from 'node:path'
import { listVisibleEntries, readJsonIfExists, readTextIfExists } from './fs-helpers.js'

export const readRepositorySnapshot = (projectRoot) => {
  const entries = listVisibleEntries(projectRoot, ['.nexxoria'])
  const readme = readTextIfExists(path.join(projectRoot, 'README.md'))
  const packageJson = readJsonIfExists(path.join(projectRoot, 'package.json'))

  return {
    projectRoot,
    entries,
    readme,
    packageJson,
  }
}
