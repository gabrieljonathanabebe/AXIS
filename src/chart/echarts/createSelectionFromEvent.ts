import type { ECElementEvent } from 'echarts'

import type { ChartInstance } from '../../types/chart'
import type { DataSelection } from '../../types/workspace'

// ===== FUNCTION ==============================================================
export function createSelectionFromEvent(
  chart: ChartInstance,
  event: ECElementEvent,
): DataSelection | null {
  const field = chart.spec.data.encoding.x
  if (chart.type === 'scatter' || !field || event.componentType !== 'series') {
    return null
  }
  return {
    sourceChartId: chart.id,
    field: field.name,
    values: [event.name],
  }
}
