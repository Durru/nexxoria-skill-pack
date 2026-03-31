# Install Guide

## Goal

Provide a simple Git-based installation flow for OpenCode.

## Recommended installation

1. Clone the repository:

```bash
git clone https://github.com/Durru/nexxoria-skill-pack.git
cd nexxoria-skill-pack
```

2. Run the bootstrap script:

```bash
./install.sh
```

3. Restart OpenCode.

## What bootstrap does

- ensures `~/.config/opencode/opencode.json` exists, unless `OPENCODE_CONFIG_DIR` is set
- registers the local Git plugin entry for Nexxoria
- prepares OpenCode to discover the `nexxoria` skill from this cloned repository

## Plugin registration model

The bootstrap adds this kind of plugin specification to `opencode.json`:

```json
{
  "plugin": [
    "nexxoria@git+/absolute/path/to/nexxoria-skill-pack"
  ]
}
```

## Dominant entrypoints

- canonical system definition: `SKILL.md`
- OpenCode skill entry: `skills/nexxoria/SKILL.md`
- OpenCode plugin entry: `.opencode/plugins/nexxoria.js`

## Verification

After restarting OpenCode, verify that the skill is discoverable and use the installed `nexxoria` skill as the primary system interface.
