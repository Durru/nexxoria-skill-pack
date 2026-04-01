import fs from 'node:fs'
import path from 'node:path'

type VisibleEntry = {
  name: string
  type: 'dir' | 'file'
}

export const ensureDir = (directoryPath: string): void => {
  fs.mkdirSync(directoryPath, { recursive: true })
}

export const writeFile = (filePath: string, content: string): void => {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf8')
}

export const readFile = (filePath: string): string => {
  return fs.readFileSync(filePath, 'utf8')
}

export const exists = (targetPath: string): boolean => {
  return fs.existsSync(targetPath)
}

export const readTextIfExists = (filePath: string): string | null => {
  if (!exists(filePath)) return null
  return readFile(filePath)
}

export const writeTextFile = (filePath: string, content: string): void => {
  writeFile(filePath, content)
}

export const listVisibleEntries = (
  directoryPath: string,
  excludedNames: string[] = []
): VisibleEntry[] => {
  return fs.readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry: fs.Dirent) => !excludedNames.includes(entry.name))
    .map((entry: fs.Dirent) => ({ name: entry.name, type: entry.isDirectory() ? 'dir' : 'file' }))
}
