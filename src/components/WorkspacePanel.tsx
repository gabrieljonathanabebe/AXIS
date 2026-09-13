import { ChartColumn, Database, RotateCcw } from 'lucide-react'
import ChartStage from './ChartStage'
import DataTable from './DataTable'
import EmptyState from './ui/EmptyState'
import IconButton from './ui/IconButton'
import Panel from './ui/Panel'
import type { ChartConfig, Dataset } from '../types/chart'
import type { WorkspaceView } from '../types/ui'

type WorkspacePanelProps = {
  chartConfig: ChartConfig
  dataset: Dataset
  isDraggingField: boolean
  workspaceView: WorkspaceView
  onResetChart: () => void
  onSetWorkspaceView: (view: WorkspaceView) => void
}

function WorkspacePanel({
  chartConfig,
  dataset,
  isDraggingField,
  workspaceView,
  onResetChart,
  onSetWorkspaceView,
}: WorkspacePanelProps) {
  const isChartView = workspaceView === 'chart'
  const workspaceTitle = isChartView ? 'Visualization' : 'Data'
  return (
    <Panel
      eyebrow="Workspace"
      title={workspaceTitle}
      className="workspace-panel"
      actions={
        <>
          <IconButton
            isActive={isChartView}
            label='Show chart view'
            onClick={() => onSetWorkspaceView('chart')}
          >
            <ChartColumn size={18} />
          </IconButton>
          <IconButton
            isActive={!isChartView}
            label="Show data view"
            onClick={() => onSetWorkspaceView('data')}
          >
            <Database size={18} />
          </IconButton>
          {isChartView && chartConfig.type ? (
            <IconButton
              label="Reset chart"
              onClick={onResetChart}
            >
              <RotateCcw size={18} />
            </IconButton>
          ) : null}
        </>
      }
    >
      {isChartView ? (
        chartConfig.type ? (
          <ChartStage
            chartConfig={chartConfig}
            dataset={dataset}
            isDraggingField={isDraggingField}
          />
        ) : (
          <EmptyState
            dropId='chart-drop-zone'
            title="Drop chart type here"
            description="Choose a chart from the side panel to start building."
          />
        )
      ) : (
        <DataTable dataset={dataset} />
      )}
    </Panel>
  )
}

export default WorkspacePanel
