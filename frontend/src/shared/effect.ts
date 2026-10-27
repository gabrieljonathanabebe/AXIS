// ===== TYPES =================================================================
/**
 * How a mark stands out from the chart: no effect or a glow, a blurred
 * shadow without offset in the color of the mark. Offset shadows become a
 * further kind without changing these.
 */
export type Effect = { kind: 'none' } | { blur: number; kind: 'glow' }

// ===== CONSTANTS =============================================================
/** Blur a glow starts with when the effect is switched on. */
export const DEFAULT_GLOW_BLUR = 12

// ===== FUNCTIONS =============================================================
/**
 * Creates the effect of one kind; a glow starts with the default blur.
 * @param kind Kind to create, e.g. by the plus of the effect group.
 * @returns No effect, or a glow with the default blur.
 */
export function createEffect(kind: Effect['kind']): Effect {
  return kind === 'glow' ? { blur: DEFAULT_GLOW_BLUR, kind } : { kind }
}
