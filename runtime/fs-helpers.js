import fs from 'node:fs'
import path from 'node:path'

export const readTextIfExists = (filePath) => {
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8')
}

export const writeTextFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

export const writeJsonFile = (filePath, value) => {
  writeTextFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

export const readJsonIfExists = (filePath, fallback = null) => {
  const content = readTextIfExists(filePath)
  if (!content) return fallback
  return JSON.parse(content)
}

export const ensureDirectory = (directoryPath) => {
  fs.mkdirSync(directoryPath, { recursive: true })
}

export const listVisibleEntries = (directoryPath, excludedNames = []) => {
  return fs.readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => !excludedNames.includes(entry.name))
    .map((entry) => ({ name: entry.name, type: entry.isDirectory() ? 'dir' : 'file' }))
}

export const pathExists = (targetPath) => fs.existsSync(targetPath)
