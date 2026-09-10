import { Database, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import ChartTypePicker from './components/ChartPicker'
import ChartStage from './components/ChartStage'
import FieldList from './components/FieldList'
import type { ChartConfig, ChartType, DataField, Dataset } from './types/chart'
import { createDemoDataset } from './data/createDemoDataset'
import { getDefaultEncoding } from './chart/getDefaultEncoding'
import Panel from './components/Panel'
import SettingsSummary from './components/SettingsSummary'
import './App.css'

type ActiveSidePanel = "data" | "settings"


function App() {
  const [activeSidePanel, setActiveSidePanel] =
    useState<ActiveSidePanel>('data')
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

  const [selectedField, setSelectedField] = useState<DataField | null>(null)

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

      <Panel eyebrow="Workspace" title="Visualization" className="workspace-panel">
        {chartConfig.type ? (
          <ChartStage chartConfig={chartConfig} dataset={dataset} />
        ) : (
          <ChartTypePicker onSelectChartType={selectChartType} />
        )}
      </Panel>
    </main>
  )
}
export default App
