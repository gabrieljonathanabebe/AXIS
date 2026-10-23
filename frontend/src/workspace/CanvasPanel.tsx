import { LayoutDashboard } from 'lucide-react'

import AskCevynBar from '../ai/AskCevynBar'
import CommandButton from '../app/CommandButton'
import EditableText from '../shared/ui/EditableText'
import EmptyState from '../shared/ui/EmptyState'
import Panel from '../shared/ui/Panel'
import ChartGrid from './ChartGrid'
import DashboardSettingsPopover from './DashboardSettingsPopover'

import type { AskCevynState } from '../ai/useAskCevyn'
import type { WorkspaceCommands } from '../app/types'
import type { DataField, Dataset } from '../datasets/types'
import type { DashboardObject, FormatTarget } from '../objects/types'
import type { CanvasActions, DashboardSpec, DataSelection } from './types'

type CanvasPanelProps = {
  actions: CanvasActions
  askCevynState: AskCevynState
  commands: WorkspaceCommands
  dashboard: DashboardSpec
  dataset: Dataset
  datasetId: string | null
  draggedField: DataField | null
  formatTarget: FormatTarget | null
  objects: DashboardObject[]
  recoverFocus?: boolean
  selectedObjectId: string | null
  selection: DataSelection | null
  onAskCevyn: (prompt: string) => void
  onFormatElement: (target: FormatTarget) => void
  onRenameDashboard: (name: string) => void
}

function CanvasPanel({
  actions,
  askCevynState,
  commands,
  dashboard,
  dataset,
  datasetId,
  draggedField,
  formatTarget,
  objects,
  selectedObjectId,
  selection,
  onAskCevyn,
  onFormatElement,
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
        <CommandButton
          command={commands['object.format']}
          size="sm"
          variant="ghost"
        />
        <DashboardSettingsPopover actions={actions} dashboard={dashboard} />
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
          animation={dashboard.animation}
          commands={commands}
          dataset={dataset}
          datasetId={datasetId}
          gap={dashboard.layout.gap}
          draggedField={draggedField}
          formatTarget={formatTarget}
          objects={objects}
          selectedObjectId={selectedObjectId}
          selection={selection}
          onFormatElement={onFormatElement}
        >
          {objects.length === 0 ? (
            <EmptyState
              title="Drop chart type here"
              description="Choose a visual from the Build panel to start."
              icon={<LayoutDashboard />}
              iconVariant="illustration"
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
