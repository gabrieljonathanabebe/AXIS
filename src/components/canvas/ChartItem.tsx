import { GripHorizontal } from 'lucide-react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useEffect, useRef } from 'react'

import type { ChartLayoutMode, DragPayload, DropTarget } from '../../types/ui'

import EChartCanvas from './EChartCanvas'
import EditableText from '../ui/EditableText'
import { getChartDefinition } from '../../chart/chartDefinitions'
import { getChartTitle, getDefaultChartTitle } from '../../chart/getChartTitle'
import { moveChartLayout, resizeChartLayout } from '../../workspace/chartLayout'

import type { CSSProperties, KeyboardEvent } from 'react'
import type {
  ChartEncoding,
  ChartInstance,
  ChartLayout,
  ChartTitleAppearance,
  Dataset,
} from '../../types/chart'
import type { DataSelection } from '../../types/workspace'
import type { GridDelta } from '../../workspace/chartLayout'

type ChartItemStyle = CSSProperties & {
  '--chart-canvas-inset': string
  '--chart-background'?: string
  '--chart-radius': string
}

type ChartItemProps = {
  chart: ChartInstance
  dataset: Dataset
  datasetId: string | null
  isDraggingField: boolean
  isSelected: boolean
  selection: DataSelection | null
  style: CSSProperties
  onClearSelection: () => void
  onDuplicate: (chartId: string) => void
  onRemove: (chartId: string) => void
  onSelect: (chartId: string | null) => void
  onSelectData: (selection: DataSelection) => void
  onUpdateLayout: (chartId: string, layout: ChartLayout) => void
  onUpdateTitle: (chartId: string, title: ChartTitleAppearance) => void
}

type AxisDropZoneProps = {
  axis: keyof ChartEncoding
  chartId: string
  isDraggingField: boolean
  label: string
}

function AxisDropZone({
  axis,
  chartId,
  isDraggingField,
  label,
}: AxisDropZoneProps) {
  const target: DropTarget = {
    chartId,
    encodingKey: axis,
    kind: 'encoding',
  }
  const { isOver, setNodeRef } = useDroppable({
    data: { target },
    disabled: !isDraggingField,
    id: `chart:${chartId}:encoding:${axis}`,
  })
  return (
    <div
      aria-label={`Drop field to set ${label}`}
      className={`axis-drop-zone ${axis}-axis-drop-zone ${isOver ? 'is-over' : ''}`}
      ref={setNodeRef}
    >
      <span className="axis-highlight-line" />
      <span className="axis-highlight-dot axis-highlight-dot-start" />
      <span className="axis-highlight-dot axis-highlight-dot-end" />
      <span className="axis-drop-label">Drop here to set {label}</span>
    </div>
  )
}

type ChartLayoutHandleProps = {
  chartId: string
  mode: ChartLayoutMode
}

const layoutHandleLabels: Record<ChartLayoutMode, string> = {
  e: 'Resize chart from right edge',
  move: 'Move chart',
  n: 'Resize chart from top edge',
  ne: 'Resize chart from top right corner',
  nw: 'Resize chart from top left corner',
  s: 'Resize chart from bottom edge',
  se: 'Resize chart from bottom right corner',
  sw: 'Resize chart from bottom left corner',
  w: 'Resize chart from left edge',
}

const layoutHandleModes = Object.keys(layoutHandleLabels) as ChartLayoutMode[]

function ChartLayoutHandle({ chartId, mode }: ChartLayoutHandleProps) {
  const payload: DragPayload = {
    chartId,
    kind: 'chart-layout',
    mode,
  }
  const { attributes, listeners, setNodeRef } = useDraggable({
    data: { payload },
    id: `chart:${chartId}:${mode}`,
  })
  return (
    <div
      {...listeners}
      {...attributes}
      aria-label={layoutHandleLabels[mode]}
      className={`chart-layout-handle chart-${mode}-handle`}
      ref={setNodeRef}
      tabIndex={-1}
    >
      {mode === 'move' ? <GripHorizontal size={14} /> : null}
    </div>
  )
}

const arrowKeyDeltas: Partial<Record<string, GridDelta>> = {
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
}

function ChartItem({
  chart,
  dataset,
  datasetId,
  isDraggingField,
  isSelected,
  selection,
  style,
  onClearSelection,
  onDuplicate,
  onRemove,
  onSelect,
  onSelectData,
  onUpdateLayout,
  onUpdateTitle,
}: ChartItemProps) {
  const itemRef = useRef<HTMLDivElement | null>(null)
  const definition = getChartDefinition(chart.type)
  const xLabel =
    definition.encodings.find((encoding) => encoding.key === 'x')?.label ?? 'X'
  const yLabel =
    definition.encodings.find((encoding) => encoding.key === 'y')?.label ?? 'Y'
  const { container } = chart
  const { background } = container
  const title = chart.spec.appearance.title
  const backgroundClassName =
    background.kind === 'glass'
      ? 'glass'
      : background.kind === 'none'
        ? ''
        : 'is-background-solid'
  const itemStyle: ChartItemStyle = {
    ...style,
    '--chart-canvas-inset': `${container.padding}px`,
    '--chart-background':
      background.kind === 'color' ? background.color : undefined,
    '--chart-radius': `${container.borderRadius}px`,
  }

  useEffect(() => {
    itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  useEffect(() => {
    const item = itemRef.current
    if (isSelected && item && !item.contains(document.activeElement)) {
      item.focus({ preventScroll: true })
    }
  }, [isSelected])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.target !== event.currentTarget) {
      return
    }
    const delta = arrowKeyDeltas[event.key]
    if (delta) {
      event.preventDefault()
      const layout = event.shiftKey
        ? resizeChartLayout(chart.layout, delta, {
            bottom: true,
            left: false,
            right: true,
            top: false,
          })
        : moveChartLayout(chart.layout, delta)
      onUpdateLayout(chart.id, layout)
      return
    }
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      onRemove(chart.id)
      return
    }
    if (event.key === 'd' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      onDuplicate(chart.id)
      return
    }
    if (event.key === 'Escape') {
      if (selection) {
        onClearSelection()
        return
      }
      onSelect(null)
      event.currentTarget.blur()
    }
  }

  return (
    <div
      aria-label={getChartTitle(chart)}
      className={`chart-item ${backgroundClassName} ${
        title.enabled ? 'has-header' : ''
      } ${isDraggingField ? 'is-dragging-field' : ''} ${
        isSelected ? 'is-selected' : ''
      }`}
      ref={itemRef}
      role="group"
      style={itemStyle}
      tabIndex={0}
      onFocus={() => onSelect(chart.id)}
      onKeyDown={handleKeyDown}
      onPointerDown={() => onSelect(chart.id)}
    >
      <div className="chart-encoding-overlay">
        <AxisDropZone
          axis="x"
          chartId={chart.id}
          isDraggingField={isDraggingField}
          label={xLabel}
        />
        <AxisDropZone
          axis="y"
          chartId={chart.id}
          isDraggingField={isDraggingField}
          label={yLabel}
        />
      </div>
      <EChartCanvas
        chart={chart}
        dataset={dataset}
        datasetId={datasetId}
        onClearSelection={onClearSelection}
        onSelectData={onSelectData}
        selection={selection}
      />
      {title.enabled ? (
        <div
          className="chart-item-header"
          style={{ textAlign: title.alignment }}
        >
          <EditableText
            className="chart-item-title"
            label="Chart title"
            placeholder={getDefaultChartTitle(chart)}
            value={title.text}
            onCommit={(text) => onUpdateTitle(chart.id, { ...title, text })}
          />
        </div>
      ) : null}
      {layoutHandleModes.map((mode) => (
        <ChartLayoutHandle chartId={chart.id} key={mode} mode={mode} />
      ))}
    </div>
  )
}

export default ChartItem
