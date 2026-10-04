import type { EncodingKey } from '../chart/chartDefinitions'
import type {
  CevynAction,
  CevynActionError,
  CevynActionParseResult,
} from '../types/actions'

// ===== TYPES =================================================================
type PropertyRule = {
  kind: 'encoding' | 'string'
  required: boolean
}

// Keys must match the properties of each CevynAction exactly.
type ActionShapes = {
  [T in CevynAction['type']]: Record<
    Exclude<keyof Extract<CevynAction, { type: T }>, 'type'>,
    PropertyRule
  >
}

// ===== CONSTANTS =============================================================
const optionalEncoding: PropertyRule = { kind: 'encoding', required: false }
const optionalString: PropertyRule = { kind: 'string', required: false }
const requiredEncoding: PropertyRule = { kind: 'encoding', required: true }
const requiredString: PropertyRule = { kind: 'string', required: true }

// Structure only; values are checked by validateCevynAction.
const actionShapes: ActionShapes = {
  'chart/create': {
    aggregation: optionalString,
    chartType: requiredString,
    encoding: optionalEncoding,
  },
  'chart/remove': {
    chartId: requiredString,
  },
  'chart/setTitle': {
    chartId: requiredString,
    title: requiredString,
  },
  'chart/setType': {
    chartId: requiredString,
    chartType: requiredString,
  },
  'chart/updateAggregation': {
    aggregation: requiredString,
    chartId: requiredString,
  },
  'chart/updateEncoding': {
    chartId: requiredString,
    encoding: requiredEncoding,
  },
}

const encodingKeys: Record<EncodingKey, true> = {
  color: true,
  series: true,
  size: true,
  x: true,
  y: true,
}

// ===== HELPERS ===============================================================
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateEncodingShape(name: string, value: unknown): string[] {
  if (!isRecord(value)) {
    return [`Property "${name}" must be an object.`]
  }
  return Object.entries(value).flatMap(([key, fieldName]) => {
    if (!Object.hasOwn(encodingKeys, key)) {
      return [`Unknown encoding key "${key}".`]
    }
    return typeof fieldName === 'string'
      ? []
      : [`Encoding "${key}" must be a field name.`]
  })
}

function validatePropertyShape(
  name: string,
  rule: PropertyRule,
  value: unknown,
): string[] {
  if (value === undefined) {
    return rule.required ? [`Missing property "${name}".`] : []
  }
  if (rule.kind === 'encoding') {
    return validateEncodingShape(name, value)
  }
  return typeof value === 'string'
    ? []
    : [`Property "${name}" must be a string.`]
}

function validateActionShape(value: unknown): string[] {
  if (!isRecord(value)) {
    return ['Action must be an object.']
  }
  const { type, ...properties } = value
  if (typeof type !== 'string') {
    return ['Missing property "type".']
  }
  if (!Object.hasOwn(actionShapes, type)) {
    return [`Unknown action type "${type}".`]
  }
  const shape: Record<string, PropertyRule> =
    actionShapes[type as CevynAction['type']]
  return [
    ...Object.entries(shape).flatMap(([name, rule]) =>
      validatePropertyShape(name, rule, properties[name]),
    ),
    ...Object.keys(properties)
      .filter((name) => !Object.hasOwn(shape, name))
      .map((name) => `Unknown property "${name}".`),
  ]
}

// ===== FUNCTION ==============================================================
export function parseCevynActions(input: unknown): CevynActionParseResult {
  if (!Array.isArray(input)) {
    return { ok: false, errors: [{ message: 'Actions must be an array.' }] }
  }
  const errors: CevynActionError[] = input.flatMap((action, index) =>
    validateActionShape(action).map((message) => ({ index, message })),
  )
  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, actions: input as CevynAction[] }
}
