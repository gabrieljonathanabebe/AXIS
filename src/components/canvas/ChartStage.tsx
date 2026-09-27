import { GripHorizontal } from 'lucide-react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useEffect, useRef } from 'react'

import type { ChartLayoutMode, DragPayload, DropTarget } from '../../types/ui'

import EChartCanvas from './EChartCanvas'
import { getChartDefinition } from '../../chart/chartDefinitions'

import type { CSSProperties } from 'react'
import type { ChartEncoding, ChartInstance, Dataset } from '../../types/chart'
import type { DataSelection } from '../../types/workspace'

type ChartStageProps = {
  chart: ChartInstance
  dataset: Dataset
  datasetId: string | null
  isDraggingField: boolean
  isSelected: boolean
  selection: DataSelection | null
  style: CSSProperties
  onClearSelection: () => void
  onSelect: (chartId: string) => void
  onSelectData: (selection: DataSelection) => void
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

function ChartStage({
  chart,
  dataset,
  datasetId,
  isDraggingField,
  isSelected,
  selection,
  style,
  onClearSelection,
  onSelect,
  onSelectData,
}: ChartStageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const definition = getChartDefinition(chart.type)
  const xLabel =
    definition.encodings.find((encoding) => encoding.key === 'x')?.label ?? 'X'
  const yLabel =
    definition.encodings.find((encoding) => encoding.key === 'y')?.label ?? 'Y'
  useEffect(() => {
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])
  return (
    <div
      aria-label={`${definition.label} chart`}
      aria-pressed={isSelected}
      className={`chart-stage ${isDraggingField ? 'is-dragging-field' : ''} ${
        isSelected ? 'is-selected' : ''
      }`}
      ref={stageRef}
      role="button"
      style={style}
      tabIndex={0}
      onFocus={() => onSelect(chart.id)}
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
      {layoutHandleModes.map((mode) => (
        <ChartLayoutHandle chartId={chart.id} key={mode} mode={mode} />
      ))}
    </div>
  )
}

export default ChartStage
