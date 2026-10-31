import { isColorValue } from '../shared/colorValue'

// ===== HELPERS ===============================================================
/** Tells a plain object of a spec from arrays and primitive values. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// ===== FUNCTION ==============================================================
/**
 * Takes every color of the style defaults into a value of the spec and
 * keeps everything else, e.g. sizes, widths and texts. Walks both values
 * side by side, so a new element is covered as soon as its default color
 * comes from the style; there is no second list. A value of another kind
 * stays, e.g. a glow where the default has no effect or a gradient where
 * it has a solid paint.
 * @param current Value in the spec, e.g. the appearance of a chart.
 * @param defaults Same value as the style creates it.
 * @returns The current value with the colors of the defaults.
 */
export function takeStyleColors<T>(current: T, defaults: T): T {
  if (isColorValue(defaults)) {
    return defaults
  }
  if (Array.isArray(defaults)) {
    const isPalette = defaults.length > 0 && defaults.every(isColorValue)
    return isPalette ? defaults : current
  }
  if (!isRecord(current) || !isRecord(defaults)) {
    return current
  }
  if ('kind' in defaults && current.kind !== defaults.kind) {
    return current
  }
  const entries = Object.entries(current).map(([key, value]) => {
    return [
      key,
      key in defaults ? takeStyleColors(value, defaults[key]) : value,
    ]
  })
  return Object.fromEntries(entries) as T
}
