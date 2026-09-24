import type { DataZoomComponentOption } from 'echarts'

import type { ChartInteractionSpec } from '../../types/chart'

// ===== FUNCTION ==============================================================
export function createDataZoomOption(
  zoom: ChartInteractionSpec['zoom'],
): DataZoomComponentOption[] | undefined {
  if (!zoom.enabled) {
    return undefined
  }
  const options: DataZoomComponentOption[] = []

  if (zoom.inside) {
    options.push({
      type: 'inside',
    })
  }
  if (zoom.slider) {
    options.push({
      type: 'slider',
    })
  }

  return options
}
