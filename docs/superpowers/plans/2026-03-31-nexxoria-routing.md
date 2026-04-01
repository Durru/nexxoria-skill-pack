# Nexxoria Intelligent Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Nexxoria use persisted conversation artifacts and `next-step` information to decide the next module explicitly, persist routing decisions, and continue project guidance predictably across sessions.

**Architecture:** Keep conversation as the central user-facing layer, but add a dedicated routing runtime that reads persisted context artifacts, applies clear routing rules, and writes a routing artifact. The plugin should expose routing results to conversation so the system stops being merely reactive and starts guiding the next module transition intentionally.

**Tech Stack:** Node.js runtime helpers, markdown persistence in `.nexxoria/context/`, OpenCode plugin bootstrap transform, deterministic routing rules.

---

### Task 1: Add a runtime routing helper driven by persisted artifacts

**Files:**
- Create: `runtime/next-step-routing.js`
- Modify: `runtime/conversation-context.js`

- [ ] **Step 1: Create `runtime/next-step-routing.js` with deterministic routing rules**

Create `runtime/next-step-routing.js` with this implementation:

```js
import fs from 'node:fs'
import path from 'node:path'

const readIfExists = (filePath) => {
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8')
}

const extractBullets = (content) => {
  if (!content) return []
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
}

const hasStageStructure = (projectRoot) => fs.existsSync(path.join(projectRoot, '.nexxoria/stages/stage-1/STAGE.md'))
const hasTaskStructure = (projectRoot) => fs.existsSync(path.join(projectRoot, '.nexxoria/stages/stage-1/tasks/task-1/TASK.md'))

export const decideNextRoute = ({ projectRoot, conversationContext, userPrompt = '' }) => {
  const nextStepPath = path.join(projectRoot, '.nexxoria/context/next-step.md')
  const nextStepContent = readIfExists(nextStepPath) || ''
  const nextStepBullets = extractBullets(nextStepContent)
  const nextStep = nextStepBullets[0] || conversationContext.suggestedNextStep
  const prompt = userPrompt.toLowerCase()

  let targetModule = 'conversation'
  let reason = 'default conversation follow-up'
  let needsConfirmation = false
  let proposal = nextStep

  if (conversationContext.unresolvedQuestions.length > 0) {
    targetModule = 'conversation'
    reason = 'there are unresolved questions'
    proposal = 'Clarify the missing information before creating more structure.'
  } else if (prompt.includes('progress') || prompt.includes('estado') || prompt.includes('progreso')) {
    targetModule = 'state'
    reason = 'the user is asking about progress or current state'
    proposal = 'Summarize the current project state and identify what remains.'
  } else if (conversationContext.draft && !hasStageStructure(projectRoot)) {
    targetModule = 'planning'
    reason = 'a draft exists but stages are not yet established'
    proposal = 'Propose project stages from the current draft.'
    needsConfirmation = true
  } else if (hasStageStructure(projectRoot) && !hasTaskStructure(projectRoot)) {
    targetModule = 'tasks'
    reason = 'stages exist but tasks are missing'
    proposal = 'Create initial tasks from the defined stages.'
    needsConfirmation = true
  } else if (prompt.includes('task') || prompt.includes('tarea')) {
    targetModule = 'tasks'
    reason = 'the user is explicitly talking about tasks'
    proposal = 'Work on task creation or task updates.'
  } else if (prompt.includes('decision') || prompt.includes('error') || prompt.includes('arquitect')) {
    targetModule = 'memory'
    reason = 'the prompt points to decisions, errors, or architecture'
    proposal = 'Record the relevant changes in persistent memory.'
  } else if (nextStep.toLowerCase().includes('etapa') || nextStep.toLowerCase().includes('stage')) {
    targetModule = 'planning'
    reason = 'the persisted next step indicates stage definition'
    proposal = nextStep
    needsConfirmation = true
  } else if (nextStep.toLowerCase().includes('task') || nextStep.toLowerCase().includes('tarea')) {
    targetModule = 'tasks'
    reason = 'the persisted next step indicates task work'
    proposal = nextStep
    needsConfirmation = true
  }

  return {
    targetModule,
    reason,
    proposal,
    nextStep,
    needsConfirmation,
  }
}

export const persistRoutingDecision = ({ projectRoot, route }) => {
  const content = `# Routing\n\nTarget Module\n\n- ${route.targetModule}\n\nReason\n\n- ${route.reason}\n\nProposal\n\n- ${route.proposal}\n\nNext Step\n\n- ${route.nextStep}\n\nNeeds Confirmation\n\n- ${route.needsConfirmation ? 'Yes' : 'No'}\n`
  fs.mkdirSync(path.join(projectRoot, '.nexxoria/context'), { recursive: true })
  fs.writeFileSync(path.join(projectRoot, '.nexxoria/context/routing.md'), content, 'utf8')
}
```

- [ ] **Step 2: Extend `runtime/conversation-context.js` so it can expose routing-relevant hints without taking over routing responsibility**

Keep `buildConversationContext()` focused on context synthesis, but ensure it still returns:

```js
{
  mode,
  knownFacts,
  unresolvedQuestions,
  shouldAskMore,
  shouldGenerateDraft,
  suggestedNextStep,
  draft,
}
```

No routing logic should be moved into this file beyond what already exists.

- [ ] **Step 3: Verify the new routing runtime imports correctly**

Run:

```bash
node - <<'PY'
import('./runtime/next-step-routing.js')
  .then(() => console.log('next-step-routing-import-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `next-step-routing-import-ok`

### Task 2: Integrate routing decisions into the plugin bootstrap flow

**Files:**
- Modify: `.opencode/plugins/nexxoria.js`

- [ ] **Step 1: Import the routing runtime helpers into the plugin**

Add:

```js
import { decideNextRoute, persistRoutingDecision } from '../../runtime/next-step-routing.js'
```

- [ ] **Step 2: Compute routing after building/persisting conversation context**

After `conversationContext` is built and persisted, add:

```js
      const route = decideNextRoute({
        projectRoot: targetDirectory,
        conversationContext,
        userPrompt,
      })
```

- [ ] **Step 3: Persist the routing decision best-effort**

Add:

```js
      try {
        persistRoutingDecision({ projectRoot: targetDirectory, route })
      } catch (error) {
        console.warn('Nexxoria: failed to persist routing decision', error)
      }
```

- [ ] **Step 4: Inject routing information into the Nexxoria bootstrap text**

Add lines like:

```js
        `Routing target: ${route.targetModule}`,
        `Routing reason: ${route.reason}`,
        `Routing proposal: ${route.proposal}`,
        `Routing confirmation needed: ${route.needsConfirmation ? 'yes' : 'no'}`,
```

- [ ] **Step 5: Verify the plugin still imports successfully after routing integration**

Run:

```bash
node - <<'PY'
import('./.opencode/plugins/nexxoria.js')
  .then(() => console.log('plugin-with-routing-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `plugin-with-routing-ok`

### Task 3: Update conversation/module contracts to reflect explicit routing behavior

**Files:**
- Modify: `README.md`
- Modify: `adapted/conversation/MODULE.md`
- Modify: `adapted/conversation/RULES.md`
- Modify: `adapted/conversation/FLOWS.md`
- Modify: `modules/conversation/MODULE.md`
- Modify: `modules/planning/MODULE.md`
- Modify: `modules/tasks/MODULE.md`
- Modify: `modules/state/MODULE.md`
- Modify: `SKILL.md`
- Modify: `skills/nexxoria/SKILL.md`

- [ ] **Step 1: Update `README.md` to explain intelligent routing from persisted artifacts**

Add a section like:

```md
## Intelligent routing

Nexxoria reads persisted conversation artifacts and routing signals to decide whether the next step belongs to conversation, planning, tasks, memory, or state.

It persists the routing decision in:

- `.nexxoria/context/routing.md`
```

- [ ] **Step 2: Update `adapted/conversation/MODULE.md` to make routing explicit**

Add wording like:

```md
Conversation uses persisted next-step and routing artifacts to decide the next system move instead of responding generically.
```

- [ ] **Step 3: Update `adapted/conversation/RULES.md` with routing rules**

Add rules like:

```md
## Routing rules

- If unresolved questions exist, stay in conversation.
- If a draft exists but stages are not yet established, route toward planning.
- If stages exist but tasks are missing, route toward tasks.
- If the user asks for progress, route toward state.
- If the prompt is about decisions, errors, or architecture, route toward memory.
```

- [ ] **Step 4: Update `adapted/conversation/FLOWS.md` with a routing-driven continuation flow**

Add:

```md
## Flow — Continuation from persisted next step

Prompt → Read persisted context artifacts → Decide route → Propose next action → Ask for confirmation when needed → Continue through the chosen module
```

- [ ] **Step 5: Update module contracts so planning, tasks, and state are recognized as routing targets**

Add brief routing language:

In `modules/planning/MODULE.md`:

```md
Planning is a routing target when Nexxoria has enough project structure to define stages.
```

In `modules/tasks/MODULE.md`:

```md
Tasks is a routing target when stages exist or when the user explicitly asks to create or update work items.
```

In `modules/state/MODULE.md`:

```md
State is a routing target when the user wants progress, status, or current focus.
```

- [ ] **Step 6: Update `modules/conversation/MODULE.md`, `SKILL.md`, and `skills/nexxoria/SKILL.md` to state that conversation decides and persists routing**

Add or update wording so these files explicitly mention:

```md
- routing is decided from persisted artifacts and current prompt context
- the decision is persisted in `.nexxoria/context/routing.md`
- conversation remains the control center even when another module becomes the next target
```

- [ ] **Step 7: Verify docs now reference `.nexxoria/context/routing.md`**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
files = [
    'README.md',
    'adapted/conversation/MODULE.md',
    'adapted/conversation/RULES.md',
    'adapted/conversation/FLOWS.md',
    'modules/conversation/MODULE.md',
    'modules/planning/MODULE.md',
    'modules/tasks/MODULE.md',
    'modules/state/MODULE.md',
    'SKILL.md',
    'skills/nexxoria/SKILL.md',
]
content = '\n'.join(Path(f).read_text() for f in files)
needle = '.nexxoria/context/routing.md'
missing = needle not in content
print('missing=', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing= False`

### Task 4: Verify intelligent routing for both new and existing project continuations

**Files:**
- Test: temporary verification directories and OpenCode runtime checks

- [ ] **Step 1: Verify routing for a new project prompt with unresolved questions**

Run:

```bash
rm -rf .routing-new && mkdir -p .routing-new && node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
import { buildConversationContext, persistConversationContext } from './runtime/conversation-context.js'
import { decideNextRoute, persistRoutingDecision } from './runtime/next-step-routing.js'
const onboarding = onboardProject('./.routing-new')
const context = buildConversationContext({
  projectRoot: onboarding.projectRoot,
  onboarding,
  userPrompt: 'quiero crear una app',
})
persistConversationContext({ projectRoot: onboarding.projectRoot, context })
const route = decideNextRoute({
  projectRoot: onboarding.projectRoot,
  conversationContext: context,
  userPrompt: 'quiero crear una app',
})
persistRoutingDecision({ projectRoot: onboarding.projectRoot, route })
console.log(JSON.stringify(route, null, 2))
PY
```

Expected evidence:
- `targetModule` is `conversation`
- `reason` mentions unresolved questions

- [ ] **Step 2: Verify routing for an existing project continuation**

Run:

```bash
rm -rf .routing-existing && mkdir -p .routing-existing/src && cat > .routing-existing/README.md <<'EOF'
# Routing Demo

This project helps teams manage internal workflows.
EOF
cat > .routing-existing/package.json <<'EOF'
{
  "name": "routing-demo",
  "private": true
}
EOF
node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
import { buildConversationContext, persistConversationContext } from './runtime/conversation-context.js'
import { decideNextRoute, persistRoutingDecision } from './runtime/next-step-routing.js'
const onboarding = onboardProject('./.routing-existing')
const context = buildConversationContext({
  projectRoot: onboarding.projectRoot,
  onboarding,
  userPrompt: 'ok, seguimos',
})
persistConversationContext({ projectRoot: onboarding.projectRoot, context })
const route = decideNextRoute({
  projectRoot: onboarding.projectRoot,
  conversationContext: context,
  userPrompt: 'ok, seguimos',
})
persistRoutingDecision({ projectRoot: onboarding.projectRoot, route })
console.log(JSON.stringify(route, null, 2))
PY
```

Expected evidence:
- routing result is not generic restart behavior
- `targetModule` is contextually appropriate (`planning` or `conversation`, depending on unresolved state)
- `.nexxoria/context/routing.md` exists

- [ ] **Step 3: Verify progress-oriented routing goes to `state`**

Run:

```bash
node - <<'PY'
import { decideNextRoute } from './runtime/next-step-routing.js'
const route = decideNextRoute({
  projectRoot: './.routing-existing',
  conversationContext: {
    unresolvedQuestions: [],
    draft: { description: 'ok', suggestedStages: ['a'], organization: ['b'] },
    suggestedNextStep: 'summarize findings and propose how to continue',
  },
  userPrompt: 'muéstrame el progreso actual',
})
console.log(JSON.stringify(route, null, 2))
PY
```

Expected evidence:
- `targetModule` is `state`

- [ ] **Step 4: Verify OpenCode still loads the plugin with routing enabled**

Run:

```bash
OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-routing" ./install.sh && OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-routing" opencode run --print-logs "ok, seguimos"
```

Expected evidence:
- plugin still loads successfully
- no crash after routing integration
- routing info is now part of the Nexxoria bootstrap context

- [ ] **Step 5: Commit the intelligent routing changes**

Run:

```bash
git add .
git commit -m "feat: add Nexxoria routing intelligence"
```

Expected: one successful conventional commit.

---

## Self-Review

### Spec coverage
- Use `next_step` as a routing driver: covered in Task 1 and Task 2.
- Route automatically across conversation/planning/tasks/memory/state: covered in Task 1 and Task 3.
- Keep user confirmation where appropriate: covered in Task 1 and Task 2.
- Continue from persisted state between sessions: covered in Task 2 and Task 4.
- Persist routing decisions in `.nexxoria/context/routing.md`: covered in Task 1 and Task 2.

### Placeholder scan
- No `TODO`, `TBD`, or vague implementation instructions remain.
- Every task uses exact file paths and explicit verification commands.

### Type and naming consistency
- Uses `runtime/next-step-routing.js` consistently.
- Uses `.nexxoria/context/routing.md` consistently.
- Uses `targetModule`, `reason`, `proposal`, `nextStep`, and `needsConfirmation` consistently.
