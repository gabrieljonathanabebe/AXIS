import { ChartColumn, Database, RotateCcw } from 'lucide-react'
import ChartTypePicker from './ChartPicker'
import ChartStage from './ChartStage'
import DataTable from './DataTable'
import IconButton from './ui/IconButton'
import Panel from './ui/Panel'
import type { ChartConfig, ChartType, Dataset } from '../types/chart'
import type { WorkspaceView } from '../types/ui'

type WorkspacePanelProps = {
  chartConfig: ChartConfig
  dataset: Dataset
  workspaceView: WorkspaceView
  onResetChart: () => void
  onSelectChartType: (type: ChartType) => void
  onSetWorkspaceView: (view: WorkspaceView) => void
}

function WorkspacePanel({
  chartConfig,
  dataset,
  workspaceView,
  onResetChart,
  onSelectChartType,
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
          <ChartStage chartConfig={chartConfig} dataset={dataset} />
        ) : (
          <ChartTypePicker onSelectChartType={onSelectChartType} />
        )
      ) : (
        <DataTable dataset={dataset} />
      )}
    </Panel>
  )
}

export default WorkspacePanel