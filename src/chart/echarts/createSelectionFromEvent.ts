import type { ECElementEvent } from 'echarts'

import type { ChartInstance } from '../../types/chart'
import type { DataSelection } from '../../types/workspace'

// ===== HELPERS ===============================================================
function createScatterSelection(
  chart: ChartInstance,
  event: ECElementEvent,
): DataSelection | null {
  const colorField = chart.spec.data.encoding.color
  if (colorField?.semantic_type !== 'categorical' || !event.seriesName) {
    return null
  }
  return {
    sourceChartId: chart.id,
    field: colorField.name,
    values: [event.seriesName],
  }
}

// ===== FUNCTION ==============================================================
export function createSelectionFromEvent(
  chart: ChartInstance,
  event: ECElementEvent,
): DataSelection | null {
  if (event.componentType !== 'series') {
    return null
  }
  if (chart.type === 'scatter') {
    return createScatterSelection(chart, event)
  }
  const field = chart.spec.data.encoding.x
  if (!field) {
    return null
  }

  return {
    sourceChartId: chart.id,
    field: field.name,
    values: [event.name],
  }
}
