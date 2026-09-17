import { RotateCcw } from 'lucide-react'
import ChartStage from './ChartStage'
import EmptyState from './ui/EmptyState'
import IconButton from './ui/IconButton'
import Panel from './ui/Panel'
import type { ChartConfig, Dataset } from '../types/chart'

type CanvasPanelProps = {
  chartConfig: ChartConfig
  dataset: Dataset
  isDraggingField: boolean
  onResetChart: () => void
}

function CanvasPanel({
  chartConfig,
  dataset,
  isDraggingField,
  onResetChart,
}: CanvasPanelProps) {
  return (
    <Panel
      eyebrow="Canvas"
      title="Canvas"
      className="canvas-panel"
      actions={
        chartConfig.type ? (
          <IconButton label="Reset chart" onClick={onResetChart}>
            <RotateCcw size={18} />
          </IconButton>
        ) : null
      }
    >
      {chartConfig.type ? (
        <ChartStage
          chartConfig={chartConfig}
          dataset={dataset}
          isDraggingField={isDraggingField}
        />
      ) : (
        <EmptyState
          dropId="chart-drop-zone"
          title="Drop chart type here"
          description="Choose a visual from the Build panel to start."
        />
      )}
    </Panel>
  )
}

export default CanvasPanel
