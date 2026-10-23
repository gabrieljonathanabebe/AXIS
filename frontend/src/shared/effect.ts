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
