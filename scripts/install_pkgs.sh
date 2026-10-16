#!/bin/bash

# Only run in cloud sessions, do nothing locally
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

# Install frontend dependencies exactly as pinned in package-lock.json
cd "$CLAUDE_PROJECT_DIR/frontend" && npm ci --no-audit || true

# Install backend dependencies, overriding system-installed packages
cd "$CLAUDE_PROJECT_DIR/backend" && pip install --ignore-installed -r requirements.txt || true

exit 0