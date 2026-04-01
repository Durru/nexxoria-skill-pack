# Nexxoria Base System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full Nexxoria MVP base inside this repository so conversation becomes the operational center, `.nexxoria/` bootstraps automatically, memory is structured, and all modules have clean contracts without breaking the current OpenCode activation.

**Architecture:** Keep OpenCode activation intact while extending the system through internal module contracts and filesystem templates. Treat conversation as the orchestration layer that can detect missing project structure, trigger bootstrap, draft project scaffolding, and route into planning, tasks, memory, state, context, and errors.

**Tech Stack:** Markdown module contracts, OpenCode plugin skill bootstrap, Bash bootstrap verification, repository templates, Git-based package activation.

---

## Source Logic Integration Rule

This implementation must reuse useful logic already preserved from superpowers instead of inventing Nexxoria behavior from scratch where a good upstream pattern already exists.

### Required source inputs already present in the repo

- `sources/conversation/using-superpowers/SOURCE.md`
- `sources/conversation/brainstorming/SOURCE.md`

### How to use source logic

- Keep source files preserved and unchanged as references.
- Extract behavioral patterns, not runtime coupling.
- Adapt those patterns into Nexxoria-owned module contracts and flows.
- Where a module inherits logic from an upstream source, document that relationship in the module docs.

### Minimum required adaptation in this plan

- Conversation must explicitly absorb orchestration logic from `using-superpowers`.
- Conversation must explicitly absorb clarification, optioning, and design guidance logic from `brainstorming`.
- Memory, planning, tasks, state, context, and errors must be written as Nexxoria-owned modules, but may reference conversation-derived logic that came from those sources.

### Additional module source mapping requirement

If other superpowers skills already present in the repository provide useful patterns for a module, capture that logic into the corresponding Nexxoria module documentation without making the external skill the direct runtime entrypoint.

---

### Task 1: Clean repository scaffolding and define persistent `.nexxoria` structure

**Files:**
- Modify: `.gitignore`
- Create: `templates/project_state.md`
- Create: `templates/bootstrap/.nexxoria/project/brief.md`
- Create: `templates/bootstrap/.nexxoria/project/state.md`
- Create: `templates/bootstrap/.nexxoria/project/context.md`
- Create: `templates/bootstrap/.nexxoria/memory/global.md`
- Create: `templates/bootstrap/.nexxoria/memory/stages/README.md`
- Create: `templates/bootstrap/.nexxoria/memory/tags/README.md`
- Create: `templates/bootstrap/.nexxoria/stages/index.md`
- Create: `templates/bootstrap/.nexxoria/tasks/index.md`
- Create: `templates/bootstrap/.nexxoria/logs/decisions.md`
- Create: `templates/bootstrap/.nexxoria/logs/errors.md`
- Create: `templates/bootstrap/.nexxoria/logs/changes.md`
- Create: `templates/bootstrap/.nexxoria/logs/architecture.md`

- [ ] **Step 1: Update ignore rules for transient OpenCode debug folders**

Add these lines to `.gitignore` if they are missing:

```gitignore
tmp/superpowers/
.tmp-opencode-config/
.tmp-opencode-config-verify/
.debug-opencode/
.debug-opencode-local/
.debug-opencode-remote/
```

- [ ] **Step 2: Add the missing top-level project state template**

Create `templates/project_state.md` with this content:

```md
# Project State

Current Stage

- [Name the active stage]

Current Focus

- [Describe what the system is actively progressing]

Next Decision

- [Describe the next important project-level decision]

Risks

- [List active risks or blockers]
```

- [ ] **Step 3: Add bootstrap-ready project templates under `templates/bootstrap/.nexxoria/project/`**

Create `templates/bootstrap/.nexxoria/project/brief.md`:

```md
# Project Brief

Objective

- [Describe the project goal]

Project Name

- [Set the project name]

References

- [List references or inspirations]

Initial Draft

- [Conversation-generated draft goes here]
```
Create `templates/bootstrap/.nexxoria/project/state.md`:

```md
# Project State

Current Stage

- Setup

Current Focus

- Bootstrap project structure

Next Decision

- Validate the initial draft with the user

Risks

- Missing clarity about scope or priorities
```

Create `templates/bootstrap/.nexxoria/project/context.md`:

```md
# Project Context

Summary

- [System-generated summary of the project situation]

Key Constraints

- [List known constraints]

Open Questions

- [Track unresolved questions]
```

- [ ] **Step 4: Add bootstrap-ready memory structure templates**

Create `templates/bootstrap/.nexxoria/memory/global.md`:

```md
# Global Memory

Project Identity

- [Persistent project identity and purpose]

Core Decisions

- [Important decisions that remain relevant across the whole project]

Architecture Notes

- [High-level architectural notes]

Important Changes

- [Track changes that affect the overall project]
```

Create `templates/bootstrap/.nexxoria/memory/stages/README.md`:

```md
# Stage Memory

Each stage memory file stores stage-local decisions, progress, blockers, and context.
```

Create `templates/bootstrap/.nexxoria/memory/tags/README.md`:

```md
# Tag Memory

Tag memory files store transversal knowledge such as ui, auth, infra, bugs, or domain-specific topics.
```

- [ ] **Step 5: Add bootstrap-ready stages, tasks, and logs templates**

Create `templates/bootstrap/.nexxoria/stages/index.md`:

```md
# Stages Index

Stage 1 — Setup

- [Bootstrap and initial clarification]
```

Create `templates/bootstrap/.nexxoria/tasks/index.md`:

```md
# Tasks Index

Pending

- [Track pending intention-based tasks]

In Progress

- [Track active tasks]

Completed

- [Track completed tasks]
```

Create `templates/bootstrap/.nexxoria/logs/decisions.md`:

```md
# Decisions Log

- [Record important project decisions]
```

Create `templates/bootstrap/.nexxoria/logs/errors.md`:

```md
# Errors Log

- [Record errors, causes, and resolutions]
```

Create `templates/bootstrap/.nexxoria/logs/changes.md`:

```md
# Changes Log

- [Track meaningful project changes]
```

Create `templates/bootstrap/.nexxoria/logs/architecture.md`:

```md
# Architecture Log

- [Track architectural decisions and structural notes]
```

- [ ] **Step 6: Verify the new bootstrap template tree exists**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
required = [
    'templates/project_state.md',
    'templates/bootstrap/.nexxoria/project/brief.md',
    'templates/bootstrap/.nexxoria/project/state.md',
    'templates/bootstrap/.nexxoria/project/context.md',
    'templates/bootstrap/.nexxoria/memory/global.md',
    'templates/bootstrap/.nexxoria/memory/stages/README.md',
    'templates/bootstrap/.nexxoria/memory/tags/README.md',
    'templates/bootstrap/.nexxoria/stages/index.md',
    'templates/bootstrap/.nexxoria/tasks/index.md',
    'templates/bootstrap/.nexxoria/logs/decisions.md',
    'templates/bootstrap/.nexxoria/logs/errors.md',
    'templates/bootstrap/.nexxoria/logs/changes.md',
    'templates/bootstrap/.nexxoria/logs/architecture.md',
]
missing = [p for p in required if not Path(p).exists()]
print('missing:', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing: []`

### Task 2: Restructure all internal modules into full module directories

**Files:**
- Create: `modules/conversation/MODULE.md`
- Create: `modules/conversation/RULES.md`
- Create: `modules/conversation/FLOWS.md`
- Create: `modules/planning/MODULE.md`
- Create: `modules/planning/RULES.md`
- Create: `modules/planning/FLOWS.md`
- Create: `modules/tasks/MODULE.md`
- Create: `modules/tasks/RULES.md`
- Create: `modules/tasks/FLOWS.md`
- Create: `modules/memory/MODULE.md`
- Create: `modules/memory/RULES.md`
- Create: `modules/memory/FLOWS.md`
- Create: `modules/state/MODULE.md`
- Create: `modules/state/RULES.md`
- Create: `modules/state/FLOWS.md`
- Create: `modules/context/MODULE.md`
- Create: `modules/context/RULES.md`
- Create: `modules/context/FLOWS.md`
- Create: `modules/errors/MODULE.md`
- Create: `modules/errors/RULES.md`
- Create: `modules/errors/FLOWS.md`
- Delete: `modules/conversation.md`
- Delete: `modules/planning.md`
- Delete: `modules/tasks.md`
- Delete: `modules/memory.md`
- Delete: `modules/state.md`
- Delete: `modules/context.md`

- [ ] **Step 1: Create the conversation module directory as the canonical internal module contract**

Create `modules/conversation/MODULE.md`:

```md
# Conversation Module

Conversation is the operating center of Nexxoria.

It always enters first, interprets intention, detects whether project structure exists, triggers bootstrap when needed, generates drafts, and routes to the appropriate internal module.
```

Create `modules/conversation/RULES.md`:

```md
# Conversation Rules

- Enter first on every new prompt.
- Detect if `.nexxoria/` exists.
- Trigger bootstrap automatically if it does not exist.
- Ask clarifying questions only when they unlock better routing.
- Propose options when multiple valid paths exist.
- Generate drafts for new projects.
- Re-enter when ambiguity, change, doubt, or conflict appears.
```

Create `modules/conversation/FLOWS.md`:

```md
# Conversation Flows

Prompt → Intention detection → Structure check → Bootstrap if missing → Questions/draft → Routing decision → Response
```

- [ ] **Step 2: Create planning, tasks, and memory module directories with basic but explicit contracts**

Create `modules/planning/MODULE.md`:

```md
# Planning Module

Planning turns clarified intent into stage-based execution when staged structure is justified.
```

Create `modules/planning/RULES.md`:

```md
# Planning Rules

- Use stages only when functionally justified.
- Keep stages user-meaningful, not technical.
- Accept conversation outputs as input.
```

Create `modules/planning/FLOWS.md`:

```md
# Planning Flows

Conversation output → Stage proposal → Validation → Stage index update
```

Create `modules/tasks/MODULE.md`:

```md
# Tasks Module

Tasks track intention-based units of work and their progression.
```

Create `modules/tasks/RULES.md`:

```md
# Tasks Rules

- A task represents intention, not technical size.
- Tasks should remain understandable to the user.
- Tasks may be linked to stages when stages exist.
```

Create `modules/tasks/FLOWS.md`:

```md
# Tasks Flows

Conversation or planning output → Task creation/update → Task state tracking
```

Create `modules/memory/MODULE.md`:

```md
# Memory Module

Memory persists project knowledge across the system in global, stage, and tag scopes.
```

Create `modules/memory/RULES.md`:

```md
# Memory Rules

- Keep global memory always present.
- Keep stage memory whenever stages exist.
- Use tag memory for transversal knowledge.
- Persist decisions, errors, architecture, and changes.
```

Create `modules/memory/FLOWS.md`:

```md
# Memory Flows

Conversation/planning/tasks/state/context → Memory write decision → Target memory scope update
```

- [ ] **Step 3: Create state, context, and errors module directories with clean contracts**

Create `modules/state/MODULE.md`:

```md
# State Module

State reflects current project status, active focus, and workflow progression.
```

Create `modules/state/RULES.md`:

```md
# State Rules

- Keep project status visible.
- Reflect current active stage and focus when known.
- Avoid stale state.
```

Create `modules/state/FLOWS.md`:

```md
# State Flows

Conversation/planning/tasks output → Project state update
```

Create `modules/context/MODULE.md`:

```md
# Context Module

Context maintains the current shared understanding of the project situation.
```

Create `modules/context/RULES.md`:

```md
# Context Rules

- Keep relevant context current.
- Link the current request to project history.
- Provide continuity for new and existing projects.
```

Create `modules/context/FLOWS.md`:

```md
# Context Flows

Conversation/state/memory changes → Context refresh
```

Create `modules/errors/MODULE.md`:

```md
# Errors Module

Errors tracks failures, causes, resolutions, and unresolved issues.
```

Create `modules/errors/RULES.md`:

```md
# Errors Rules

- Record important failures.
- Preserve root cause when known.
- Link errors to decisions or architecture when relevant.
```

Create `modules/errors/FLOWS.md`:

```md
# Errors Flows

Conversation/tasks/memory detection → Error log update → Related module context refresh
```

- [ ] **Step 4: Remove the old flat module files after the directory structure exists**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
for old in [
    'modules/conversation.md',
    'modules/planning.md',
    'modules/tasks.md',
    'modules/memory.md',
    'modules/state.md',
    'modules/context.md',
]:
    p = Path(old)
    if p.exists():
        p.unlink()
PY
```

- [ ] **Step 5: Verify every module now has `MODULE.md`, `RULES.md`, and `FLOWS.md`**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
modules = ['conversation', 'planning', 'tasks', 'memory', 'state', 'context', 'errors']
missing = []
for name in modules:
    for doc in ['MODULE.md', 'RULES.md', 'FLOWS.md']:
        p = Path('modules') / name / doc
        if not p.exists():
            missing.append(str(p))
print('missing:', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing: []`

### Task 2.5: Map preserved source logic into the Nexxoria module system

**Files:**
- Modify: `adapted/conversation/SOURCE_MAP.md`
- Modify: `adapted/conversation/MODULE.md`
- Modify: `adapted/conversation/RULES.md`
- Modify: `adapted/conversation/FLOWS.md`
- Create: `adapted/planning/SOURCE_MAP.md`
- Create: `adapted/tasks/SOURCE_MAP.md`
- Create: `adapted/memory/SOURCE_MAP.md`
- Create: `adapted/state/SOURCE_MAP.md`
- Create: `adapted/context/SOURCE_MAP.md`
- Create: `adapted/errors/SOURCE_MAP.md`

- [ ] **Step 1: Expand the conversation source map to document absorbed upstream logic clearly**

Update `adapted/conversation/SOURCE_MAP.md` so it includes sections like:

```md
## Absorbed logic

### From using-superpowers
- skill-first orchestration mindset
- routing discipline
- requirement to choose the right workflow before acting

### From brainstorming
- clarification through ordered questions
- options with tradeoffs and recommendation
- draft-first guidance for underdefined work
```

- [ ] **Step 2: Add source-map placeholders for every other Nexxoria module**

Create `adapted/planning/SOURCE_MAP.md`:

```md
# Planning Module — Source Map

## Source inputs
- conversation-derived logic from adapted conversation module

## Goal in Nexxoria
Turn clarified intent into functional stage proposals and execution structure.
```

Create `adapted/tasks/SOURCE_MAP.md`:

```md
# Tasks Module — Source Map

## Source inputs
- conversation-derived intent handling

## Goal in Nexxoria
Represent intention-based work units and track their progression.
```

Create `adapted/memory/SOURCE_MAP.md`:

```md
# Memory Module — Source Map

## Source inputs
- conversation-derived persistence signals

## Goal in Nexxoria
Persist global, stage, and tag memory.
```

Create `adapted/state/SOURCE_MAP.md`:

```md
# State Module — Source Map

## Source inputs
- conversation and planning progression signals

## Goal in Nexxoria
Reflect current project status and active focus.
```

Create `adapted/context/SOURCE_MAP.md`:

```md
# Context Module — Source Map

## Source inputs
- conversation and memory continuity signals

## Goal in Nexxoria
Maintain project-wide shared understanding.
```

Create `adapted/errors/SOURCE_MAP.md`:

```md
# Errors Module — Source Map

## Source inputs
- conversation and memory failure signals

## Goal in Nexxoria
Track errors, causes, resolutions, and unresolved issues.
```

- [ ] **Step 3: Verify every adapted module now has an explicit source map**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
required = [
    'adapted/conversation/SOURCE_MAP.md',
    'adapted/planning/SOURCE_MAP.md',
    'adapted/tasks/SOURCE_MAP.md',
    'adapted/memory/SOURCE_MAP.md',
    'adapted/state/SOURCE_MAP.md',
    'adapted/context/SOURCE_MAP.md',
    'adapted/errors/SOURCE_MAP.md',
]
missing = [p for p in required if not Path(p).exists()]
print('missing:', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing: []`

### Task 3: Turn conversation into the operational orchestration contract

**Files:**
- Modify: `SKILL.md`
- Modify: `skills/nexxoria/SKILL.md`
- Modify: `adapted/conversation/MODULE.md`
- Modify: `adapted/conversation/RULES.md`
- Modify: `adapted/conversation/FLOWS.md`

- [ ] **Step 1: Extend the root system definition to make bootstrap and orchestration explicit**

In `SKILL.md`, add or update sections so the content explicitly states:

```md
## Automatic project bootstrap

If `.nexxoria/` does not exist in the current project, the conversation module must bootstrap it automatically using Nexxoria templates before deeper routing continues.

## Conversation runtime responsibilities

Conversation must:

- detect intention types such as new project, continuation, task work, doubt, and change
- detect missing `.nexxoria/` structure
- trigger bootstrap automatically
- ask questions in guided order
- produce a first draft for new projects
- route to planning, tasks, memory, state, context, or errors
- re-enter whenever guidance is needed again
```

- [ ] **Step 2: Mirror the same operational behavior in `skills/nexxoria/SKILL.md`**

Ensure the OpenCode-discoverable skill includes the same sections and wording so runtime-discovered behavior matches the canonical root `SKILL.md`.

- [ ] **Step 3: Upgrade `adapted/conversation/MODULE.md` to include bootstrap and draft generation responsibilities**

Append these points under responsibilities or equivalent sections:

```md
- detect whether `.nexxoria/` exists in the current project
- bootstrap `.nexxoria/` automatically when missing
- create initial project drafts for new work
- initialize project memory, state, stages, tasks, and logs through the bootstrap structure
```

- [ ] **Step 4: Upgrade `adapted/conversation/RULES.md` with ordered questioning and intention detection rules**

Add rules like:

```md
## Bootstrap rules

- If `.nexxoria/` is missing, bootstrap it before deeper project orchestration.
- Bootstrap must not block guidance.

## Intention detection rules

- Distinguish at minimum: new project, continue project, create task, doubt, change.

## New project question order

When the user is starting a new project, ask in this order when needed:
1. objective
2. project name
3. references or inspiration
4. initial stages
```

- [ ] **Step 5: Upgrade `adapted/conversation/FLOWS.md` with explicit bootstrap and draft flows**

Add these flows:

```md
## Flow — Missing structure

Prompt → Detect missing `.nexxoria/` → Bootstrap structure → Continue guidance

## Flow — New project draft

Prompt → Detect new project intent → Ask ordered questions → Create initial draft → Ask user to review and adjust

## Flow — Re-entry

Downstream ambiguity or change → Return to conversation → Clarify → Re-route
```

- [ ] **Step 6: Verify the Nexxoria skill still loads the updated operational definition**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
root = Path('SKILL.md').read_text()
skill = Path('skills/nexxoria/SKILL.md').read_text()
checks = [
    'Automatic project bootstrap',
    'Conversation runtime responsibilities',
    '.nexxoria/',
]
missing = [item for item in checks if item not in root or item not in skill]
print('missing:', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing: []`

- [ ] **Step 7: Explicitly incorporate upstream logic into conversation documents**

Ensure these ideas appear in the adapted conversation docs:

In `adapted/conversation/MODULE.md`:

```md
This module absorbs orchestration discipline from `using-superpowers` and clarification-plus-draft guidance from `brainstorming`, but exposes them as Nexxoria-owned behavior.
```

In `adapted/conversation/RULES.md`:

```md
- Use workflow selection discipline before acting.
- Prefer question-driven clarification before premature structure.
- Use draft-first guidance for underdefined project requests.
```

In `adapted/conversation/FLOWS.md`:

```md
## Flow — Underdefined request

Prompt → Clarification questions → Options and recommendation → Draft generation → User review → Routing
```

- [ ] **Step 8: Verify source-logic language appears in the adapted conversation docs**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
files = [
    'adapted/conversation/MODULE.md',
    'adapted/conversation/RULES.md',
    'adapted/conversation/FLOWS.md',
]
required = ['using-superpowers', 'brainstorming', 'draft']
content = '\n'.join(Path(f).read_text().lower() for f in files)
missing = [item for item in required if item.lower() not in content]
print('missing:', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing: []`

### Task 4: Document the three-level memory model and system bootstrap behavior

**Files:**
- Create: `adapted/memory/MODULE.md`
- Create: `adapted/memory/RULES.md`
- Create: `adapted/memory/FLOWS.md`
- Modify: `README.md`
- Modify: `install/bootstrap.md`
- Modify: `system/onboarding.md`

- [ ] **Step 1: Add a dedicated adapted memory module definition**

Create `adapted/memory/MODULE.md`:

```md
# Memory Module

Nexxoria memory is organized at three levels:

- global memory
- stage memory
- tag memory

The module preserves decisions, errors, changes, and architecture across the project lifecycle.
```

Create `adapted/memory/RULES.md`:

```md
# Memory Rules

- Global memory always exists.
- Stage memory exists for each stage when stages exist.
- Tag memory stores transversal topics.
- Decisions, errors, changes, and architecture must be stored when relevant.
```

Create `adapted/memory/FLOWS.md`:

```md
# Memory Flows

System event → Determine scope (global/stage/tag) → Write to memory target → Refresh context if needed
```

- [ ] **Step 2: Update `README.md` so the `.nexxoria/` project structure is visible to users**

Add a section like:

```md
## Managed project structure

When Nexxoria starts working in a project that does not yet contain `.nexxoria/`, the conversation module bootstraps:

- project brief
- project state
- project context
- global memory
- stage memory structure
- tag memory structure
- stages index
- tasks index
- decision, error, change, and architecture logs
```

- [ ] **Step 3: Update `install/bootstrap.md` to mention project bootstrap, not only plugin activation**

Add a section like:

```md
## Project bootstrap behavior

After the plugin is active, Nexxoria uses conversation as the entry module.
If the target project does not yet contain `.nexxoria/`, Nexxoria bootstraps the structure automatically from templates.
```

- [ ] **Step 4: Update `system/onboarding.md` with the first-run project behavior**

Add content like:

```md
## First-run behavior

On first meaningful project interaction, Nexxoria should:

1. detect whether `.nexxoria/` exists
2. bootstrap it if missing
3. begin the guided conversation flow
4. create a first draft for new projects when appropriate
```

- [ ] **Step 5: Verify the memory model language is present in user-facing docs**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
files = [
    'README.md',
    'install/bootstrap.md',
    'system/onboarding.md',
    'adapted/memory/MODULE.md',
]
required = ['global memory', 'stage memory', 'tag memory']
missing = []
for item in required:
    if not any(item in Path(f).read_text().lower() for f in files):
        missing.append(item)
print('missing:', missing)
raise SystemExit(1 if missing else 0)
PY
```

Expected: `missing: []`

### Task 5: Preserve OpenCode compatibility while aligning runtime docs with the new base system

**Files:**
- Modify: `.opencode/plugins/nexxoria.js`
- Modify: `package.json`
- Modify: `README.md`
- Test: runtime verification via OpenCode CLI

- [ ] **Step 1: Update plugin bootstrap text so it references the full base system behavior**

In `.opencode/plugins/nexxoria.js`, change the injected intro text so it includes lines like:

```js
'Conversation is the mandatory first module and controls system flow.',
'If project structure is missing, Nexxoria should bootstrap `.nexxoria/` automatically.',
'Use internal modules for planning, tasks, memory, state, context, and errors.',
```

- [ ] **Step 2: Keep `package.json` pointed at the OpenCode plugin and ensure `skills` remains packaged**

Ensure `package.json` still includes:

```json
{
  "main": ".opencode/plugins/nexxoria.js",
  "files": [
    "SKILL.md",
    "README.md",
    ".opencode",
    "skills",
    "modules",
    "adapted",
    "sources",
    "templates",
    "system",
    "install"
  ]
}
```

- [ ] **Step 3: Verify bootstrap script still registers the correct remote plugin**

Run:

```bash
rm -rf .debug-opencode-plan-check && OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-plan-check" ./install.sh && python3 - <<'PY'
import json
from pathlib import Path
p = Path('.debug-opencode-plan-check/opencode.json')
data = json.loads(p.read_text())
print(data['plugin'])
assert data['plugin'] == ['nexxoria@git+https://github.com/Durru/nexxoria-skill-pack.git']
PY
```

Expected output includes:

```text
['nexxoria@git+https://github.com/Durru/nexxoria-skill-pack.git']
```

- [ ] **Step 4: Verify OpenCode can still install and recognize the package via the remote plugin**

Run:

```bash
OPENCODE_CONFIG_DIR="$(pwd)/.debug-opencode-plan-check" opencode run --print-logs "use skill tool to load nexxoria"
```

Expected evidence in logs:

```text
installed nexxoria@github:Durru/nexxoria-skill-pack
```

and a Nexxoria skill duplicate or discovery line indicating the skill was seen.

- [ ] **Step 5: Commit the completed base system changes**

Run:

```bash
git add .
git commit -m "feat: build Nexxoria base system contracts"
```

Expected: one successful conventional commit with the full base system contract work.

---

## Self-Review

### Spec coverage
- `.nexxoria/` bootstrap structure: covered in Task 1 and Task 3.
- Three-level memory model: covered in Task 1 and Task 4.
- All modules with `MODULE.md`, `RULES.md`, `FLOWS.md`: covered in Task 2.
- Source logic extraction from preserved superpowers skills into Nexxoria modules: covered in Task 2.5 and Task 3.
- Conversation as center with intention detection, bootstrap, drafts, routing, and re-entry: covered in Task 3.
- Templates including `project_state.md`: covered in Task 1.
- OpenCode compatibility preserved: covered in Task 5.

### Placeholder scan
- No `TODO`, `TBD`, or deferred instructions remain.
- Every task contains exact file paths and concrete content.

### Type and naming consistency
- Uses `.nexxoria/` consistently.
- Uses `global memory`, `stage memory`, and `tag memory` consistently.
- Uses `nexxoria` consistently as the OpenCode skill name.
