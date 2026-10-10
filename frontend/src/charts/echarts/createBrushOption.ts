import { color } from 'echarts'
import type { BrushComponentOption, ECharts } from 'echarts'

import { isPointsChartType } from '../chartDefinitions'

import type { ChartInstance, ChartType } from '../types'
import type { DataSelection } from '../../workspace/types'
import type { ChartTheme } from './chartTheme'

// ===== HELPERS ===============================================================
function findRange(
  selection: DataSelection,
  field: string | undefined,
): number[] | null {
  const filter = selection.filters.find((item) => item.field === field)
  return filter?.kind === 'range' ? [filter.min, filter.max] : null
}

function getBrushCoordRange(
  chart: ChartInstance,
  selection: DataSelection | null,
): number[][] | null {
  if (selection?.sourceChartId !== chart.id) {
    return null
  }
  const { x, y } = chart.spec.data.encoding
  const xRange = findRange(selection, x)
  const yRange = findRange(selection, y)
  return xRange && yRange ? [xRange, yRange] : null
}

// ===== FUNCTIONS =============================================================
export function isBrushableChart(chartType: ChartType): boolean {
  return isPointsChartType(chartType)
}

export function createBrushOption(
  chartType: ChartType,
  theme: ChartTheme,
): BrushComponentOption | undefined {
  if (!isBrushableChart(chartType)) {
    return undefined
  }
  return {
    brushMode: 'single',
    brushStyle: {
      borderColor: theme.accent,
      borderWidth: 1,
      color: color.modifyAlpha(theme.accent, 0.12),
    },
    outOfBrush: { colorAlpha: 1 },
    throttleType: 'debounce',
    transformable: false,
    xAxisIndex: 0,
    yAxisIndex: 0,
  }
}

export function syncBrush(
  instance: ECharts,
  chart: ChartInstance,
  selection: DataSelection | null,
): void {
  if (!isBrushableChart(chart.type)) {
    return
  }
  instance.dispatchAction({
    type: 'takeGlobalCursor',
    key: 'brush',
    brushOption: {
      brushMode: 'single',
      brushType: 'rect',
    },
  })
  const coordRange = getBrushCoordRange(chart, selection)
  instance.dispatchAction({
    type: 'brush',
    areas: coordRange
      ? [{ brushType: 'rect', coordRange, xAxisIndex: 0, yAxisIndex: 0 }]
      : [],
  })
}
