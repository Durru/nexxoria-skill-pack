#!/usr/bin/env node

import { runInitCommand } from './commands/init.js'
import { runContinueCommand } from './commands/continue.js'
import { runPromptCommand } from './commands/prompt.js'

const [, , command, ...args] = process.argv

const printUsage = (): void => {
  console.log([
    'Usage:',
    '  nexxoria init',
    '  nexxoria continue',
    '  nexxoria prompt "your prompt"',
  ].join('\n'))
}

const main = async (): Promise<void> => {
  const projectRoot = process.cwd()

  switch (command) {
    case 'init': {
      console.log(await runInitCommand(projectRoot))
      return
    }

    case 'continue': {
      console.log(await runContinueCommand(projectRoot))
      return
    }

    case 'prompt': {
      const prompt = args.join(' ').trim()
      console.log(await runPromptCommand(projectRoot, prompt))
      return
    }

    default: {
      printUsage()
      process.exitCode = 1
    }
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown CLI error'
  console.error(`Nexxoria CLI error: ${message}`)
  process.exitCode = 1
})
