import type { ECElementEvent } from 'echarts'

import type { ChartInstance } from '../../types/chart'
import type { DataSelection, SelectionFilter } from '../../types/workspace'

// ===== TYPES =================================================================
type BrushEndEvent = {
  areas: Array<{ coordRange?: number[][] }>
}

// ===== HELPERS ===============================================================
function createRangeFilter(field: string, range: number[]): SelectionFilter {
  return {
    kind: 'range',
    field,
    min: Math.min(...range),
    max: Math.max(...range),
  }
}

function createValueSelection(
  sourceChartId: string,
  field: string,
  value: string,
): DataSelection {
  return {
    sourceChartId,
    filters: [{ kind: 'values', field, values: [value] }],
  }
}

function createScatterSelection(
  chart: ChartInstance,
  event: ECElementEvent,
): DataSelection | null {
  const colorField = chart.spec.data.encoding.color
  if (colorField?.semantic_type !== 'categorical' || !event.seriesName) {
    return null
  }
  return createValueSelection(chart.id, colorField.name, event.seriesName)
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
  return createValueSelection(chart.id, field.name, event.name)
}

export function createSelectionFromBrush(
  chart: ChartInstance,
  event: unknown,
): DataSelection | null {
  const { areas } = event as BrushEndEvent
  const [xRange, yRange] = areas?.[0]?.coordRange ?? []
  const { x, y } = chart.spec.data.encoding
  if (!xRange || !yRange || !x || !y) {
    return null
  }
  return {
    sourceChartId: chart.id,
    filters: [
      createRangeFilter(x.name, xRange),
      createRangeFilter(y.name, yRange),
    ],
  }
}
