# Nexxoria Context Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist Nexxoria’s synthesized conversation context and draft artifacts into `.nexxoria/context/` so valuable conversational understanding survives across sessions instead of existing only in runtime memory.

**Architecture:** Keep onboarding responsible for base repository understanding, keep conversation-context responsible for synthesizing smart conversational signals, and add a small persistence layer that writes deduplicated context summaries, draft content, and next-step guidance into stable markdown artifacts under `.nexxoria/context/`.

**Tech Stack:** Node.js runtime helpers, markdown persistence in `.nexxoria/context/`, OpenCode plugin bootstrap transform, lightweight text synthesis.

---

### Task 1: Add persistence helpers for conversation context artifacts

**Files:**
- Modify: `runtime/conversation-context.js`

- [ ] **Step 1: Add deduplication for known facts**

In `runtime/conversation-context.js`, add a helper like:

```js
const unique = (values) => [...new Set(values.filter(Boolean))]
```

Then replace the current `knownFacts` construction so it becomes:

```js
  const knownFacts = unique([
    `project type: ${onboarding.analysis.projectType}`,
    onboarding.analysis.summary ? `summary: ${onboarding.analysis.summary}` : null,
    ...extractBulletValues(contextContent),
    ...extractBulletValues(decisionsContent),
    ...extractBulletValues(architectureContent),
  ])
```

- [ ] **Step 2: Add markdown renderers for persisted context artifacts**

In `runtime/conversation-context.js`, add helpers like:

```js
const renderConversationContext = (context) => `# Conversation Context\n\nMode\n\n- ${context.mode}\n\nKnown Facts\n\n${context.knownFacts.map((item) => `- ${item}`).join('\n') || '- None yet'}\n\nUnresolved Questions\n\n${context.unresolvedQuestions.map((item) => `- ${item}`).join('\n') || '- None'}\n`

const renderDraft = (context) => {
  if (!context.draft) return '# Draft\n\n- No draft available yet\n'
  return `# Draft\n\nDescription\n\n- ${context.draft.description}\n\nSuggested Stages\n\n${context.draft.suggestedStages.map((item) => `- ${item}`).join('\n')}\n\nOrganization\n\n${context.draft.organization.map((item) => `- ${item}`).join('\n') || '- None yet'}\n`
}

const renderNextStep = (context) => `# Next Step\n\n- ${context.suggestedNextStep}\n\nQuestions Needed\n\n- ${context.shouldAskMore ? 'Yes' : 'No'}\n\nDraft Ready\n\n- ${context.shouldGenerateDraft ? 'Yes' : 'No'}\n`
```

- [ ] **Step 3: Add a persistence function that writes `.nexxoria/context/conversation.md`, `draft.md`, and `next-step.md`**

Still in `runtime/conversation-context.js`, add:

```js
const writeText = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

export const persistConversationContext = ({ projectRoot, context }) => {
  writeText(path.join(projectRoot, '.nexxoria/context/conversation.md'), renderConversationContext(context))
  writeText(path.join(projectRoot, '.nexxoria/context/draft.md'), renderDraft(context))
  writeText(path.join(projectRoot, '.nexxoria/context/next-step.md'), renderNextStep(context))
}
```

- [ ] **Step 4: Verify the runtime helper still imports after the new persistence code**

Run:

```bash
node - <<'PY'
import('./runtime/conversation-context.js')
  .then(() => console.log('conversation-context-persistence-import-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `conversation-context-persistence-import-ok`

### Task 2: Persist conversation artifacts from the plugin integration path

**Files:**
- Modify: `.opencode/plugins/nexxoria.js`

- [ ] **Step 1: Import the persistence function into the plugin**

Update the plugin import to:

```js
import { buildConversationContext, persistConversationContext } from '../../runtime/conversation-context.js'
```

- [ ] **Step 2: Persist conversation context right after it is built**

After building `conversationContext`, add:

```js
      persistConversationContext({
        projectRoot: targetDirectory,
        context: conversationContext,
      })
```

- [ ] **Step 3: Keep the plugin bootstrap text unchanged except for using the deduplicated context**

Do not add more bootstrap fields in this task; the persistence layer is the new value.

- [ ] **Step 4: Verify the plugin still imports successfully after persistence integration**

Run:

```bash
node - <<'PY'
import('./.opencode/plugins/nexxoria.js')
  .then(() => console.log('plugin-with-persistence-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `plugin-with-persistence-ok`

### Task 3: Update contracts and docs to reflect persisted conversation artifacts

**Files:**
- Modify: `README.md`
- Modify: `adapted/conversation/MODULE.md`
- Modify: `adapted/conversation/RULES.md`
- Modify: `modules/conversation/MODULE.md`
- Modify: `SKILL.md`
- Modify: `skills/nexxoria/SKILL.md`

- [ ] **Step 1: Update `README.md` to mention persisted conversation artifacts**

Add a section like:

```md
## Persisted conversation artifacts

Nexxoria persists conversational synthesis into:

- `.nexxoria/context/conversation.md`
- `.nexxoria/context/draft.md`
- `.nexxoria/context/next-step.md`

This allows future sessions to continue from structured context instead of restarting from scratch.
```

- [ ] **Step 2: Update `adapted/conversation/MODULE.md` to mention persisted conversation outputs**

Add wording like:

```md
Conversation should persist its synthesized understanding, draft, and next suggested step into `.nexxoria/context/`.
```

- [ ] **Step 3: Update `adapted/conversation/RULES.md` with persistence rules**

Add rules like:

```md
## Persistence rules

- Persist synthesized conversation context after onboarding-aware analysis.
- Persist drafts when enough context exists to generate them.
- Persist the current recommended next step.
```

- [ ] **Step 4: Update `modules/conversation/MODULE.md` to reference persisted artifacts**

Add language like:

```md
The module persists conversation synthesis into `.nexxoria/context/conversation.md`, `.nexxoria/context/draft.md`, and `.nexxoria/context/next-step.md`.
```

- [ ] **Step 5: Update `SKILL.md` and `skills/nexxoria/SKILL.md` so persistence is explicit**

Add or update wording so both files state that conversation must:

```md
- persist synthesized context
- persist draft artifacts when available
- persist the recommended next step
```

- [ ] **Step 6: Verify docs now reference the three new `.nexxoria/context/` files**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
files = ['README.md', 'adapted/conversation/MODULE.md', 'adapted/conversation/RULES.md', 'modules/conversation/MODULE.md', 'SKILL.md', 'skills/nexxoria/SKILL.md']
content = '\n'.join(Path(f).read_text() for f in files)
required = [
    '.nexxoria/context/conversation.md',
    '.nexxoria/context/draft.md',
    '.nexxoria/context/next-step.md',
]
missing = [item for item in required if item not in content]
print('missing=', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing= []`

### Task 4: Verify persisted context and draft artifacts for new and existing projects

**Files:**
- Test: temporary verification directories and OpenCode runtime checks

- [ ] **Step 1: Verify persistence for a new project prompt**

Run:

```bash
rm -rf .context-persistence-new && mkdir -p .context-persistence-new && node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
import { buildConversationContext, persistConversationContext } from './runtime/conversation-context.js'
const onboarding = onboardProject('./.context-persistence-new')
const context = buildConversationContext({
  projectRoot: onboarding.projectRoot,
  onboarding,
  userPrompt: 'quiero crear una app',
})
persistConversationContext({ projectRoot: onboarding.projectRoot, context })
console.log(JSON.stringify(context, null, 2))
PY
```

Expected evidence:
- `shouldGenerateDraft` is `true`
- `.nexxoria/context/conversation.md` exists
- `.nexxoria/context/draft.md` exists
- `.nexxoria/context/next-step.md` exists

- [ ] **Step 2: Verify persisted file contents for the new project case**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
base = Path('.context-persistence-new/.nexxoria/context')
for name in ['conversation.md', 'draft.md', 'next-step.md']:
    path = base / name
    print(f'--- {name} ---')
    print(path.read_text())
PY
```

Expected evidence:
- `conversation.md` contains known facts and unresolved questions
- `draft.md` contains description and suggested stages
- `next-step.md` contains the recommended next step

- [ ] **Step 3: Verify persistence for an existing repository prompt with deduplicated context**

Run:

```bash
rm -rf .context-persistence-existing && mkdir -p .context-persistence-existing/src && cat > .context-persistence-existing/README.md <<'EOF'
# Existing Persisted Demo

This project handles internal workflows.
EOF
cat > .context-persistence-existing/package.json <<'EOF'
{
  "name": "existing-persisted-demo",
  "private": true
}
EOF
node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
import { buildConversationContext, persistConversationContext } from './runtime/conversation-context.js'
const onboarding = onboardProject('./.context-persistence-existing')
const context = buildConversationContext({
  projectRoot: onboarding.projectRoot,
  onboarding,
  userPrompt: 'quiero seguir con esto',
})
persistConversationContext({ projectRoot: onboarding.projectRoot, context })
console.log(JSON.stringify(context, null, 2))
PY
```

Expected evidence:
- `mode` is `existing-project`
- `knownFacts` has no repeated duplicate entries
- persisted files exist under `.nexxoria/context/`

- [ ] **Step 4: Verify the plugin path still works with context persistence enabled**

Run:

```bash
OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-context-persistence" ./install.sh && OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-context-persistence" opencode run --print-logs "quiero seguir con esto"
```

Expected evidence:
- plugin still loads successfully
- no plugin crash after writing persisted conversation artifacts

- [ ] **Step 5: Commit the context persistence changes**

Run:

```bash
git add .
git commit -m "feat: persist Nexxoria conversation context"
```

Expected: one successful conventional commit.

---

## Self-Review

### Spec coverage
- Persist `conversation.md`, `draft.md`, and `next-step.md`: covered in Task 1 and Task 2.
- Deduplicate `knownFacts`: covered in Task 1.
- Keep continuity between sessions: covered in Task 2 and Task 3.
- Preserve plugin compatibility: covered in Task 2 and Task 4.

### Placeholder scan
- No `TODO`, `TBD`, or vague instructions remain.
- Every task uses exact file paths and explicit verification commands.

### Type and naming consistency
- Uses `.nexxoria/context/conversation.md`, `.nexxoria/context/draft.md`, and `.nexxoria/context/next-step.md` consistently.
- Uses `persistConversationContext()` consistently as the persistence entrypoint.
