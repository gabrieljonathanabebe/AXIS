import { useDroppable } from '@dnd-kit/core'
import type { ChartEncoding, ChartInstance, Dataset } from '../types/chart'
import EChartCanvas from './EChartCanvas'

type ChartStageProps = {
  chart: ChartInstance
  dataset: Dataset
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
      aria-label={`Drop field to set ${label}-axis`}
      className={`axis-drop-zone ${axis}-axis-drop-zone ${isOver ? 'is-over' : ''}`}
      ref={setNodeRef}
    >
      <span className="axis-highlight-line" />
      <span className="axis-highlight-dot axis-highlight-dot-start" />
      <span className="axis-highlight-dot axis-highlight-dot-end" />
      <span className="axis-drop-label">Drop here to set {label}-axis</span>
    </div>
  )
}

function ChartStage({ chart, dataset, isDraggingField }: ChartStageProps) {
  return (
    <div
      className={`chart-stage ${isDraggingField ? 'is-dragging-field' : ''}`}
    >
      <div className="chart-encoding-overlay">
        <AxisDropZone axis="x" label="X" />
        <AxisDropZone axis="y" label="Y" />
      </div>
      <EChartCanvas chart={chart} dataset={dataset} />
    </div>
  )
}

export default ChartStage
