import boundaries from 'eslint-plugin-boundaries'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

// Layer check (DEVELOPMENT.md, S3 and S4): imports only point down the
// layers from ARCHITECTURE.md, object kinds never import each other.
// Reports warnings only; part 8 of the refactoring moves these rules into
// eslint.config.js as errors.

// ===== LAYERS ================================================================
/** Layers every object kind and the orchestration may import. */
const BASE_LAYERS = ['shared', 'data', 'objects', 'kindRegistry']

/** Object kinds; each may only import itself and the base layers. */
const OBJECT_KINDS = ['chart', 'card', 'table']

/**
 * Builds a policy that lets one element type import the given types.
 * @param {string} from element type of the importing file
 * @param {string[]} to element types it may import
 */
function allow(from, to) {
  return {
    allow: { to: { element: { types: to } } },
    from: { element: { type: from } },
  }
}

// ===== CONFIG ================================================================
export default defineConfig([
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { parser: tseslint.parser },
    plugins: { boundaries },
    rules: {
      'boundaries/dependencies': [
        'warn',
        {
          default: 'disallow',
          policies: [
            allow('shared', ['shared']),
            allow('data', ['shared', 'data']),
            allow('objects', BASE_LAYERS),
            allow('kindRegistry', [...BASE_LAYERS, ...OBJECT_KINDS]),
            ...OBJECT_KINDS.map((kind) => allow(kind, [...BASE_LAYERS, kind])),
            allow('orchestration', [
              ...BASE_LAYERS,
              ...OBJECT_KINDS,
              'orchestration',
            ]),
            allow('entry', ['orchestration']),
          ],
        },
      ],
    },
    settings: {
      'boundaries/elements': [
        { mode: 'full', pattern: 'src/main.tsx', type: 'entry' },
        { pattern: 'src/shared', type: 'shared' },
        { pattern: 'src/(datasets|queries)', type: 'data' },
        {
          mode: 'full',
          pattern:
            'src/objects/(types|objectDefinitions|createObject|getObjectLabel|resolveFormatElement).ts',
          type: 'kindRegistry',
        },
        { pattern: 'src/objects', type: 'objects' },
        { pattern: 'src/charts', type: 'chart' },
        { pattern: 'src/cards', type: 'card' },
        { pattern: 'src/table', type: 'table' },
        {
          pattern: 'src/(workspace|app|actions|ai|dashboardStyle)',
          type: 'orchestration',
        },
      ],
      'import/resolver': { typescript: { project: 'tsconfig.app.json' } },
    },
  },
])
