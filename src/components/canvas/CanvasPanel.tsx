import { Copy, Trash2 } from 'lucide-react'

import ChartGrid from './ChartGrid'
import EmptyState from '../ui/EmptyState'
import IconButton from '../ui/IconButton'
import Panel from '../ui/Panel'

import type {
  ChartAppearanceSpec,
  ChartInstance,
  ChartLayout,
  ChartTitleAppearance,
  Dataset,
} from '../../types/chart'
import type { DataSelection } from '../../types/workspace'

type CanvasPanelProps = {
  charts: ChartInstance[]
  dataset: Dataset
  datasetId: string | null
  isDraggingField: boolean
  recoverFocus?: boolean
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

function CanvasPanel({
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
  onUpdateChartLayout,
  onUpdateChartTitle,
  onUpdateChartAppearance,
}: CanvasPanelProps) {
  return (
    <Panel
      eyebrow="Canvas"
      title="Canvas"
      className="canvas-panel"
      actions={
        selectedChartId ? (
          <>
            <IconButton
              label="Duplicate chart"
              onClick={() => onDuplicateChart(selectedChartId)}
            >
              <Copy size={18} />
            </IconButton>
            <IconButton
              label="Delete chart"
              onClick={() => onRemoveChart(selectedChartId)}
            >
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
          selection={selection}
          onClearSelection={onClearSelection}
          onDuplicateChart={onDuplicateChart}
          onRemoveChart={onRemoveChart}
          onSelectChart={onSelectChart}
          onSelectData={onSelectData}
          onUpdateChartAppearance={onUpdateChartAppearance}
          onUpdateChartLayout={onUpdateChartLayout}
          onUpdateChartTitle={onUpdateChartTitle}
        />
      ) : (
        <EmptyState
          dropId="chart-drop-zone"
          dropTarget={{ kind: 'canvas' }}
          title="Drop chart type here"
          description="Choose a visual from the Build panel to start."
          recoverFocus
        />
      )}
    </Panel>
  )
}

export default CanvasPanel
