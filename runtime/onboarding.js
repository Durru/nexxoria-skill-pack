import fs from 'node:fs'
import path from 'node:path'
import { bootstrapProject } from './bootstrap-project.js'
import { detectProjectState } from './project-detection.js'
import { analyzeRepository } from './repo-analysis.js'

const writeText = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

const renderGlobalContext = (analysis) => `# Global Context\n\n- Project: ${analysis.projectName}\n- Type: ${analysis.projectType}\n- Summary: ${analysis.summary || 'Not inferred yet'}\n`

const renderDecisions = (analysis) => `# Global Decisions\n\n${analysis.inferredDecisions.map((item) => `- ${item}`).join('\n') || '- No inferred decisions yet'}\n`

const renderErrors = () => '# Global Errors\n\n- No major errors recorded during onboarding\n'

const renderArchitecture = (analysis) => `# Global Architecture\n\n${analysis.architectureSignals.map((item) => `- ${item}`).join('\n') || '- Architecture not inferred yet'}\n`

export const onboardProject = (targetDirectory) => {
  const detection = detectProjectState(targetDirectory)
  const bootstrapResult = (!detection.hasNexxoria || detection.missing.length > 0)
    ? bootstrapProject(targetDirectory)
    : { createdDirs: [], createdFiles: [], initialized: true }

  const analysis = detection.appearsExistingRepo ? analyzeRepository(targetDirectory) : {
    projectRoot: path.resolve(targetDirectory),
    projectName: path.basename(path.resolve(targetDirectory)),
    projectType: 'new-project',
    summary: 'New project initialization in progress',
    directories: [],
    files: [],
    architectureSignals: ['fresh Nexxoria bootstrap'],
    inferredDecisions: ['project is being initialized from a new prompt'],
    pendingQuestions: ['What is the main goal of this project?', 'What should the project be called?'],
  }

  const projectRoot = path.resolve(targetDirectory)
  writeText(path.join(projectRoot, '.nexxoria/context/global.md'), renderGlobalContext(analysis))
  writeText(path.join(projectRoot, '.nexxoria/memory/global/decisions.md'), renderDecisions(analysis))
  writeText(path.join(projectRoot, '.nexxoria/memory/global/errors.md'), renderErrors())
  writeText(path.join(projectRoot, '.nexxoria/memory/global/architecture.md'), renderArchitecture(analysis))

  return {
    projectRoot,
    detection,
    bootstrapResult,
    analysis,
    onboardingCompleted: true,
  }
}
