import { Copy, Trash2 } from 'lucide-react'
import ChartGrid from './ChartGrid'
import EmptyState from '../ui/EmptyState'
import IconButton from '../ui/IconButton'
import Panel from '../ui/Panel'
import type { ChartInstance, ChartLayout, Dataset } from '../../types/chart'

type CanvasPanelProps = {
  charts: ChartInstance[]
  dataset: Dataset
  datasetId: string | null
  isDraggingField: boolean
  selectedChartId: string | null
  onDuplicateChart: () => void
  onRemoveChart: () => void
  onSelectChart: (chartId: string | null) => void
  onUpdateChartLayout: (chartId: string, layout: ChartLayout) => void
}

function CanvasPanel({
  charts,
  dataset,
  datasetId,
  isDraggingField,
  selectedChartId,
  onDuplicateChart,
  onRemoveChart,
  onSelectChart,
  onUpdateChartLayout,
}: CanvasPanelProps) {
  return (
    <Panel
      eyebrow="Canvas"
      title="Canvas"
      className="canvas-panel"
      actions={
        selectedChartId ? (
          <>
            <IconButton label="Duplicate chart" onClick={onDuplicateChart}>
              <Copy size={18} />
            </IconButton>
            <IconButton label="Delete chart" onClick={onRemoveChart}>
              <Trash2 size={18} />
            </IconButton>
          </>
        ) : null
      }
    >
      {charts.length > 0 ? (
        <ChartGrid
          charts={charts}
          dataset={dataset}
          datasetId={datasetId}
          isDraggingField={isDraggingField}
          selectedChartId={selectedChartId}
          onSelectChart={onSelectChart}
          onUpdateChartLayout={onUpdateChartLayout}
        />
      ) : (
        <EmptyState
          dropId="chart-drop-zone"
          dropTarget={{ kind: 'canvas' }}
          title="Drop chart type here"
          description="Choose a visual from the Build panel to start."
        />
      )}
    </Panel>
  )
}

export default CanvasPanel
