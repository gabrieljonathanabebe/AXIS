import type { ChartEncoding } from '../types/chart'

export type ColorEncodingMode = 'constant' | 'categorical' | 'continuous'

export function getColorEncodingMode(
  encoding: ChartEncoding,
): ColorEncodingMode {
  if (encoding.color?.semantic_type === 'numeric') {
    return 'continuous'
  }
  if (encoding.color || encoding.series) {
    return 'categorical'
  }
  return 'constant'
}
