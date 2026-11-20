import { isRadialChartType } from '@/charts/chartDefinitions'

import type { GridComponentOption } from 'echarts'
import type { ChartType } from '@/charts/types'
import type { Side } from '@/shared/layout'

// ===== CONSTANTS =============================================================
/** Room for axis labels and titles on each side of the plot. */
const BASE_GRID = {
  bottom: 48,
  left: 64,
  right: 32,
  top: 28,
} satisfies Record<Side, number>

/** A radial plot leaves no room: it centers in its canvas. */
const RADIAL_INSETS = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
} satisfies Record<Side, number>

// ===== FUNCTIONS =============================================================
/**
 * Creates the plot grid. Legend and color scale sit next to the canvas as
 * HTML, so the grid only keeps room for the axes.
 * @returns Grid margins in pixels.
 */
export function createGridOption(): GridComponentOption {
  return { ...BASE_GRID, containLabel: false }
}

/**
 * Room the plot leaves on each side of the canvas, so HTML parts next to
 * it, e.g. the legend, line up with the plot.
 * @param chartType Type of the chart; a radial plot fills its canvas.
 * @returns Insets in pixels per side.
 */
export function getPlotInsets(chartType: ChartType): Record<Side, number> {
  return isRadialChartType(chartType) ? RADIAL_INSETS : BASE_GRID
}
