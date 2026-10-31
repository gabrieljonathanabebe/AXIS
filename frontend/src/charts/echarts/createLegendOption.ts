import { createTextStyleOption } from './createTextStyleOption'
import { resolveColor } from './resolveColor'

import type { LegendComponentOption } from 'echarts'
import type { Side } from '../../shared/layout'
import type { ColorEncodingMode } from '../getColorEncodingMode'
import type { ChartInteractionSpec, LegendAppearance } from '../types'

// ===== TYPES =================================================================
type CreateLegendOptionParams = {
  appearance: LegendAppearance
  interaction: ChartInteractionSpec['legend']
  colorEncodingMode: ColorEncodingMode
}

type LegendPlacement = Pick<
  LegendComponentOption,
  'top' | 'bottom' | 'left' | 'right'
>

// ===== CONSTANTS =============================================================
/** Distance of the legend to the chart edge; more at the top, below the title. */
export const LEGEND_EDGE_OFFSETS = {
  bottom: 8,
  left: 8,
  right: 8,
  top: 16,
} satisfies Record<Side, number>

// ===== HELPER ================================================================
/**
 * Places the legend at its side and, by its alignment, along that side.
 * @param appearance Legend with its layout.
 * @returns Distances of the legend to the chart edges for ECharts.
 */
function createLegendPlacement(appearance: LegendAppearance): LegendPlacement {
  const { alignment, position } = appearance.layout
  const isVertical = position === 'left' || position === 'right'
  const placement: LegendPlacement = {
    [position]: LEGEND_EDGE_OFFSETS[position],
  }

  if (isVertical) {
    if (alignment === 'start') {
      placement.top = 56
    } else if (alignment === 'center') {
      placement.top = 'middle'
    } else {
      placement.bottom = 56
    }
  } else if (alignment === 'start') {
    placement.left = 72
  } else if (alignment === 'center') {
    placement.left = 'center'
  } else {
    placement.right = 56
  }

  return placement
}

// ===== FUNCTION ==============================================================
/**
 * Creates the legend of a chart; it shows only with a categorical color.
 * @returns Legend option with text, page icons, selection and placement.
 */
export function createLegendOption({
  appearance,
  interaction,
  colorEncodingMode,
}: CreateLegendOptionParams): LegendComponentOption {
  const textColor = resolveColor(appearance.textStyle.color)
  return {
    itemGap: appearance.layout.gap,
    orient:
      appearance.layout.position === 'left' ||
      appearance.layout.position === 'right'
        ? 'vertical'
        : 'horizontal',
    pageIconColor: textColor,
    pageIconInactiveColor: resolveColor(appearance.inactiveColor),
    pageTextStyle: { color: textColor },
    selectedMode: interaction.enabled ? interaction.selectionMode : false,
    show: appearance.visible && colorEncodingMode === 'categorical',
    textStyle: createTextStyleOption(appearance.textStyle),
    triggerEvent: true,
    // Scrolls instead of overflowing when items exceed the chart width.
    type: appearance.overflow === 'plain' ? 'plain' : 'scroll',
    ...createLegendPlacement(appearance),
  }
}
