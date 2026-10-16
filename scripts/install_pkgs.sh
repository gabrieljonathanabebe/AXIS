#!/bin/bash

# Only run in cloud sessions, do nothing locally
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

# Install frontend dependencies exactly as pinned in package-lock.json
cd "$CLAUDE_PROJECT_DIR/frontend" && npm ci --no-audit || true

# Install backend dependencies exactly as pinned in uv.lock
cd "$CLAUDE_PROJECT_DIR/backend" && uv sync --frozen || true

# Make the backend venv the default Python for all later commands
VENV="$CLAUDE_PROJECT_DIR/backend/.venv"
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo "export VIRTUAL_ENV=\"$VENV\"" >> "$CLAUDE_ENV_FILE"
  echo "export PATH=\"$VENV/bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"
fi

exit 0