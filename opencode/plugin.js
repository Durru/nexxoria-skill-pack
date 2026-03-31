import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const skillPath = resolve(root, 'SKILL.md')

function main() {
  const banner = [
    'Nexxoria Skill Pack',
    '',
    'Bootstrap status: base package ready.',
    'Primary system entrypoint: SKILL.md',
    'Primary runtime entrypoint: opencode/plugin.js',
    '',
    'This package currently ships:',
    '- the core system definition',
    '- the adapted conversation module',
    '- prepared internal module contracts',
    '- installation and bootstrap guidance',
    '',
    'To continue, read install/install.md and install/bootstrap.md.',
  ].join('\n')

  let skillTitle = 'SKILL.md not found'

  try {
    const content = readFileSync(skillPath, 'utf8')
    skillTitle = content.split('\n')[0] || skillTitle
  } catch {
    skillTitle = 'SKILL.md unavailable'
  }

  process.stdout.write(`${banner}\n\nLoaded system: ${skillTitle}\n`)
}

main()
