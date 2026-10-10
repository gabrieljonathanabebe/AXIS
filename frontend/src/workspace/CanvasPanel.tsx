import AskCevynBar from '../ai/AskCevynBar'
import ChartGrid from './ChartGrid'
import CommandButton from '../app/CommandButton'
import EditableText from '../shared/ui/EditableText'
import EmptyState from '../shared/ui/EmptyState'
import Panel from '../shared/ui/Panel'

import type { AskCevynState } from '../ai/useAskCevyn'
import type {
  ChartAppearanceSpec,
  ChartInstance,
  ChartLayout,
} from '../charts/types'
import type { Dataset } from '../datasets/types'
import type { DashboardSpec, DataSelection } from './types'
import type { WorkspaceCommands } from '../app/types'

type CanvasPanelProps = {
  askCevynState: AskCevynState
  charts: ChartInstance[]
  commands: WorkspaceCommands
  dashboard: DashboardSpec
  dataset: Dataset
  datasetId: string | null
  isDraggingField: boolean
  recoverFocus?: boolean
  selectedChartId: string | null
  selection: DataSelection | null
  onAskCevyn: (prompt: string) => void
  onClearSelection: () => void
  onRenameDashboard: (name: string) => void
  onSelectChart: (chartId: string | null) => void
  onSelectData: (selection: DataSelection) => void
  onUpdateChartAppearance: <TKey extends keyof ChartAppearanceSpec>(
    chartId: string,
    key: TKey,
    value: ChartAppearanceSpec[TKey],
  ) => void

  onUpdateChartLayout: (chartId: string, layout: ChartLayout) => void
}

function CanvasPanel({
  askCevynState,
  charts,
  commands,
  dashboard,
  dataset,
  datasetId,
  isDraggingField,
  selectedChartId,
  selection,
  onAskCevyn,
  onClearSelection,
  onRenameDashboard,
  onSelectChart,
  onSelectData,
  onUpdateChartLayout,
  onUpdateChartAppearance,
}: CanvasPanelProps) {
  return (
    <Panel
      className="canvas-panel"
      isEmbedded
      isFilled
      heading={
        <EditableText
          className="canvas-panel-title"
          label="Dashboard name"
          placeholder="Untitled dashboard"
          value={dashboard.name}
          onCommit={onRenameDashboard}
        />
      }
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
          gap={dashboard.layout.gap}
          isDraggingField={isDraggingField}
          selectedChartId={selectedChartId}
          selection={selection}
          onClearSelection={onClearSelection}
          onSelectChart={onSelectChart}
          onSelectData={onSelectData}
          onUpdateChartAppearance={onUpdateChartAppearance}
          onUpdateChartLayout={onUpdateChartLayout}
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
      <AskCevynBar state={askCevynState} onAsk={onAskCevyn} />
    </Panel>
  )
}

export default CanvasPanel
