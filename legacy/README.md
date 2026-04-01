# Legacy Code

This directory documents repository code that is no longer the active source of truth.

## Active source of truth

Nexxoria now lives in:

- `packages/sdk/`

The SDK is the active center of the system.

## Legacy areas still present in the repo

These paths may still exist for reference or staged migration, but they must not be treated as the active architectural center:

- `modules/`
- `runtime/`

If code is needed for the active Nexxoria system, it must be migrated into the SDK.

## Rule

- Do not add new active product logic to legacy paths.
- Do not point active imports from the plugin or future CLI into legacy paths.
- Prefer migration or deletion over parallel maintenance.
