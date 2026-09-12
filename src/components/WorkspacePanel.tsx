import { ChartColumn, Database, RotateCcw } from 'lucide-react'
import ChartTypePicker from './ChartPicker'
import ChartStage from './ChartStage'
import DataTable from './DataTable'
import Panel from './Panel'
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
          <button
            className={`control ${isChartView ? 'is-active' : ''}`}
            type="button"
            title="Chart View"
            aria-label="Show chart view"
            onClick={() => onSetWorkspaceView('chart')}
          >
            <ChartColumn size={18} />
          </button>
          <button
            className={`control ${!isChartView ? 'is-active' : ''}`}
            type="button"
            title="Data View"
            aria-label="Show data view"
            onClick={() => onSetWorkspaceView('data')}
          >
            <Database size={18} />
          </button>
          {isChartView && chartConfig.type ? (
            <button
              className="control"
              type="button"
              title="Reset chart"
              aria-label="Reset chart"
              onClick={onResetChart}
            >
              <RotateCcw size={18} />
            </button>
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