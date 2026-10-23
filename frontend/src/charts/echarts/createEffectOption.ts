import type { Effect } from '../../shared/effect'

// ===== TYPES =================================================================
/** Shadow fields of ECharts, e.g. in a line style or the item style of bars. */
type EffectOption = {
  shadowBlur?: number
  shadowColor?: string
}

// ===== FUNCTION ==============================================================
/**
 * Translates an effect of the spec into ECharts shadow fields. A glow takes
 * the color of its series; without one, e.g. under a continuous color
 * scale, it stays off, since ECharts would draw a black shadow.
 * @param effect Effect of one mark, e.g. a line.
 * @param color Resolved series color, or undefined when none applies.
 * @returns Blur and color of the shadow, or no fields without a glow.
 */
export function createEffectOption(
  effect: Effect,
  color: string | undefined,
): EffectOption {
  if (effect.kind === 'none' || !color) {
    return {}
  }
  return { shadowBlur: effect.blur, shadowColor: color }
}
