import { ChartColumn, Database, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import ChartTypePicker from './components/ChartPicker'
import ChartStage from './components/ChartStage'
import FieldList from './components/FieldList'
import type { ChartConfig, ChartType, DataField, Dataset } from './types/chart'
import { createDemoDataset } from './data/createDemoDataset'
import { getDefaultEncoding } from './chart/getDefaultEncoding'
import DataTable from './components/DataTable'
import Panel from './components/Panel'
import SettingsSummary from './components/SettingsSummary'
import './App.css'

type ActiveSidePanel = "data" | "settings"
type WorkspaceView = "chart" | "data"

function App() {
  const [activeSidePanel, setActiveSidePanel] =
    useState<ActiveSidePanel>('data')
  const [workspaceView, setwWorkspaceView] = useState<WorkspaceView>("chart")
  const [dataset] = useState<Dataset>(() => createDemoDataset())

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    encoding: {}
  })

  function selectChartType(type: ChartType) {
    setChartConfig({
      type,
      encoding: getDefaultEncoding(type, dataset),
      aggregate: type === "scatter" ? undefined : "sum",
    })
  }

  function resetChart() {
    setChartConfig({
      encoding: {},
    })
  }

  const [selectedField, setSelectedField] = useState<DataField | null>(null)

  const isChartView = workspaceView === "chart"
  const workspaceTitle = isChartView ? "Visualization" : "Data"
  const isDataPanel = activeSidePanel === 'data'
  const sidePanelTitle = isDataPanel ? 'Fields' : 'Chart'

  return (
    <main className="app-shell">
      <Panel
        as="aside"
        eyebrow="Panel"
        title={sidePanelTitle}
        className="side-panel"
        actions={
          <>
            <button
              className={`control panel-action ${isDataPanel ? 'is-active' : ''}`}
              type="button"
              aria-label="Show data fields"
              onClick={() => setActiveSidePanel('data')}
            >
              <Database size={18} />
            </button>

            <button
              className={`control panel-action ${!isDataPanel ? 'is-active' : ''}`}
              type="button"
              aria-label="Show chart settings"
              onClick={() => setActiveSidePanel('settings')}
            >
              <SlidersHorizontal size={18} />
            </button>
          </>
        }
      >
        {isDataPanel ? (
          <FieldList
            fields={dataset.fields}
            selectedField={selectedField}
            onSelectField={setSelectedField}
          />
        ) : (
          <SettingsSummary chartConfig={chartConfig} />
        )}
      </Panel>

      <Panel
        eyebrow="Workspace"
        title={workspaceTitle}
        className="workspace-panel"
        actions={
          <>
            <button
              className={`control ${isChartView ? "is-active" : ""}`}
              type='button'
              title='Chart View'
              aria-label='Show chart view'
              onClick={() => setwWorkspaceView("chart")}
            >
              <ChartColumn size={18} />
            </button>
            <button
              className={`control ${!isChartView ? "is-active" : ""}`}
              type='button'
              title='Data View'
              aria-label='Show data view'
              onClick={() => setwWorkspaceView("data")}
            >
              <Database size={18} />
            </button>
            {isChartView && chartConfig.type ? (
              <button
                className='control'
                type='button'
                title='Reset chart'
                aria-label='Reset chart'
                onClick={resetChart}
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
            <ChartTypePicker onSelectChartType={selectChartType} />
          )
        ) : (
          <DataTable dataset={dataset} />
        )}
      </Panel>
    </main>
  )
}
export default App
