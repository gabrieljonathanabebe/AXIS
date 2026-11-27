#!/usr/bin/env bash
# Runs every check of DEVELOPMENT.md section 13 in one go, from any folder:
# backend format, lint and tests, then frontend format, lint, build and
# tests. With --smoke the pixel comparison runs as well. Stops at the
# first failing step; the calling shell stays where it was.
#
#   scripts/check.sh            fast checks
#   scripts/check.sh --smoke    fast checks and the smoke test

set -euo pipefail

root="$(git rev-parse --show-toplevel)"
run_smoke=false

for arg in "$@"; do
  case "$arg" in
    --smoke) run_smoke=true ;;
    *)
      echo "Unknown option: $arg (allowed: --smoke)" >&2
      exit 2
      ;;
  esac
done

step() {
  printf '\n\033[1m== %s\033[0m\n' "$1"
}

step "Backend: format, lint, tests"
cd "$root/backend"
uv run ruff format .
uv run ruff check --fix .
uv run pytest -q

step "Frontend: format, lint, build, tests"
cd "$root/frontend"
npm run format
npm run lint
npm run build
npm run test

if [ "$run_smoke" = true ]; then
  step "Frontend: smoke test"
  npm run smoke
fi

step "Whitespace in changed files"
cd "$root"
git diff --check

printf '\n\033[1;32mAll checks passed.\033[0m\n'
