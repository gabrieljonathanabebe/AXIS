import type { LegendComponentOption } from 'echarts'

import type { ChartInteractionSpec, LegendAppearance } from '../../types/chart'

import type { ColorEncodingMode } from '../getColorEncodingMode'

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

// ===== HELPER ================================================================
function createLegendPlacement(appearance: LegendAppearance): LegendPlacement {
  const { alignment, position } = appearance
  const isVertical = position === 'left' || position === 'right'
  const placement: LegendPlacement = {}

  if (position === 'bottom') {
    placement.bottom = 8
  }
  if (position === 'left') {
    placement.left = 8
  }
  if (position === 'right') {
    placement.right = 8
  }
  if (position === 'top') {
    placement.top = 8
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
export function createLegendOption({
  appearance,
  interaction,
  colorEncodingMode,
}: CreateLegendOptionParams): LegendComponentOption {
  return {
    itemGap: appearance.gap,
    orient:
      appearance.position === 'left' || appearance.position === 'right'
        ? 'vertical'
        : 'horizontal',
    selectedMode: interaction.enabled ? interaction.selectionMode : false,
    show: appearance.visible && colorEncodingMode === 'categorical',
    textStyle: {
      color: appearance.textColor,
      fontSize: appearance.fontSize,
    },
    ...createLegendPlacement(appearance),
  }
}
