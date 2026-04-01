import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { Nexxoria } from '../../sdk/src/index.js'
import type { OpenCodeConfig, OpenCodeOutput } from './types.js'

const normalizePath = (value: string | undefined, homeDir: string): string | null => {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed === '~') return homeDir
  if (trimmed.startsWith('~/')) return path.join(homeDir, trimmed.slice(2))
  return path.resolve(trimmed)
}

const formatSdkResult = (result: Awaited<ReturnType<Nexxoria['handlePrompt']>>): string => {
  return [
    '<NEXXORIA_SDK>',
    `status: ${result.status}`,
    `message: ${result.message}`,
    `projectRoot: ${result.bootstrap.projectRoot}`,
    `nexxoriaRoot: ${result.bootstrap.nexxoriaRoot}`,
    `current_stage: ${result.state.current_stage ?? 'none'}`,
    `next_step: ${result.state.next_step ?? 'none'}`,
    `tasks: ${result.tasks.items.length}`,
    '</NEXXORIA_SDK>',
  ].join('\n')
}

export const createOpenCodeHandler = () => {
  const homeDir = os.homedir()
  const skillsDir = path.resolve(process.cwd(), 'skills')
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir)
  const configDir = envConfigDir || path.join(homeDir, '.config/opencode')
  const devFlagPath = path.resolve(process.cwd(), '.nexxoria-dev')

  const isDevMode = (): boolean => {
    if (process.env.NEXXORIA_DEV === 'true') return true
    if (process.env.NEXXORIA_DEV === 'false') return false
    return fs.existsSync(devFlagPath)
  }

  return {
    config: async (config: OpenCodeConfig) => {
      if (isDevMode()) return

      config.skills = config.skills || {}
      config.skills.paths = config.skills.paths || []

      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir)
      }

      config.nexxoria = config.nexxoria || {}
      config.nexxoria.entry = 'nexxoria'
      config.nexxoria.skillsDir = skillsDir
      config.nexxoria.configDir = configDir
    },

    'experimental.chat.messages.transform': async (_input: unknown, output: OpenCodeOutput) => {
      if (isDevMode()) return
      if (!output.messages?.length) return

      const firstUser = output.messages.find((message) => message.info?.role === 'user')
      if (!firstUser?.parts?.length) return

      const alreadyInjected = firstUser.parts.some(
        (part) => part.type === 'text' && part.text.includes('NEXXORIA_SDK')
      )

      if (alreadyInjected) return

      const prompt = firstUser.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n')

      const sdk = new Nexxoria({ projectRoot: process.cwd() })
      const result = await sdk.handlePrompt(prompt)
      const intro = formatSdkResult(result)
      const ref = firstUser.parts[0]

      firstUser.parts.unshift({ ...ref, type: 'text', text: intro })
    },
  }
}
