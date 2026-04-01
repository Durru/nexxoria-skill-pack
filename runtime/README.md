# Deprecated Root Runtime

These root-level `runtime/` files are legacy from the pre-SDK architecture.

## Active source of truth

The active Nexxoria runtime executors now live in:

- `packages/sdk/src/runtime/`
- `packages/sdk/src/system/runtime/`

Do not add new active runtime behavior here.

If a mechanical executor is needed for the active system, add it in the SDK runtime.
