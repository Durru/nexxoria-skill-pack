# Nexxoria Conversation Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Nexxoria conversation actively use onboarding results and global memory so it avoids redundant questions, adapts between new and existing projects, and generates intelligent drafts when enough information is already available.

**Architecture:** Add a dedicated conversation-context runtime layer that consumes onboarding output plus persisted `.nexxoria` memory and turns it into structured conversational guidance. Keep the plugin as the integration boundary, but move context synthesis into a reusable runtime helper that decides known facts, unresolved gaps, suggested next step, and draft candidates.

**Tech Stack:** Node.js runtime helpers, markdown memory files under `.nexxoria/`, OpenCode plugin bootstrap transform, heuristic conversation synthesis.

---

### Task 1: Add a runtime helper that synthesizes conversation context from onboarding and `.nexxoria` memory

**Files:**
- Create: `runtime/conversation-context.js`
- Modify: `runtime/onboarding.js`

- [ ] **Step 1: Create `runtime/conversation-context.js` with structured synthesis helpers**

Create `runtime/conversation-context.js` with this implementation:

```js
import fs from 'node:fs'
import path from 'node:path'

const readIfExists = (filePath) => {
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8')
}

const extractBulletValues = (content) => {
  if (!content) return []
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
}

const buildDraft = ({ mode, analysis, knownFacts }) => {
  const summary = analysis.summary || 'Project direction still needs confirmation'
  const stageSuggestion = mode === 'existing-project'
    ? ['Understand current structure', 'Plan next change', 'Implement safely']
    : ['Define scope', 'Build core', 'Refine and ship']

  return {
    description: summary,
    suggestedStages: stageSuggestion,
    organization: knownFacts.slice(0, 5),
  }
}

export const buildConversationContext = ({ projectRoot, onboarding, userPrompt = '' }) => {
  const contextPath = path.join(projectRoot, '.nexxoria/context/global.md')
  const decisionsPath = path.join(projectRoot, '.nexxoria/memory/global/decisions.md')
  const architecturePath = path.join(projectRoot, '.nexxoria/memory/global/architecture.md')

  const contextContent = readIfExists(contextPath)
  const decisionsContent = readIfExists(decisionsPath)
  const architectureContent = readIfExists(architecturePath)

  const knownFacts = [
    `project type: ${onboarding.analysis.projectType}`,
    onboarding.analysis.summary ? `summary: ${onboarding.analysis.summary}` : null,
    ...extractBulletValues(contextContent),
    ...extractBulletValues(decisionsContent),
    ...extractBulletValues(architectureContent),
  ].filter(Boolean)

  const mode = onboarding.detection.appearsExistingRepo ? 'existing-project' : 'new-project'
  const unresolvedQuestions = onboarding.analysis.pendingQuestions.filter(Boolean)

  const enoughForDraft = mode === 'existing-project'
    ? Boolean(onboarding.analysis.summary || onboarding.analysis.architectureSignals.length)
    : userPrompt.trim().length > 0

  return {
    mode,
    knownFacts,
    unresolvedQuestions,
    shouldAskMore: unresolvedQuestions.length > 0,
    shouldGenerateDraft: enoughForDraft,
    suggestedNextStep: mode === 'existing-project'
      ? 'summarize findings and propose how to continue'
      : 'clarify the project goal and propose an initial structure',
    draft: enoughForDraft ? buildDraft({ mode, analysis: onboarding.analysis, knownFacts }) : null,
  }
}
```

- [ ] **Step 2: Extend `runtime/onboarding.js` so it returns a stable project root and leaves room for conversation synthesis**

Ensure the returned object from `onboardProject()` includes:

```js
  return {
    projectRoot,
    detection,
    bootstrapResult,
    analysis,
    onboardingCompleted: true,
  }
```

- [ ] **Step 3: Verify the new helper imports correctly**

Run:

```bash
node - <<'PY'
import('./runtime/conversation-context.js')
  .then(() => console.log('conversation-context-import-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `conversation-context-import-ok`

### Task 2: Integrate conversation context synthesis into the plugin bootstrap

**Files:**
- Modify: `.opencode/plugins/nexxoria.js`

- [ ] **Step 1: Import the conversation context runtime helper into the plugin**

Add:

```js
import { buildConversationContext } from '../../runtime/conversation-context.js'
```

- [ ] **Step 2: Build conversation context from onboarding and the current user prompt**

Inside `'experimental.chat.messages.transform'`, after onboarding is resolved, add:

```js
      const userPrompt = firstUser.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n')

      const conversationContext = buildConversationContext({
        projectRoot: targetDirectory,
        onboarding,
        userPrompt,
      })
```

- [ ] **Step 3: Inject structured conversation-awareness into the bootstrap text**

Extend the intro block to include lines like:

```js
        `Conversation mode: ${conversationContext.mode}`,
        `Known facts: ${conversationContext.knownFacts.length ? conversationContext.knownFacts.join(' | ') : 'None yet'}`,
        `Suggested next step: ${conversationContext.suggestedNextStep}`,
        `Should ask more questions: ${conversationContext.shouldAskMore ? 'yes' : 'no'}`,
        `Should generate draft: ${conversationContext.shouldGenerateDraft ? 'yes' : 'no'}`,
```

- [ ] **Step 4: Inject draft content when available**

If `conversationContext.draft` exists, append lines like:

```js
        `Draft description: ${conversationContext.draft.description}`,
        `Draft stages: ${conversationContext.draft.suggestedStages.join(' | ')}`,
        `Draft organization: ${conversationContext.draft.organization.join(' | ') || 'None yet'}`,
```

- [ ] **Step 5: Verify the plugin still imports successfully with the new runtime helper**

Run:

```bash
node - <<'PY'
import('./.opencode/plugins/nexxoria.js')
  .then(() => console.log('plugin-with-conversation-context-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `plugin-with-conversation-context-ok`

### Task 3: Update conversation contracts so they explicitly use onboarding and memory instead of asking from zero

**Files:**
- Modify: `adapted/conversation/MODULE.md`
- Modify: `adapted/conversation/RULES.md`
- Modify: `adapted/conversation/FLOWS.md`
- Modify: `modules/conversation/MODULE.md`
- Modify: `SKILL.md`
- Modify: `skills/nexxoria/SKILL.md`

- [ ] **Step 1: Update `adapted/conversation/MODULE.md` to state that conversation consumes onboarding and global memory actively**

Add wording like:

```md
Conversation must actively use onboarding results and global memory instead of treating each session like a blank start.
```

- [ ] **Step 2: Update `adapted/conversation/RULES.md` to forbid redundant questions**

Add rules like:

```md
## Context usage rules

- Do not ask for facts already inferred by onboarding or stored in global memory.
- Prefer summarizing what Nexxoria already knows before asking follow-up questions.
- Ask only the questions that remain unresolved.
- If enough context exists, generate a draft before asking more.
```

- [ ] **Step 3: Update `adapted/conversation/FLOWS.md` with distinct new-project and existing-repo response patterns**

Add or refine flows like:

```md
## Flow — Existing repo continuation

Prompt → Use onboarding summary → Present what Nexxoria already knows → Propose next step → Ask only unresolved questions

## Flow — New project guided start

Prompt → Use known prompt signal → Ask only missing essentials → Generate draft → Ask user to review and refine
```

- [ ] **Step 4: Update `modules/conversation/MODULE.md` so the contract references onboarding + conversation context synthesis**

Add language like:

```md
The module consumes onboarding output and synthesized conversation context to avoid redundant questioning and to generate drafts when enough information is already available.
```

- [ ] **Step 5: Update `SKILL.md` and `skills/nexxoria/SKILL.md` so conversation intelligence is explicit**

Add or update wording so both files say that conversation must:

```md
- use onboarding analysis and global memory actively
- avoid redundant questions
- generate drafts automatically when enough context exists
- summarize existing repositories before asking what remains unresolved
```

- [ ] **Step 6: Verify conversation docs now include anti-redundancy and draft behavior**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
files = [
    'adapted/conversation/MODULE.md',
    'adapted/conversation/RULES.md',
    'adapted/conversation/FLOWS.md',
    'modules/conversation/MODULE.md',
    'SKILL.md',
    'skills/nexxoria/SKILL.md',
]
content = '\n'.join(Path(f).read_text().lower() for f in files)
required = ['global memory', 'redundant', 'draft']
missing = [item for item in required if item not in content]
print('missing=', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing= []`

### Task 4: Verify context-aware conversation behavior for both new and existing project cases

**Files:**
- Test: temporary verification directories and OpenCode runtime logs

- [ ] **Step 1: Verify conversation context for a new project prompt**

Run:

```bash
rm -rf .conversation-context-new && mkdir -p .conversation-context-new && node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
import { buildConversationContext } from './runtime/conversation-context.js'
const onboarding = onboardProject('./.conversation-context-new')
const context = buildConversationContext({
  projectRoot: onboarding.projectRoot,
  onboarding,
  userPrompt: 'quiero crear una app',
})
console.log(JSON.stringify(context, null, 2))
PY
```

Expected evidence:
- `mode` is `new-project`
- `shouldGenerateDraft` is `true`
- draft content exists

- [ ] **Step 2: Verify conversation context for an existing repo prompt**

Run:

```bash
rm -rf .conversation-context-existing && mkdir -p .conversation-context-existing/src && cat > .conversation-context-existing/README.md <<'EOF'
# Existing Demo

This project manages internal operations for a team.
EOF
cat > .conversation-context-existing/package.json <<'EOF'
{
  "name": "existing-demo",
  "private": true
}
EOF
node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
import { buildConversationContext } from './runtime/conversation-context.js'
const onboarding = onboardProject('./.conversation-context-existing')
const context = buildConversationContext({
  projectRoot: onboarding.projectRoot,
  onboarding,
  userPrompt: 'quiero seguir con esto',
})
console.log(JSON.stringify(context, null, 2))
PY
```

Expected evidence:
- `mode` is `existing-project`
- `knownFacts` contains inferred project info
- `suggestedNextStep` says to summarize findings and propose how to continue
- no generic restart-from-zero behavior appears in the result

- [ ] **Step 3: Verify the OpenCode plugin now injects richer conversation context into bootstrap**

Run:

```bash
OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-conversation-context" ./install.sh && OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-conversation-context" opencode run --print-logs "quiero seguir con esto"
```

Expected evidence in logs:
- plugin still loads successfully
- Nexxoria skill still loads
- no plugin crash occurs after adding conversation-context integration

- [ ] **Step 4: Commit the conversation intelligence changes**

Run:

```bash
git add .
git commit -m "feat: improve Nexxoria conversation context"
```

Expected: one successful conventional commit.

---

## Self-Review

### Spec coverage
- Use onboarding results actively: covered in Task 1 and Task 2.
- Read and use global memory: covered in Task 1.
- Avoid redundant questions: covered in Task 3.
- Generate drafts automatically when enough information exists: covered in Task 1, Task 2, and Task 4.
- Adapt behavior for new vs existing projects: covered in Task 1, Task 3, and Task 4.
- Keep conversation as the central control layer: covered in Task 3.

### Placeholder scan
- No `TODO`, `TBD`, or vague instructions remain.
- Every task includes explicit file paths and verification commands.

### Type and naming consistency
- Uses `runtime/conversation-context.js` consistently.
- Uses `new-project` and `existing-project` consistently.
- Uses `knownFacts`, `unresolvedQuestions`, `shouldAskMore`, and `shouldGenerateDraft` consistently.
