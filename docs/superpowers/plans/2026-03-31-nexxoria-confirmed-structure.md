# Nexxoria Confirmed Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Distinguish bootstrap-created scaffolding from user-confirmed project structure so Nexxoria can route more strongly into planning and tasks instead of treating bootstrap placeholders as if they were validated project structure.

**Architecture:** Keep bootstrap responsible for creating minimal filesystem scaffolding, but store confirmation state centrally in `.nexxoria/state/project_state.json`. Routing should use these explicit confirmation flags rather than inferring confirmation from the existence of bootstrap-created `STAGE.md` and `TASK.md` files.

**Tech Stack:** Node.js runtime helpers, JSON state persistence, markdown stage/task artifacts, deterministic routing rules.

---

### Task 1: Extend project state with explicit confirmation flags

**Files:**
- Modify: `runtime/bootstrap-project.js`
- Modify: `.nexxoria/state/project_state.json`

- [ ] **Step 1: Update bootstrap state shape to include confirmation flags**

In `runtime/bootstrap-project.js`, change the `project_state.json` content to:

```js
  '.nexxoria/state/project_state.json': JSON.stringify({
    currentStage: 'stage-1',
    currentTask: 'task-1',
    status: 'initialized',
    initializedBy: 'nexxoria',
    draftConfirmed: false,
    stagesConfirmed: false,
    tasksConfirmed: false,
  }, null, 2) + '\n',
```

- [ ] **Step 2: Update the repository’s current `.nexxoria/state/project_state.json` fixture to match the new shape**

Set `/srv/nexxoria-skill-pack/.nexxoria/state/project_state.json` to:

```json
{
  "currentStage": "stage-1",
  "currentTask": "task-1",
  "status": "initialized",
  "initializedBy": "nexxoria",
  "draftConfirmed": false,
  "stagesConfirmed": false,
  "tasksConfirmed": false
}
```

- [ ] **Step 3: Verify the new state file shape**

Run:

```bash
python3 - <<'PY'
import json
from pathlib import Path
data = json.loads(Path('.nexxoria/state/project_state.json').read_text())
required = ['draftConfirmed', 'stagesConfirmed', 'tasksConfirmed']
missing = [key for key in required if key not in data]
print('missing=', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing= []`

### Task 2: Add a runtime helper for reading and updating confirmation state

**Files:**
- Create: `runtime/project-state.js`

- [ ] **Step 1: Create `runtime/project-state.js`**

Create the file with this implementation:

```js
import fs from 'node:fs'
import path from 'node:path'

const defaultState = {
  currentStage: 'stage-1',
  currentTask: 'task-1',
  status: 'initialized',
  initializedBy: 'nexxoria',
  draftConfirmed: false,
  stagesConfirmed: false,
  tasksConfirmed: false,
}

export const getProjectState = (projectRoot) => {
  const filePath = path.join(projectRoot, '.nexxoria/state/project_state.json')
  if (!fs.existsSync(filePath)) return { ...defaultState }
  return { ...defaultState, ...JSON.parse(fs.readFileSync(filePath, 'utf8')) }
}

export const saveProjectState = (projectRoot, nextState) => {
  const filePath = path.join(projectRoot, '.nexxoria/state/project_state.json')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(nextState, null, 2) + '\n', 'utf8')
}
```

- [ ] **Step 2: Verify the new project-state helper imports correctly**

Run:

```bash
node - <<'PY'
import('./runtime/project-state.js')
  .then(() => console.log('project-state-import-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `project-state-import-ok`

### Task 3: Update routing to use confirmation flags instead of bootstrap file existence alone

**Files:**
- Modify: `runtime/next-step-routing.js`
- Modify: `runtime/conversation-context.js`

- [ ] **Step 1: Import project state into `runtime/next-step-routing.js`**

Add:

```js
import { getProjectState } from './project-state.js'
```

- [ ] **Step 2: Replace stage/task structure checks with confirmation-aware logic**

Inside `decideNextRoute()`, read state:

```js
  const state = getProjectState(projectRoot)
```

Then update the key rules to:

```js
  if (conversationContext.unresolvedQuestions.length > 0) {
    ... conversation ...
  } else if (prompt.includes('progress') || prompt.includes('estado') || prompt.includes('progreso')) {
    ... state ...
  } else if (conversationContext.draft && !state.draftConfirmed) {
    targetModule = 'conversation'
    reason = 'a draft exists but it has not been confirmed yet'
    proposal = 'Review the draft and confirm whether Nexxoria should use it as the project direction.'
    needsConfirmation = true
  } else if (state.draftConfirmed && !state.stagesConfirmed) {
    targetModule = 'planning'
    reason = 'the draft is confirmed but stages are not confirmed yet'
    proposal = 'Define and confirm project stages from the approved draft.'
    needsConfirmation = true
  } else if (state.stagesConfirmed && !state.tasksConfirmed) {
    targetModule = 'tasks'
    reason = 'stages are confirmed but tasks are not confirmed yet'
    proposal = 'Create the first confirmed tasks from the defined stages.'
    needsConfirmation = true
  }
```

- [ ] **Step 3: Remove reliance on `hasStageStructure()` and `hasTaskStructure()` for confirmation decisions**

Delete the helper functions:

```js
const hasStageStructure = ...
const hasTaskStructure = ...
```

The routing decision should now rely on explicit state flags instead of bootstrap scaffolding presence.

- [ ] **Step 4: Add confirmation visibility to conversation context**

In `runtime/conversation-context.js`, import `getProjectState` and include state facts in `knownFacts`, for example:

```js
import { getProjectState } from './project-state.js'
```

and inside `buildConversationContext()`:

```js
  const projectState = getProjectState(projectRoot)
```

then include:

```js
    `draft confirmed: ${projectState.draftConfirmed ? 'yes' : 'no'}`,
    `stages confirmed: ${projectState.stagesConfirmed ? 'yes' : 'no'}`,
    `tasks confirmed: ${projectState.tasksConfirmed ? 'yes' : 'no'}`,
```

- [ ] **Step 5: Verify routing runtime still imports successfully**

Run:

```bash
node - <<'PY'
import('./runtime/project-state.js')
import('./runtime/next-step-routing.js')
  .then(() => console.log('confirmation-routing-import-ok'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
PY
```

Expected: `confirmation-routing-import-ok`

### Task 4: Update contracts and docs to distinguish scaffolding from confirmed structure

**Files:**
- Modify: `README.md`
- Modify: `adapted/conversation/MODULE.md`
- Modify: `adapted/conversation/RULES.md`
- Modify: `modules/conversation/MODULE.md`
- Modify: `modules/planning/MODULE.md`
- Modify: `modules/tasks/MODULE.md`
- Modify: `modules/state/MODULE.md`
- Modify: `SKILL.md`
- Modify: `skills/nexxoria/SKILL.md`

- [ ] **Step 1: Update `README.md` to explain scaffolding vs confirmation**

Add a section like:

```md
## Bootstrap scaffolding vs confirmed structure

Nexxoria creates minimal stage/task scaffolding during bootstrap so the project has a working structure.

That scaffolding does not automatically mean the project has confirmed stages or confirmed tasks.

Confirmed project structure is tracked in `.nexxoria/state/project_state.json` using:

- `draftConfirmed`
- `stagesConfirmed`
- `tasksConfirmed`
```

- [ ] **Step 2: Update `adapted/conversation/MODULE.md`**

Add wording like:

```md
Conversation must distinguish bootstrap scaffolding from user-confirmed structure before routing aggressively into planning or tasks.
```

- [ ] **Step 3: Update `adapted/conversation/RULES.md`**

Add rules like:

```md
## Confirmation rules

- Bootstrap-created stage and task files are scaffolding, not proof of confirmation.
- Use `project_state.json` confirmation flags to decide whether routing can move from conversation to planning or tasks.
```

- [ ] **Step 4: Update `modules/conversation/MODULE.md`, `modules/planning/MODULE.md`, `modules/tasks/MODULE.md`, and `modules/state/MODULE.md`**

Add contract language so:

- conversation owns confirmation-aware routing decisions
- planning becomes the target after `draftConfirmed`
- tasks becomes the target after `stagesConfirmed`
- state reflects the current confirmation status as part of project progress

- [ ] **Step 5: Update `SKILL.md` and `skills/nexxoria/SKILL.md`**

Add wording like:

```md
- bootstrap scaffolding is not equivalent to confirmed structure
- confirmed structure is tracked in `.nexxoria/state/project_state.json`
- conversation uses confirmation flags to decide when to route toward planning and tasks
```

- [ ] **Step 6: Verify docs reference the three confirmation flags**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
files = [
    'README.md',
    'adapted/conversation/MODULE.md',
    'adapted/conversation/RULES.md',
    'modules/conversation/MODULE.md',
    'modules/planning/MODULE.md',
    'modules/tasks/MODULE.md',
    'modules/state/MODULE.md',
    'SKILL.md',
    'skills/nexxoria/SKILL.md',
]
content = '\n'.join(Path(f).read_text() for f in files)
required = ['draftConfirmed', 'stagesConfirmed', 'tasksConfirmed']
missing = [item for item in required if item not in content]
print('missing=', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing= []`

### Task 5: Verify stronger routing using confirmed-structure flags

**Files:**
- Test: temporary verification directories and runtime checks

- [ ] **Step 1: Verify a new project with unresolved questions still routes to conversation**

Run:

```bash
rm -rf .confirmed-routing-new && mkdir -p .confirmed-routing-new && node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
import { buildConversationContext, persistConversationContext } from './runtime/conversation-context.js'
import { decideNextRoute } from './runtime/next-step-routing.js'
const onboarding = onboardProject('./.confirmed-routing-new')
const context = buildConversationContext({
  projectRoot: onboarding.projectRoot,
  onboarding,
  userPrompt: 'quiero crear una app',
})
const route = decideNextRoute({
  projectRoot: onboarding.projectRoot,
  conversationContext: context,
  userPrompt: 'quiero crear una app',
})
console.log(JSON.stringify(route, null, 2))
PY
```

Expected evidence:
- `targetModule` is `conversation`
- `reason` mentions unresolved questions or unconfirmed draft

- [ ] **Step 2: Verify a confirmed draft routes to planning**

Run:

```bash
python3 - <<'PY'
import json
from pathlib import Path
state_path = Path('.confirmed-routing-new/.nexxoria/state/project_state.json')
data = json.loads(state_path.read_text())
data['draftConfirmed'] = True
state_path.write_text(json.dumps(data, indent=2) + '\n')
PY
node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
import { buildConversationContext, persistConversationContext } from './runtime/conversation-context.js'
import { decideNextRoute } from './runtime/next-step-routing.js'
const onboarding = onboardProject('./.confirmed-routing-new')
const context = buildConversationContext({
  projectRoot: onboarding.projectRoot,
  onboarding,
  userPrompt: 'ok, seguimos',
})
const route = decideNextRoute({
  projectRoot: onboarding.projectRoot,
  conversationContext: context,
  userPrompt: 'ok, seguimos',
})
console.log(JSON.stringify(route, null, 2))
PY
```

Expected evidence:
- `targetModule` is `planning`
- `reason` mentions confirmed draft and unconfirmed stages

- [ ] **Step 3: Verify confirmed stages route to tasks**

Run:

```bash
python3 - <<'PY'
import json
from pathlib import Path
state_path = Path('.confirmed-routing-new/.nexxoria/state/project_state.json')
data = json.loads(state_path.read_text())
data['draftConfirmed'] = True
data['stagesConfirmed'] = True
state_path.write_text(json.dumps(data, indent=2) + '\n')
PY
node - <<'PY'
import { onboardProject } from './runtime/onboarding.js'
import { buildConversationContext, persistConversationContext } from './runtime/conversation-context.js'
import { decideNextRoute } from './runtime/next-step-routing.js'
const onboarding = onboardProject('./.confirmed-routing-new')
const context = buildConversationContext({
  projectRoot: onboarding.projectRoot,
  onboarding,
  userPrompt: 'ok, seguimos',
})
const route = decideNextRoute({
  projectRoot: onboarding.projectRoot,
  conversationContext: context,
  userPrompt: 'ok, seguimos',
})
console.log(JSON.stringify(route, null, 2))
PY
```

Expected evidence:
- `targetModule` is `tasks`
- `reason` mentions confirmed stages and unconfirmed tasks

- [ ] **Step 4: Verify the route decision still persists to `.nexxoria/context/routing.md`**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
path = Path('.confirmed-routing-new/.nexxoria/context/routing.md')
print(path.exists())
if path.exists():
    print(path.read_text())
PY
```

Expected evidence:
- file exists
- content reflects the latest target module and reason

- [ ] **Step 5: Verify OpenCode still loads the plugin after confirmation-aware routing changes**

Run:

```bash
OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-confirmed-routing" ./install.sh && OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-confirmed-routing" opencode run --print-logs "ok, seguimos"
```

Expected evidence:
- plugin still loads successfully
- no crash occurs after confirmation-aware routing integration

- [ ] **Step 6: Commit the confirmed-structure routing changes**

Run:

```bash
git add .
git commit -m "feat: distinguish confirmed project structure"
```

Expected: one successful conventional commit.

---

## Self-Review

### Spec coverage
- Add `draftConfirmed`, `stagesConfirmed`, and `tasksConfirmed`: covered in Task 1 and Task 2.
- Bootstrap initializes them: covered in Task 1.
- Routing uses confirmation flags instead of bootstrap scaffolding presence: covered in Task 3.
- Docs explain scaffolding vs confirmed structure: covered in Task 4.
- Verification covers conversation → planning → tasks progression: covered in Task 5.

### Placeholder scan
- No `TODO`, `TBD`, or vague implementation guidance remains.
- Every task includes exact file paths and explicit verification commands.

### Type and naming consistency
- Uses `draftConfirmed`, `stagesConfirmed`, and `tasksConfirmed` consistently.
- Uses `runtime/project-state.js` as the state helper consistently.
- Uses confirmation-aware routing language consistently.
