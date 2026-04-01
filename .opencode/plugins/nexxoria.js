import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { onboardProject } from '../../runtime/onboarding.js'
import { buildConversationContext, persistConversationContext } from '../../runtime/conversation-context.js'
import { decideNextRoute, persistRoutingDecision } from '../../runtime/next-step-routing.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const onboardingCache = new Map()

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

      const targetDirectory = process.cwd()
      let onboarding = onboardingCache.get(targetDirectory)
      if (!onboarding) {
        onboarding = onboardProject(targetDirectory)
        onboardingCache.set(targetDirectory, onboarding)
      }

      const userPrompt = firstUser.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n')

      const conversationContext = buildConversationContext({
        projectRoot: targetDirectory,
        onboarding,
        userPrompt,
      })

      try {
        persistConversationContext({
          projectRoot: targetDirectory,
          context: conversationContext,
        })
      } catch (error) {
        console.warn('Nexxoria: failed to persist conversation context', error)
      }

      const route = decideNextRoute({
        projectRoot: targetDirectory,
        conversationContext,
        userPrompt,
      })

      try {
        persistRoutingDecision({ projectRoot: targetDirectory, route })
      } catch (error) {
        console.warn('Nexxoria: failed to persist routing decision', error)
      }

      const intro = [
        '<NEXXORIA_BOOTSTRAP>',
        'You have the Nexxoria system available in this OpenCode session.',
        'The primary OpenCode skill is already installed as `nexxoria`.',
        'Conversation is the mandatory first module and controls system flow.',
        'If project structure is missing, Nexxoria should bootstrap `.nexxoria/` automatically.',
        'Treat external source skills as reference logic only, not direct runtime behavior.',
        'Use internal modules for planning, tasks, memory, state, context, and errors.',
        'Use the Nexxoria system to guide intent, ask clarifying questions when required, and route work into internal modules.',
        `Project initialized: ${onboarding.detection.hasNexxoria ? 'existing or repaired' : 'new bootstrap'}`,
        `Project type: ${onboarding.analysis.projectType}`,
        `Project summary: ${onboarding.analysis.summary || 'Not inferred yet'}`,
        `Pending questions: ${onboarding.analysis.pendingQuestions.length ? onboarding.analysis.pendingQuestions.join(' | ') : 'None'}`,
        `Conversation mode: ${conversationContext.mode}`,
        `Known facts: ${conversationContext.knownFacts.length ? conversationContext.knownFacts.join(' | ') : 'None yet'}`,
        `Suggested next step: ${conversationContext.suggestedNextStep}`,
        `Should ask more questions: ${conversationContext.shouldAskMore ? 'yes' : 'no'}`,
        `Should generate draft: ${conversationContext.shouldGenerateDraft ? 'yes' : 'no'}`,
        `Routing target: ${route.targetModule}`,
        `Routing reason: ${route.reason}`,
        `Routing proposal: ${route.proposal}`,
        `Routing confirmation needed: ${route.needsConfirmation ? 'yes' : 'no'}`,
        ...(conversationContext.draft
          ? [
              `Draft description: ${conversationContext.draft.description}`,
              `Draft stages: ${conversationContext.draft.suggestedStages.join(' | ')}`,
              `Draft organization: ${conversationContext.draft.organization.join(' | ') || 'None yet'}`,
            ]
          : []),
        '',
        bootstrap,
        '</NEXXORIA_BOOTSTRAP>'
      ].join('\n')

      const ref = firstUser.parts[0]
      firstUser.parts.unshift({ ...ref, type: 'text', text: intro })
    }
  }
}
