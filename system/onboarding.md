# Onboarding System

## Purpose

- initialize or repair `.nexxoria/`
- analyze repositories when they already exist
- write initial global memory
- provide a useful starting point for conversation

## Active runtime

The runtime helper lives at `runtime/onboarding.js` and coordinates project detection, bootstrap, repair, analysis, and initial memory writes.

## First-run behavior

On first meaningful project interaction, Nexxoria should:

1. detect whether `.nexxoria/` exists
2. bootstrap it if missing
3. begin the guided conversation flow
4. create a first draft for new projects when appropriate
