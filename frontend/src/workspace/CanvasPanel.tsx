import AskCevynBar from '../ai/AskCevynBar'
import ChartGrid from './ChartGrid'
import CommandButton from '../app/CommandButton'
import EditableText from '../shared/ui/EditableText'
import EmptyState from '../shared/ui/EmptyState'
import Panel from '../shared/ui/Panel'

import type { AskCevynState } from '../ai/useAskCevyn'
import type { ChartInstance } from '../charts/types'
import type { Dataset } from '../datasets/types'
import type { CanvasActions, DashboardSpec, DataSelection } from './types'
import type { WorkspaceCommands } from '../app/types'

type CanvasPanelProps = {
  actions: CanvasActions
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
  onRenameDashboard: (name: string) => void
}

function CanvasPanel({
  actions,
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
  onRenameDashboard,
}: CanvasPanelProps) {
  return (
    <Panel className="canvas-panel" isEmbedded isFilled>
      <div className="canvas-toolbar glass glass-thick">
        <CommandButton
          command={commands['history.undo']}
          size="sm"
          variant="ghost"
        />
        <CommandButton
          command={commands['history.redo']}
          size="sm"
          variant="ghost"
        />
      </div>
      <div className="dashboard-surface">
        <h2 className="dashboard-title">
          <EditableText
            className="dashboard-title-text"
            label="Dashboard name"
            placeholder="Untitled dashboard"
            value={dashboard.name}
            onCommit={onRenameDashboard}
          />
        </h2>
        <ChartGrid
          actions={actions}
          charts={charts}
          commands={commands}
          dataset={dataset}
          datasetId={datasetId}
          gap={dashboard.layout.gap}
          isDraggingField={isDraggingField}
          selectedChartId={selectedChartId}
          selection={selection}
        >
          {charts.length === 0 ? (
            <EmptyState
              title="Drop chart type here"
              description="Choose a visual from the Build panel to start."
              recoverFocus
            />
          ) : null}
        </ChartGrid>
      </div>
      <AskCevynBar state={askCevynState} onAsk={onAskCevyn} />
    </Panel>
  )
}

export default CanvasPanel
