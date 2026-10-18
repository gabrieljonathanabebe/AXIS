import type { ECElementEvent } from 'echarts'

import type { ChartInstance } from '../types'
import type { DataField } from '../../datasets/types'
import { getColorEncodingMode } from '../getColorEncodingMode'
import { isPointsChartType } from '../chartDefinitions'

import type { DataSelection, SelectionFilter } from '../../workspace/types'

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
  fields: DataField[],
): DataSelection | null {
  const { encoding } = chart.spec.data
  const colorEncodingMode = getColorEncodingMode(chart.type, encoding, fields)
  if (
    colorEncodingMode !== 'categorical' ||
    !encoding.color ||
    !event.seriesName
  ) {
    return null
  }
  return createValueSelection(chart.id, encoding.color, event.seriesName)
}

// ===== FUNCTION ==============================================================
/**
 * Turns a click on a mark into a selection: the category of a bar, line
 * point or pie segment, the color category of a scatter point.
 * @param chart Chart that was clicked.
 * @param event ECharts click event.
 * @param fields Dataset fields, which decide the color encoding mode.
 * @returns The selection, or null for clicks without a data point, e.g. on
 *   the line path itself.
 */
export function createSelectionFromEvent(
  chart: ChartInstance,
  event: ECElementEvent,
  fields: DataField[],
): DataSelection | null {
  if (event.componentType !== 'series' || event.dataIndex === undefined) {
    return null
  }
  if (isPointsChartType(chart.type)) {
    return createScatterSelection(chart, event, fields)
  }
  const fieldName = chart.spec.data.encoding.x
  if (!fieldName) {
    return null
  }
  return createValueSelection(chart.id, fieldName, event.name)
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
    filters: [createRangeFilter(x, xRange), createRangeFilter(y, yRange)],
  }
}
