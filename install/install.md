# Install Guide

## Goal

Provide a single, simple installation experience for the Nexxoria Skill Pack.

## Current installation model

This repository is structured as a single package with one primary system entrypoint.

### Current local installation

1. Clone the repository:

```bash
git clone <REPO_URL>
```

2. Enter the package directory:

```bash
cd nexxoria-skill-pack
```

3. Run the bootstrap entry:

```bash
npm run bootstrap
```

## Single entrypoint

- system entry: `SKILL.md`
- runtime entry: `opencode/plugin.js`

## Target future installation experience

The package is intentionally shaped so it can later be published and invoked with a single command such as:

```bash
npx nexxoria-skill-pack
```

That npm publication step is not part of this iteration.
