import type { ChartTheme } from './chartTheme'
import { createTextStyleOption } from './createTextStyleOption'
import { resolveColor } from './resolveColor'

import type { ChartInteractionSpec, LegendAppearance } from '../types'
import type { ColorEncodingMode } from '../getColorEncodingMode'
import type { LegendComponentOption } from 'echarts'

// ===== TYPES =================================================================
type CreateLegendOptionParams = {
  appearance: LegendAppearance
  interaction: ChartInteractionSpec['legend']
  colorEncodingMode: ColorEncodingMode
  theme: ChartTheme
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
} satisfies Record<LegendAppearance['position'], number>

// ===== HELPER ================================================================
function createLegendPlacement(appearance: LegendAppearance): LegendPlacement {
  const { alignment, position } = appearance
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
  theme,
}: CreateLegendOptionParams): LegendComponentOption {
  const textColor = resolveColor(appearance.textStyle.color, theme)
  return {
    itemGap: appearance.gap,
    orient:
      appearance.position === 'left' || appearance.position === 'right'
        ? 'vertical'
        : 'horizontal',
    pageIconColor: textColor,
    pageIconInactiveColor: resolveColor(appearance.inactiveColor, theme),
    pageTextStyle: { color: textColor },
    selectedMode: interaction.enabled ? interaction.selectionMode : false,
    show: appearance.visible && colorEncodingMode === 'categorical',
    textStyle: createTextStyleOption(appearance.textStyle, theme),
    triggerEvent: true,
    // Scrolls instead of overflowing when items exceed the chart width.
    type: appearance.layout === 'plain' ? 'plain' : 'scroll',
    ...createLegendPlacement(appearance),
  }
}
