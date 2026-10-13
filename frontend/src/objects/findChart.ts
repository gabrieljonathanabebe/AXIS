import type { ChartInstance } from '../charts/types'
import type { DashboardObject } from './types'

/**
 * Finds a chart among the dashboard objects.
 * @param objects Objects on the canvas.
 * @param chartId ID to look for, or null when nothing is selected.
 * @returns The chart, or null when the ID is unknown or not a chart.
 */
export function findChart(
  objects: DashboardObject[],
  chartId: string | null,
): ChartInstance | null {
  const object = objects.find(({ id }) => id === chartId)
  return object?.kind === 'chart' ? object : null
}
