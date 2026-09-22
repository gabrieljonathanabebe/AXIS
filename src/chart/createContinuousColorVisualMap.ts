import type { ContinuousVisualMapComponentOption } from 'echarts'

import type { ColorScaleAppearance } from '../types/chart'

type CreateContinuousColorVisualMapParams = {
  appearance: ColorScaleAppearance['continuous']
  dimension: number
  values: Array<number | null | undefined>
}

function getNumericDomain(
  values: Array<number | null | undefined>,
): { min: number; max: number } | null {
  const numericValues = values.filter((value): value is number => {
    return typeof value === 'number' && Number.isFinite(value)
  })

  if (numericValues.length === 0) {
    return null
  }

  return {
    min: Math.min(...numericValues),
    max: Math.max(...numericValues),
  }
}

export function createContinuousColorVisualMap({
  appearance,
  dimension,
  values,
}: CreateContinuousColorVisualMapParams): ContinuousVisualMapComponentOption | null {
  const domain = getNumericDomain(values)

  if (!domain) {
    return null
  }

  const min = appearance.min ?? domain.min
  const requestedMax = appearance.max ?? domain.max
  const max = requestedMax <= min ? min + 1 : requestedMax

  return {
    show: appearance.visible,
    text: appearance.labels ? [String(max), String(min)] : ['', ''],
    type: 'continuous',
    dimension,
    min,
    max,
    orient: appearance.orientation,
    left: appearance.position === 'left' ? 16 : undefined,
    right: appearance.position === 'right' ? 16 : undefined,
    top: 'middle',
    calculable: false,
    inRange: {
      color: [appearance.startColor, appearance.endColor],
    },
  }
}
