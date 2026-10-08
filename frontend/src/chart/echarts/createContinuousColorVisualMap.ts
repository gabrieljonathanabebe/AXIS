import type { ContinuousVisualMapComponentOption } from 'echarts'

import type { ColorScaleAppearance } from '../../types/chart'
import { getNumericDomain } from './getNumericDomain'

type CreateContinuousColorVisualMapParams = {
  appearance: ColorScaleAppearance['continuous']
  dimension: number
  values: Array<number | null | undefined>
}

type ContinuousColorVisualMap = ContinuousVisualMapComponentOption | null

export function createContinuousColorVisualMap({
  appearance,
  dimension,
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
      color: [appearance.startColor, appearance.endColor],
    },
    left: appearance.position === 'left' ? 16 : undefined,
    max,
    min,
    orient: appearance.orientation,
    right: appearance.position === 'right' ? 16 : undefined,
    show: appearance.visible,
    text: appearance.labels ? [String(max), String(min)] : ['', ''],
    top: 'middle',
    type: 'continuous',
  }
}
