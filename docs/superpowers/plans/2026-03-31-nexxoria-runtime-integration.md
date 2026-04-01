# Nexxoria Runtime Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate conversation, plugin, and runtime helpers so Nexxoria automatically initializes or repairs `.nexxoria/`, analyzes existing repositories heuristically, fills global memory, and then continues the guided flow for both new and existing projects.

**Architecture:** Keep the OpenCode plugin lightweight as the integration boundary, and move filesystem/project logic into focused runtime helpers. Use one onboarding runtime to coordinate project detection, bootstrap, repository analysis, structure repair, and initial memory/context generation before the conversation skill continues guiding the user.

**Tech Stack:** OpenCode plugin hooks, Node.js runtime helpers, filesystem reads/writes, lightweight repo heuristics from visible files and directories, markdown and JSON persistence.

---

### Task 1: Add runtime helpers for project detection, repository analysis, and onboarding orchestration

**Files:**
- Create: `runtime/project-detection.js`
- Create: `runtime/repo-analysis.js`
- Create: `runtime/onboarding.js`
- Modify: `runtime/bootstrap-project.js`

- [ ] **Step 1: Create `runtime/project-detection.js` for initialization state detection**

Create `runtime/project-detection.js` with this implementation:

```js
import fs from 'node:fs'
import path from 'node:path'

const REQUIRED_PATHS = [
  '.nexxoria/context/global.md',
  '.nexxoria/memory/global/decisions.md',
  '.nexxoria/memory/global/errors.md',
  '.nexxoria/memory/global/architecture.md',
  '.nexxoria/memory/stages/stage-1/memory.md',
  '.nexxoria/stages/stage-1/STAGE.md',
  '.nexxoria/stages/stage-1/tasks/task-1/TASK.md',
  '.nexxoria/state/project_state.json',
  '.nexxoria/logs',
]

export const detectProjectState = (targetDirectory) => {
  const projectRoot = path.resolve(targetDirectory)
  const nexxoriaRoot = path.join(projectRoot, '.nexxoria')
  const exists = fs.existsSync(nexxoriaRoot)

  const missing = REQUIRED_PATHS.filter((relativePath) => !fs.existsSync(path.join(projectRoot, relativePath)))

  const visibleEntries = fs.readdirSync(projectRoot, { withFileTypes: true })
    .filter((entry) => entry.name !== '.nexxoria' && entry.name !== '.git')
    .map((entry) => entry.name)

  return {
    projectRoot,
    nexxoriaRoot,
    initialized: exists && missing.length === 0,
    hasNexxoria: exists,
    missing,
    appearsExistingRepo: visibleEntries.length > 0,
    visibleEntries,
  }
}
```

- [ ] **Step 2: Create `runtime/repo-analysis.js` for lightweight existing-repo heuristics**

Create `runtime/repo-analysis.js` with this implementation:

```js
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
```

- [ ] **Step 3: Create `runtime/onboarding.js` to orchestrate detection, bootstrap, repair, and memory writes**

Create `runtime/onboarding.js` with this implementation:

```js
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
    detection,
    bootstrapResult,
    analysis,
    onboardingCompleted: true,
  }
}
```

- [ ] **Step 4: Expand `runtime/bootstrap-project.js` so it can be reused for repair flows without overwriting files**

Keep the current implementation but make sure its public contract remains:

```js
export const bootstrapProject = (targetDirectory) => { ... }
```

and that it continues to create missing directories/files only.

- [ ] **Step 5: Verify the new runtime helper set loads without syntax errors**

Run:

```bash
node - <<'PY'
import('./runtime/project-detection.js')
import('./runtime/repo-analysis.js')
import('./runtime/onboarding.js')
  .then(() => console.log('runtime-imports-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `runtime-imports-ok`

### Task 2: Integrate onboarding into the OpenCode plugin so it runs before guided conversation

**Files:**
- Modify: `.opencode/plugins/nexxoria.js`

- [ ] **Step 1: Import the onboarding runtime into the plugin**

At the top of `.opencode/plugins/nexxoria.js`, add:

```js
import { onboardProject } from '../../runtime/onboarding.js'
```

- [ ] **Step 2: Track onboarding per session directory to avoid repeated filesystem work on every turn**

Add a module-level cache:

```js
const onboardingCache = new Map()
```

- [ ] **Step 3: Run onboarding inside the first-user-message transform when needed**

Inside `'experimental.chat.messages.transform'`, before composing the intro text, add logic like:

```js
      const targetDirectory = process.cwd()
      let onboarding = onboardingCache.get(targetDirectory)
      if (!onboarding) {
        onboarding = onboardProject(targetDirectory)
        onboardingCache.set(targetDirectory, onboarding)
      }
```

- [ ] **Step 4: Inject onboarding results into the Nexxoria bootstrap text**

Extend the intro text to include lines like:

```js
        `Project initialized: ${onboarding.detection.hasNexxoria ? 'existing or repaired' : 'new bootstrap'}`,
        `Project type: ${onboarding.analysis.projectType}`,
        `Project summary: ${onboarding.analysis.summary || 'Not inferred yet'}`,
        `Pending questions: ${onboarding.analysis.pendingQuestions.length ? onboarding.analysis.pendingQuestions.join(' | ') : 'None'}`,
```

- [ ] **Step 5: Keep plugin config behavior unchanged while adding onboarding integration**

Ensure the `config` hook still registers the `skills` path and keeps:

```js
config.nexxoria.entry = 'nexxoria'
config.nexxoria.skillsDir = skillsDir
config.nexxoria.configDir = configDir
```

- [ ] **Step 6: Verify the plugin still loads after the onboarding integration**

Run:

```bash
node - <<'PY'
import('./.opencode/plugins/nexxoria.js')
  .then(() => console.log('plugin-import-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `plugin-import-ok`

### Task 3: Make the skill and docs reflect automatic onboarding for new and existing repositories

**Files:**
- Modify: `SKILL.md`
- Modify: `skills/nexxoria/SKILL.md`
- Modify: `README.md`
- Modify: `system/repo-analysis.md`
- Modify: `system/project-detection.md`
- Modify: `system/onboarding.md`

- [ ] **Step 1: Update `SKILL.md` and `skills/nexxoria/SKILL.md` with explicit existing-repo onboarding behavior**

Add or update wording so both files state:

```md
- if `.nexxoria/` is missing, bootstrap it automatically
- if `.nexxoria/` is incomplete, repair missing parts automatically
- if the repository already exists, analyze it heuristically
- fill global memory with an initial summary, visible structure, architecture signals, inferred decisions, and pending questions
```

- [ ] **Step 2: Update `README.md` to explain new-project vs existing-repo automatic behavior**

Add a section like:

```md
## Automatic onboarding behavior

For new projects, Nexxoria bootstraps `.nexxoria/`, initializes memory, and starts guided conversation.

For existing repositories, Nexxoria creates or repairs `.nexxoria/`, analyzes the repository heuristically, writes initial global memory, and then asks only the questions that remain unresolved.
```

- [ ] **Step 3: Replace placeholder content in `system/repo-analysis.md` with active runtime behavior notes**

Use content like:

```md
# Repository Analysis System

## Purpose

- inspect an existing repository when Nexxoria enters a non-empty project
- infer project type, visible structure, and architecture signals
- produce useful onboarding memory without requiring a build

## Active runtime

The runtime helper lives at `runtime/repo-analysis.js` and uses lightweight heuristics from visible files and directories.
```

- [ ] **Step 4: Replace placeholder content in `system/project-detection.md` with active runtime behavior notes**

Use content like:

```md
# Project Detection System

## Purpose

- determine whether the current directory is a new project, existing repo, initialized Nexxoria project, or incomplete Nexxoria project

## Active runtime

The runtime helper lives at `runtime/project-detection.js` and checks `.nexxoria/` plus required structural paths.
```

- [ ] **Step 5: Replace placeholder content in `system/onboarding.md` with the real onboarding flow**

Use content like:

```md
# Onboarding System

## Purpose

- initialize or repair `.nexxoria/`
- analyze repositories when they already exist
- write initial global memory
- provide a useful starting point for conversation

## Active runtime

The runtime helper lives at `runtime/onboarding.js` and coordinates project detection, bootstrap, repair, analysis, and initial memory writes.
```

- [ ] **Step 6: Verify docs now reference the active runtime files**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
required = {
    'system/repo-analysis.md': 'runtime/repo-analysis.js',
    'system/project-detection.md': 'runtime/project-detection.js',
    'system/onboarding.md': 'runtime/onboarding.js',
}
missing = [f'{path}:{needle}' for path, needle in required.items() if needle not in Path(path).read_text()]
print('missing=', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing= []`

### Task 4: Verify runtime onboarding for both new-project and existing-repository scenarios

**Files:**
- Test: runtime verification in temporary directories

- [ ] **Step 1: Verify bootstrap + onboarding for a new project directory**

Run:

```bash
rm -rf .runtime-onboarding-new && mkdir -p .runtime-onboarding-new && node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
const result = onboardProject('./.runtime-onboarding-new')
console.log(JSON.stringify({
  hasNexxoria: result.detection.hasNexxoria,
  initialized: result.bootstrapResult.initialized,
  projectType: result.analysis.projectType,
  pendingQuestions: result.analysis.pendingQuestions,
}, null, 2))
PY
```

Expected evidence:

```json
{
  "hasNexxoria": false,
  "initialized": true,
  "projectType": "new-project"
}
```

- [ ] **Step 2: Verify onboarding fills global memory for a new project**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
base = Path('.runtime-onboarding-new/.nexxoria')
checks = [
    'context/global.md',
    'memory/global/decisions.md',
    'memory/global/errors.md',
    'memory/global/architecture.md',
]
missing = [item for item in checks if not (base / item).exists()]
print('missing=', missing)
print((base / 'context/global.md').read_text())
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing= []` and populated context content.

- [ ] **Step 3: Verify onboarding for an existing repository directory**

Run:

```bash
rm -rf .runtime-onboarding-existing && mkdir -p .runtime-onboarding-existing/src && cat > .runtime-onboarding-existing/README.md <<'EOF'
# Demo Repo

This is a sample existing repository used to verify Nexxoria onboarding.
EOF
cat > .runtime-onboarding-existing/package.json <<'EOF'
{
  "name": "demo-repo",
  "private": true
}
EOF
node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
const result = onboardProject('./.runtime-onboarding-existing')
console.log(JSON.stringify({
  appearsExistingRepo: result.detection.appearsExistingRepo,
  projectType: result.analysis.projectType,
  projectName: result.analysis.projectName,
  summary: result.analysis.summary,
  architectureSignals: result.analysis.architectureSignals,
}, null, 2))
PY
```

Expected evidence includes:

```json
{
  "appearsExistingRepo": true,
  "projectType": "node-project",
  "projectName": "demo-repo"
}
```

- [ ] **Step 4: Verify onboarding writes useful global memory for an existing repository**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
base = Path('.runtime-onboarding-existing/.nexxoria/memory/global')
for file_name in ['decisions.md', 'errors.md', 'architecture.md']:
    file_path = base / file_name
    print(f'--- {file_name} ---')
    print(file_path.read_text())
PY
```

Expected evidence:
- `decisions.md` mentions inferred project type
- `architecture.md` mentions visible structure signals

- [ ] **Step 5: Verify OpenCode still loads the plugin with runtime onboarding integrated**

Run:

```bash
OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-runtime-integration" ./install.sh && OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-runtime-integration" opencode run --print-logs "use skill tool to load nexxoria"
```

Expected evidence in logs:

```text
installed nexxoria@github:Durru/nexxoria-skill-pack
```

and the Nexxoria plugin continues to load successfully.

- [ ] **Step 6: Commit the runtime integration changes**

Run:

```bash
git add .
git commit -m "feat: integrate Nexxoria runtime onboarding"
```

Expected: one successful conventional commit.

---

## Self-Review

### Spec coverage
- Automatic `.nexxoria/` bootstrap for new projects: covered in Task 1 and Task 4.
- Detection and repair of incomplete `.nexxoria/` structures: covered in Task 1.
- Existing repo heuristic analysis: covered in Task 1 and Task 4.
- Global memory filled with useful repo information: covered in Task 1 and Task 4.
- Plugin integration with automatic onboarding: covered in Task 2.
- Conversation/system docs aligned with automatic onboarding: covered in Task 3.

### Placeholder scan
- No `TODO`, `TBD`, or vague steps remain.
- Every task uses exact file paths and explicit commands.

### Type and naming consistency
- Uses `.nexxoria/` consistently.
- Uses `runtime/bootstrap-project.js`, `runtime/project-detection.js`, `runtime/repo-analysis.js`, and `runtime/onboarding.js` consistently.
- Uses `nexxoria` as the only skill name.
