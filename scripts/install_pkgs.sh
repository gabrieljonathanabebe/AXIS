#!/bin/bash

# Only run in cloud sessions, do nothing locally
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

# Install frontend dependencies
cd "$CLAUDE_PROJECT_DIR/frontend" && npm install || true

# Install backend dependencies
cd "$CLAUDE_PROJECT_DIR/backend" && pip install -r requirements.txt || true

exit 0