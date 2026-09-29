import type { ChartInstance, ChartLayout } from '../types/chart'

// ===== TYPES =================================================================
type ChartSize = Pick<ChartLayout, 'height' | 'width'>

export type GridDelta = Pick<ChartLayout, 'x' | 'y'>

export type ResizeEdges = {
  bottom: boolean
  left: boolean
  right: boolean
  top: boolean
}

// ===== CONSTANTS =============================================================
export const CHART_GRID = {
  columns: 24,
  rowHeight: 16,
}

export const DEFAULT_CHART_SIZE: ChartSize = {
  height: 16,
  width: 12,
}

export const MIN_CHART_SIZE: ChartSize = {
  height: 10,
  width: 6,
}

// ===== HELPERS ===============================================================
function isOverlapping(first: ChartLayout, second: ChartLayout): boolean {
  return (
    first.x < second.x + second.width &&
    second.x < first.x + first.width &&
    first.y < second.y + second.height &&
    second.y < first.y + first.height
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function compareReadingOrder(
  first: ChartInstance,
  second: ChartInstance,
): number {
  return first.layout.y - second.layout.y || first.layout.x - second.layout.x
}

// ===== FUNCTIONS =============================================================
export function findFreeChartLayout(
  charts: ChartInstance[],
  size: ChartSize,
): ChartLayout {
  const width = Math.min(size.width, CHART_GRID.columns)
  for (let y = 0; ; y += 1) {
    for (let x = 0; x + width <= CHART_GRID.columns; x += 1) {
      const layout = { height: size.height, width, x, y }
      const isFree = charts.every((chart) => {
        return !isOverlapping(chart.layout, layout)
      })
      if (isFree) {
        return layout
      }
    }
  }
}

export function findNeighborChartId(
  charts: ChartInstance[],
  chartId: string,
): string | null {
  const orderedCharts = [...charts].sort(compareReadingOrder)
  const index = orderedCharts.findIndex((chart) => chart.id === chartId)
  if (index === -1) {
    return null
  }
  return orderedCharts[index + 1]?.id ?? orderedCharts[index - 1]?.id ?? null
}

export function moveChartLayout(
  layout: ChartLayout,
  delta: GridDelta,
): ChartLayout {
  return {
    ...layout,
    x: clamp(layout.x + delta.x, 0, CHART_GRID.columns - layout.width),
    y: Math.max(layout.y + delta.y, 0),
  }
}

export function resizeChartLayout(
  layout: ChartLayout,
  delta: GridDelta,
  edges: ResizeEdges,
): ChartLayout {
  const right = layout.x + layout.width
  const bottom = layout.y + layout.height
  const x = edges.left
    ? clamp(layout.x + delta.x, 0, right - MIN_CHART_SIZE.width)
    : layout.x
  const y = edges.top
    ? clamp(layout.y + delta.y, 0, bottom - MIN_CHART_SIZE.height)
    : layout.y
  const width = edges.right
    ? clamp(
        layout.width + delta.x,
        MIN_CHART_SIZE.width,
        CHART_GRID.columns - layout.x,
      )
    : right - x
  const height = edges.bottom
    ? Math.max(layout.height + delta.y, MIN_CHART_SIZE.height)
    : bottom - y
  return { height, width, x, y }
}
