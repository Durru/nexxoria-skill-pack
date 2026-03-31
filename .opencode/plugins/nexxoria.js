import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const normalizePath = (value, homeDir) => {
  if (!value || typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed === '~') return homeDir
  if (trimmed.startsWith('~/')) return path.join(homeDir, trimmed.slice(2))
  return path.resolve(trimmed)
}

const readSkillBootstrap = (skillsDir) => {
  const skillPath = path.join(skillsDir, 'nexxoria', 'SKILL.md')
  if (!fs.existsSync(skillPath)) return null

  const fullContent = fs.readFileSync(skillPath, 'utf8')
  const match = fullContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  return match ? match[2] : fullContent
}

export const NexxoriaPlugin = async () => {
  const homeDir = os.homedir()
  const skillsDir = path.resolve(__dirname, '../../skills')
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir)
  const configDir = envConfigDir || path.join(homeDir, '.config/opencode')

  const bootstrap = readSkillBootstrap(skillsDir)

  return {
    config: async (config) => {
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

    'experimental.chat.messages.transform': async (_input, output) => {
      if (!bootstrap || !output.messages?.length) return

      const firstUser = output.messages.find((message) => message.info?.role === 'user')
      if (!firstUser || !Array.isArray(firstUser.parts) || !firstUser.parts.length) return

      const alreadyInjected = firstUser.parts.some(
        (part) => part.type === 'text' && part.text.includes('NEXXORIA_BOOTSTRAP')
      )

      if (alreadyInjected) return

      const intro = [
        '<NEXXORIA_BOOTSTRAP>',
        'You have the Nexxoria system available in this OpenCode session.',
        'The primary OpenCode skill is already installed as `nexxoria`.',
        'Conversation is the mandatory first module.',
        'Treat external source skills as reference logic only, not direct runtime behavior.',
        'Use the Nexxoria system to guide intent, ask clarifying questions when required, and route work into internal modules.',
        '',
        bootstrap,
        '</NEXXORIA_BOOTSTRAP>'
      ].join('\n')

      const ref = firstUser.parts[0]
      firstUser.parts.unshift({ ...ref, type: 'text', text: intro })
    }
  }
}
