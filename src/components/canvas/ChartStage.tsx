import { useDroppable } from '@dnd-kit/core'

import { getChartDefinition } from '../../chart/chartDefinitions'
import EChartCanvas from './EChartCanvas'

import type { ChartEncoding, ChartInstance, Dataset } from '../../types/chart'

type ChartStageProps = {
  chart: ChartInstance
  dataset: Dataset
  datasetId: string | null
  isDraggingField: boolean
}

type AxisDropZoneProps = {
  axis: keyof ChartEncoding
  label: string
}

function AxisDropZone({ axis, label }: AxisDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `axis:${axis}`,
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

function ChartStage({
  chart,
  dataset,
  datasetId,
  isDraggingField,
}: ChartStageProps) {
  const definition = getChartDefinition(chart.type)
  const xLabel =
    definition.encodings.find((encoding) => encoding.key === 'x')?.label ?? 'X'
  const yLabel =
    definition.encodings.find((encoding) => encoding.key === 'y')?.label ?? 'Y'
  return (
    <div
      className={`chart-stage ${isDraggingField ? 'is-dragging-field' : ''}`}
    >
      <div className="chart-encoding-overlay">
        <AxisDropZone axis="x" label={xLabel} />
        <AxisDropZone axis="y" label={yLabel} />
      </div>
      <EChartCanvas chart={chart} dataset={dataset} datasetId={datasetId} />
    </div>
  )
}

export default ChartStage
