#!/usr/bin/env bash
set -euo pipefail

PACK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTE_REPO_URL="https://github.com/Durru/nexxoria-skill-pack.git"
LOCAL_PLUGIN_URL="file://${PACK_ROOT}/.opencode/plugins/nexxoria.js"
INSTALL_MODE="${1:-remote}"
CONFIG_HOME="${OPENCODE_CONFIG_DIR:-$HOME/.config/opencode}"
CONFIG_FILE="$CONFIG_HOME/opencode.json"

case "$INSTALL_MODE" in
  remote)
    PLUGIN_SPEC="nexxoria@git+${REMOTE_REPO_URL}"
    ;;
  local)
    PLUGIN_SPEC="$LOCAL_PLUGIN_URL"
    ;;
  *)
    echo "Usage: ./install.sh [remote|local]"
    exit 1
    ;;
esac

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

Install mode:
  $INSTALL_MODE
EOF
