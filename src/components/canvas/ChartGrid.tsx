import { useDndContext, useDndMonitor, useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core'
import type { CSSProperties, PointerEvent } from 'react'

import {
  CHART_GRID,
  moveChartLayout,
  resizeChartLayout,
} from '../../workspace/chartLayout'

import type {
  ChartAppearanceSpec,
  ChartInstance,
  ChartLayout,
  ChartTitleAppearance,
  Dataset,
} from '../../types/chart'
import type { ChartLayoutMode, DragPayload, DropTarget } from '../../types/ui'
import type { GridDelta } from '../../workspace/chartLayout'
import type { DataSelection } from '../../types/workspace'
import ChartItem from './ChartItem'

// ===== TYPES =================================================================
type ChartGridProps = {
  charts: ChartInstance[]
  dataset: Dataset
  datasetId: string | null
  isDraggingField: boolean
  selectedChartId: string | null
  selection: DataSelection | null
  onClearSelection: () => void
  onDuplicateChart: (chartId: string) => void
  onRemoveChart: (chartId: string) => void
  onSelectChart: (chartId: string | null) => void
  onSelectData: (selection: DataSelection) => void
  onUpdateChartAppearance: <TKey extends keyof ChartAppearanceSpec>(
    chartId: string,
    key: TKey,
    value: ChartAppearanceSpec[TKey],
  ) => void
  onUpdateChartLayout: (chartId: string, layout: ChartLayout) => void
  onUpdateChartTitle: (chartId: string, title: ChartTitleAppearance) => void
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
  charts,
  dataset,
  datasetId,
  isDraggingField,
  selectedChartId,
  selection,
  onClearSelection,
  onDuplicateChart,
  onRemoveChart,
  onSelectChart,
  onSelectData,
  onUpdateChartAppearance,
  onUpdateChartLayout,
  onUpdateChartTitle,
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
        onUpdateChartLayout(preview.chartId, preview.layout)
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
      onSelectChart(null)
    }
  }

  return (
    <div
      className={`chart-grid ${isOver ? 'is-over' : ''}`}
      ref={setNodeRef}
      style={gridStyle}
      onPointerDown={handlePointerDown}
    >
      {charts.map((chart) => {
        const layout =
          chart.id === layoutPreview?.chartId
            ? layoutPreview.layout
            : chart.layout
        return (
          <ChartItem
            chart={chart}
            dataset={dataset}
            datasetId={datasetId}
            isDraggingField={isDraggingField}
            isSelected={chart.id === selectedChartId}
            key={chart.id}
            selection={selection}
            style={getGridArea(layout)}
            onClearSelection={onClearSelection}
            onDuplicate={onDuplicateChart}
            onRemove={onRemoveChart}
            onSelect={onSelectChart}
            onSelectData={onSelectData}
            onUpdateAppearance={onUpdateChartAppearance}

            onUpdateLayout={onUpdateChartLayout}
            onUpdateTitle={onUpdateChartTitle}
          />
        )
      })}
    </div>
  )
}

export default ChartGrid
