import ChartGrid from './ChartGrid'
import CommandButton from '../ui/CommandButton'
import EmptyState from '../ui/EmptyState'
import Panel from '../ui/Panel'

import type {
  ChartAppearanceSpec,
  ChartInstance,
  ChartLayout,
  ChartTitleAppearance,
  Dataset,
} from '../../types/chart'
import type { DataSelection } from '../../types/workspace'

import type { WorkspaceCommands } from '../../types/ui'

type CanvasPanelProps = {
  charts: ChartInstance[]
  commands: WorkspaceCommands
  dataset: Dataset
  datasetId: string | null
  isDraggingField: boolean
  recoverFocus?: boolean
  selectedChartId: string | null
  selection: DataSelection | null
  onClearSelection: () => void
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
  commands,
  dataset,
  datasetId,
  isDraggingField,
  selectedChartId,
  selection,
  onClearSelection,
  onSelectChart,
  onSelectData,
  onUpdateChartLayout,
  onUpdateChartTitle,
  onUpdateChartAppearance,
}: CanvasPanelProps) {
  return (
    <Panel
      className="canvas-panel"
      actions={
        <>
          <CommandButton command={commands['history.undo']} />
          <CommandButton command={commands['history.redo']} />
        </>
      }
    >
      {charts.length > 0 ? (
        <ChartGrid
          charts={charts}
          commands={commands}
          dataset={dataset}
          datasetId={datasetId}
          isDraggingField={isDraggingField}
          selectedChartId={selectedChartId}
          selection={selection}
          onClearSelection={onClearSelection}
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
