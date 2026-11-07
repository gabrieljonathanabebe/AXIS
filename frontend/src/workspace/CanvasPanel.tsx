import { LayoutDashboard } from 'lucide-react'

import AskCevynBar from '../ai/AskCevynBar'
import CommandButton from '../app/CommandButton'
import { getFillsCss } from '../shared/fill'
import EditableText from '../shared/ui/EditableText'
import EmptyState from '../shared/ui/EmptyState'
import Panel from '../shared/ui/Panel'
import ChartGrid from './ChartGrid'
import DashboardFormatPanel from './DashboardFormatPanel'

import type { CSSProperties } from 'react'
import type { AskCevynState } from '../ai/useAskCevyn'
import type { WorkspaceCommands } from '../app/types'
import type { DashboardStyle } from '../dashboardStyle/types'
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
  style: DashboardStyle
  onAskCevyn: (prompt: string) => void
  onFormatElement: (target: FormatTarget) => void
  onRenameDashboard: (name: string) => void
}

type DashboardPageStyle = CSSProperties & {
  '--canvas-background': string
  '--canvas-text': string
  '--canvas-text-muted': string
}

/**
 * Canvas of the Visualize workspace: a neutral area with the toolbar and
 * Ask Cevyn around the page of the dashboard. The page carries the style
 * (fills and text colors), the name and the objects; it stays in place
 * and its content scrolls.
 */
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
  style,
  onAskCevyn,
  onFormatElement,
  onRenameDashboard,
}: CanvasPanelProps) {
  const { background } = dashboard.canvas
  const pageStyle: DashboardPageStyle = {
    '--canvas-background': getFillsCss(background),
    '--canvas-text': style.colors.text,
    '--canvas-text-muted': style.colors.textMuted,
  }
  return (
    <Panel
      actions={
        <>
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
            command={commands['layout.toggleFormatPanel']}
            size="sm"
            variant="ghost"
          />
          <DashboardFormatPanel actions={actions} dashboard={dashboard} />
        </>
      }
      className="canvas-panel"
      isEmbedded
      isFilled
    >
      <div className="dashboard-page" style={pageStyle}>
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
          style={style}
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
