import { readTextIfExists, writeTextFile } from '../fs/index.js'

export const writeJsonFile = (filePath: string, value: unknown): void => {
  writeTextFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

export const readJsonIfExists = <T>(filePath: string, fallback: T): T => {
  const content = readTextIfExists(filePath)
  if (!content) return fallback
  return JSON.parse(content) as T
}
