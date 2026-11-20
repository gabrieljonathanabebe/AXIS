import { resolveColor } from './resolveColor'

import type { ContinuousVisualMapComponentOption } from 'echarts'
import type { NumericDomain } from '@/charts/getNumericDomain'
import type { ColorScaleAppearance } from '@/charts/types'

type CreateContinuousColorVisualMapParams = {
  appearance: ColorScaleAppearance['continuous']
  dimension: number
  range: NumericDomain
}

/**
 * Creates the visual map that colors the marks of a continuous color
 * field. It stays hidden: the chart shows the color scale itself, as
 * HTML next to the canvas.
 * @param params Colors of the scale, the data dimension that holds the
 *   color value, and the range from `getColorScaleRange`.
 * @returns Hidden visual map of the scale.
 */
export function createContinuousColorVisualMap({
  appearance,
  dimension,
  range,
}: CreateContinuousColorVisualMapParams): ContinuousVisualMapComponentOption {
  return {
    dimension,
    inRange: {
      color: [
        resolveColor(appearance.startColor),
        resolveColor(appearance.endColor),
      ],
    },
    max: range.max,
    min: range.min,
    show: false,
    type: 'continuous',
  }
}
