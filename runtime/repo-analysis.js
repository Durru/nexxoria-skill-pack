import fs from 'node:fs'
import path from 'node:path'

const readIfExists = (filePath) => {
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8')
}

const summarizeReadme = (content) => {
  if (!content) return null
  return content.split('\n').map((line) => line.trim()).filter(Boolean).slice(0, 8).join(' ')
}

export const analyzeRepository = (targetDirectory) => {
  const projectRoot = path.resolve(targetDirectory)
  const entries = fs.readdirSync(projectRoot, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.nexxoria'))
    .map((entry) => ({ name: entry.name, type: entry.isDirectory() ? 'dir' : 'file' }))

  const readme = readIfExists(path.join(projectRoot, 'README.md'))
  const packageJsonRaw = readIfExists(path.join(projectRoot, 'package.json'))
  const packageJson = packageJsonRaw ? JSON.parse(packageJsonRaw) : null

  const directories = entries.filter((entry) => entry.type === 'dir').map((entry) => entry.name)
  const files = entries.filter((entry) => entry.type === 'file').map((entry) => entry.name)

  const projectType = packageJson?.name
    ? 'node-project'
    : files.includes('go.mod')
      ? 'go-project'
      : files.includes('Cargo.toml')
        ? 'rust-project'
        : 'unknown-project'

  const architectureSignals = [
    directories.includes('src') ? 'has src directory' : null,
    directories.includes('app') ? 'has app directory' : null,
    directories.includes('components') ? 'has components directory' : null,
    directories.includes('packages') ? 'has packages directory' : null,
    files.includes('package.json') ? 'has package.json' : null,
    files.includes('README.md') ? 'has README.md' : null,
  ].filter(Boolean)

  const summary = summarizeReadme(readme)

  return {
    projectRoot,
    projectName: packageJson?.name || path.basename(projectRoot),
    projectType,
    summary,
    directories,
    files,
    architectureSignals,
    inferredDecisions: [
      projectType !== 'unknown-project' ? `project type inferred as ${projectType}` : null,
      packageJson?.private ? 'package appears private' : null,
    ].filter(Boolean),
    pendingQuestions: [
      summary ? null : 'What is the main goal of this project?',
      architectureSignals.length ? null : 'What are the main parts of this repository?',
    ].filter(Boolean),
  }
}
