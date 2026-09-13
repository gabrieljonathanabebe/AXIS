import { useDroppable } from '@dnd-kit/core'
import type {
  ChartConfig,
  ChartEncoding,
  Dataset
} from '../types/chart'
import EChartCanvas from './EChartCanvas'

type ChartStageProps = {
  chartConfig: ChartConfig
  dataset: Dataset
}

type AxisDropSlotProps = {
  axis: keyof ChartEncoding
  label: string
  value: string
}

function AxisDropSlot({ axis, label, value }: AxisDropSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `axis:${axis}`,
  })

  return (
    <div
      className={`axis-slot stack ${axis}-slot ${isOver ? "is-over" : ""}`}
      ref={setNodeRef}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      <small>Drop field</small>
    </div>
  )
}

function ChartStage({
  chartConfig,
  dataset,
}: ChartStageProps) {
  return (
    <div className="chart-stage">
      <div className='chart-encoding-overlay'>
        <AxisDropSlot
          axis="x"
          label="X"
          value={chartConfig.encoding.x?.name ?? 'empty'}
        />
        <AxisDropSlot
          axis="y"
          label="Y"
          value={chartConfig.encoding.y?.name ?? 'empty'}
        />
      </div>
      <EChartCanvas chartConfig={chartConfig} dataset={dataset} />
    </div>
  )
}

export default ChartStage
