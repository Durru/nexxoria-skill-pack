#!/usr/bin/env bash
set -euo pipefail

PACK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_SPEC="nexxoria@git+${PACK_ROOT}"
CONFIG_HOME="${OPENCODE_CONFIG_DIR:-$HOME/.config/opencode}"
CONFIG_FILE="$CONFIG_HOME/opencode.json"

mkdir -p "$CONFIG_HOME"

if [ ! -f "$CONFIG_FILE" ]; then
  cat > "$CONFIG_FILE" <<'EOF'
{
  "plugin": []
}
EOF
fi

python3 - "$CONFIG_FILE" "$PLUGIN_SPEC" <<'PY'
import json
import sys
from pathlib import Path

config_path = Path(sys.argv[1])
plugin_spec = sys.argv[2]

data = json.loads(config_path.read_text())
plugins = data.setdefault("plugin", [])
if plugin_spec not in plugins:
    plugins.append(plugin_spec)
config_path.write_text(json.dumps(data, indent=2) + "\n")
PY

cat <<EOF
Nexxoria Skill Pack bootstrap completed.

OpenCode config file:
  $CONFIG_FILE

Registered plugin:
  $PLUGIN_SPEC

Next steps:
1. Restart OpenCode.
2. Use the skill tool to confirm the installed skill exists: nexxoria
3. Start using the Nexxoria system in your project.
EOF
