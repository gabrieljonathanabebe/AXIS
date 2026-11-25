// ===== TYPES =================================================================
/** Limits and step of a number field; a missing bound is open. */
export type NumberBounds = {
  max?: number
  min?: number
  step?: number
}

/** What the text of a number field means. */
export type NumberDraft =
  { kind: 'auto' } | { kind: 'invalid' } | { kind: 'number'; value: number }

/** What a key does in a field that commits: take the draft or drop it. */
export type DraftKeyAction = 'cancel' | 'commit'

// ===== FUNCTIONS =============================================================
/**
 * Reads the text of a number field, e.g. "12" → 12, "" → auto if allowed.
 * @param draft Typed text.
 * @param allowsAuto Whether an empty field means auto.
 * @returns The number, auto or invalid.
 */
export function readNumberDraft(
  draft: string,
  allowsAuto: boolean,
): NumberDraft {
  if (draft.trim() === '') {
    return allowsAuto ? { kind: 'auto' } : { kind: 'invalid' }
  }
  const value = Number(draft)
  return Number.isFinite(value)
    ? { kind: 'number', value }
    : { kind: 'invalid' }
}

/**
 * Rounds to the decimals of the step and keeps it within the bounds,
 * e.g. 1.26 with step 0.1 and max 1.2 → 1.2.
 * @param value Typed, dragged or stepped value.
 * @param bounds Limits and step of the field.
 * @returns The value the field commits.
 */
export function boundNumber(value: number, bounds: NumberBounds): number {
  const { max = Infinity, min = -Infinity, step = 1 } = bounds
  const decimals = String(step).split('.')[1]?.length ?? 0
  const rounded = Number(value.toFixed(decimals))
  return Math.min(max, Math.max(min, rounded))
}

/**
 * Steps of an arrow key: up adds, down subtracts, Shift takes ten.
 * @param key Pressed key.
 * @param shiftKey Whether Shift is held.
 * @returns Number of steps, or null for any other key.
 */
export function getArrowSteps(key: string, shiftKey: boolean): number | null {
  if (key !== 'ArrowUp' && key !== 'ArrowDown') {
    return null
  }
  const direction = key === 'ArrowUp' ? 1 : -1
  return direction * (shiftKey ? 10 : 1)
}

/**
 * What a key does in a field that commits: Enter takes, Escape drops.
 * @param key Pressed key.
 * @returns The action, or null for any other key.
 */
export function getDraftKeyAction(key: string): DraftKeyAction | null {
  if (key === 'Enter') {
    return 'commit'
  }
  return key === 'Escape' ? 'cancel' : null
}
