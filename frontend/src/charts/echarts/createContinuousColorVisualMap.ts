import { formatCompactNumber } from '../../shared/format/formatNumber'
import { getNumericDomain } from './getNumericDomain'
import { resolveColor } from './resolveColor'

import type { ContinuousVisualMapComponentOption } from 'echarts'
import type { ColorScaleAppearance } from '../types'
import type { ChartTheme } from './chartTheme'

type CreateContinuousColorVisualMapParams = {
  appearance: ColorScaleAppearance['continuous']
  dimension: number
  theme: ChartTheme
  values: Array<number | null | undefined>
}

type ContinuousColorVisualMap = ContinuousVisualMapComponentOption | null

/**
 * Creates the color scale of a continuous color encoding.
 * @returns Visual map of the scale, or null without numeric values.
 */
export function createContinuousColorVisualMap({
  appearance,
  dimension,
  theme,
  values,
}: CreateContinuousColorVisualMapParams): ContinuousColorVisualMap {
  const domain = getNumericDomain(values)

  if (!domain) {
    return null
  }

  const min = appearance.min ?? domain.min
  const requestedMax = appearance.max ?? domain.max
  const max = requestedMax <= min ? min + 1 : requestedMax

  return {
    calculable: false,
    dimension,
    inRange: {
      color: [
        resolveColor(appearance.startColor, theme),
        resolveColor(appearance.endColor, theme),
      ],
    },
    left: appearance.layout.position === 'left' ? 16 : undefined,
    max,
    min,
    orient: appearance.layout.orientation,
    right: appearance.layout.position === 'right' ? 16 : undefined,
    show: appearance.visible,
    text: appearance.labels
      ? [formatCompactNumber(max), formatCompactNumber(min)]
      : ['', ''],
    top: 'middle',
    type: 'continuous',
  }
}
