import { Database, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import ChartTypePicker from './components/ChartPicker'
import ChartStage from './components/ChartStage'
import FieldList from './components/FieldList'
import type { ChartConfig, ChartType, DataField } from './types/chart'
import Panel from './components/Panel'
import SettingsSummary from './components/SettingsSummary'
import './App.css'

type ActiveSidePanel = "data" | "settings"

const sampleFields: DataField[] = [
  { name: "date", type: "date" },
  { name: "revenue", type: "number" },
  { name: "country", type: "category" },
]

function App() {
  const [activeSidePanel, setActiveSidePanel] =
    useState<ActiveSidePanel>('data')

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    encoding: {}
  })

  function selectChartType(type: ChartType) {
    setChartConfig((currentConfig) => ({
      ...currentConfig,
      type,
    }))
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
            fields={sampleFields}
            selectedField={selectedField}
            onSelectField={setSelectedField}
          />
        ) : (
          <SettingsSummary chartConfig={chartConfig} />
        )}
      </Panel>

      <Panel eyebrow="Workspace" title="Visualization" className="workspace-panel">
        {chartConfig.type ? (
          <ChartStage chartConfig={chartConfig} />
        ) : (
          <ChartTypePicker onSelectChartType={selectChartType} />
        )}
      </Panel>
    </main>
  )
}
export default App
