import { color } from 'echarts'

import { resolveColor } from './resolveColor'

import type { Effect } from '../../shared/effect'

// ===== TYPES =================================================================
/** Shadow fields of ECharts, e.g. in a line style or the item style of bars. */
type EffectOption = {
  shadowBlur?: number
  shadowColor?: string
  shadowOffsetX?: number
  shadowOffsetY?: number
}

// ===== FUNCTION ==============================================================
/**
 * Translates an effect of the spec into ECharts shadow fields. A glow takes
 * the color of its mark, a shadow its own color with its opacity. Without
 * a mark color, e.g. for dimmed marks or under a continuous color scale,
 * both stay off, since ECharts would draw a black glow there.
 * @param effect Effect of one mark, e.g. a line.
 * @param markColor Resolved series color, or undefined without effects.
 * @returns Shadow fields, or no fields without an effect.
 */
export function createEffectOption(
  effect: Effect,
  markColor: string | undefined,
): EffectOption {
  if (effect.kind === 'none' || !markColor) {
    return {}
  }
  if (effect.kind === 'glow') {
    return { shadowBlur: effect.blur, shadowColor: markColor }
  }
  return {
    shadowBlur: effect.blur,
    shadowColor: color.modifyAlpha(resolveColor(effect.color), effect.opacity),
    shadowOffsetX: effect.offsetX,
    shadowOffsetY: effect.offsetY,
  }
}
