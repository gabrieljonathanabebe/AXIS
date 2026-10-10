import { useDndContext, useDndMonitor, useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'

import {
  CHART_GRID,
  DEFAULT_CHART_SIZE,
  findFreeChartLayout,
  moveChartLayout,
  resizeChartLayout,
} from './chartLayout'

import type { ChartInstance, ChartLayout } from '../charts/types'
import type { Dataset } from '../datasets/types'
import type { WorkspaceCommands } from '../app/types'
import type {
  CanvasActions,
  ChartLayoutMode,
  DataSelection,
  DragPayload,
  DropTarget,
} from './types'
import type { GridDelta } from './chartLayout'

import ChartItem from '../charts/ChartItem'

// ===== TYPES =================================================================
type ChartGridProps = {
  actions: CanvasActions
  charts: ChartInstance[]
  children?: ReactNode
  commands: WorkspaceCommands
  dataset: Dataset
  datasetId: string | null
  gap: number
  isDraggingField: boolean
  selectedChartId: string | null
  selection: DataSelection | null
}

type LayoutPreview = {
  chartId: string
  layout: ChartLayout
}

// ===== CONSTANTS =============================================================
const gridStyle: CSSProperties = {
  gridAutoRows: `${CHART_GRID.rowHeight}px`,
  gridTemplateColumns: `repeat(${CHART_GRID.columns}, minmax(0, 1fr))`,
}

const canvasTarget: DropTarget = {
  kind: 'canvas',
}

// ===== HELPERS ===============================================================
function getGridArea(layout: ChartLayout): CSSProperties {
  return {
    gridColumn: `${layout.x + 1} / span ${layout.width}`,
    gridRow: `${layout.y + 1} / span ${layout.height}`,
  }
}

function getGridStep(grid: HTMLElement): GridDelta {
  const styles = getComputedStyle(grid)
  const columnGap = Number.parseFloat(styles.columnGap)
  const rowGap = Number.parseFloat(styles.rowGap)
  const columnWidth =
    (grid.clientWidth - columnGap * (CHART_GRID.columns - 1)) /
    CHART_GRID.columns
  return {
    x: columnWidth + columnGap,
    y: CHART_GRID.rowHeight + rowGap,
  }
}

function isSamePreview(
  first: LayoutPreview | null,
  second: LayoutPreview | null,
): boolean {
  return (
    first?.chartId === second?.chartId &&
    first?.layout.x === second?.layout.x &&
    first?.layout.y === second?.layout.y &&
    first?.layout.width === second?.layout.width &&
    first?.layout.height === second?.layout.height
  )
}

function getDraggedLayout(
  layout: ChartLayout,
  mode: ChartLayoutMode,
  delta: GridDelta,
): ChartLayout {
  if (mode === 'move') {
    return moveChartLayout(layout, delta)
  }
  return resizeChartLayout(layout, delta, {
    bottom: mode.includes('s'),
    left: mode.includes('w'),
    right: mode.includes('e'),
    top: mode.includes('n'),
  })
}

// ===== COMPONENT =============================================================
function ChartGrid({
  actions,
  charts,
  children,
  commands,
  dataset,
  datasetId,
  gap,
  isDraggingField,
  selectedChartId,
  selection,
}: ChartGridProps) {
  const [layoutPreview, setLayoutPreview] = useState<LayoutPreview | null>(null)
  const { active } = useDndContext()
  const isDraggingChartType =
    active?.data.current?.payload?.kind === 'chart-type'
  const { isOver, node, setNodeRef } = useDroppable({
    data: { target: canvasTarget },
    disabled: !isDraggingChartType,
    id: 'chart-grid',
  })

  function getLayoutPreview(
    event: DragMoveEvent | DragEndEvent,
  ): LayoutPreview | null {
    const payload: DragPayload | undefined = event.active.data.current?.payload
    const chart = charts.find((chart) => {
      return payload?.kind === 'chart-layout' && chart.id === payload.chartId
    })
    if (payload?.kind !== 'chart-layout' || !chart || !node.current) {
      return null
    }
    const step = getGridStep(node.current)
    const delta = {
      x: Math.round(event.delta.x / step.x),
      y: Math.round(event.delta.y / step.y),
    }
    return {
      chartId: chart.id,
      layout: getDraggedLayout(chart.layout, payload.mode, delta),
    }
  }

  useDndMonitor({
    onDragCancel() {
      setLayoutPreview(null)
    },
    onDragEnd(event) {
      const preview = getLayoutPreview(event)
      setLayoutPreview(null)
      if (preview) {
        actions.updateChartLayout(preview.chartId, preview.layout)
      }
    },
    onDragMove(event) {
      const preview = getLayoutPreview(event)
      setLayoutPreview((current) => {
        return isSamePreview(current, preview) ? current : preview
      })
    },
  })

  function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      actions.selectChart(null)
    }
  }

  return (
    <div
      className="chart-grid"
      ref={setNodeRef}
      style={{ ...gridStyle, gap }}
      onPointerDown={handlePointerDown}
    >
      {charts.map((chart) => {
        const layout =
          chart.id === layoutPreview?.chartId
            ? layoutPreview.layout
            : chart.layout
        return (
          <ChartItem
            actions={actions}
            chart={chart}
            commands={commands}
            dataset={dataset}
            datasetId={datasetId}
            isDraggingField={isDraggingField}
            isSelected={chart.id === selectedChartId}
            key={chart.id}
            selection={selection}
            style={getGridArea(layout)}
          />
        )
      })}
      {isOver ? (
        <div
          className="chart-drop-preview"
          style={getGridArea(findFreeChartLayout(charts, DEFAULT_CHART_SIZE))}
        />
      ) : null}
      {children}
    </div>
  )
}

export default ChartGrid
