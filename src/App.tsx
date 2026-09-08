import {
  ChartColumn,
  ChartLine,
  ChartScatter,
  Database,
  SlidersHorizontal
} from "lucide-react"
import { useState } from 'react'
import Panel from './components/Panel'
import './App.css'

type ActiveSidePanel = "data" | "settings"

type DataType = "date" | "number" | "category"

type DataField = {
  name: string
  type: DataType
}

type ChartType = "scatter" | "line" | "bar"

type ChartEncoding = {
  x?: DataField
  y?: DataField
}

type ChartConfig = {
  type?: ChartType
  encoding: ChartEncoding
}

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
          <div className="field-list">
            {sampleFields.map((field) => (
              <button
                className={`chip field-chip ${selectedField?.name === field.name ? 'is-active' : ''
                  }`}
                type='button'
                key={field.name}
                onClick={() => setSelectedField(field)}
              >
                <span>{field.name}</span>
                <span className="field-type">{field.type}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className='settings-summary'>
            <div>
              <span>Chart Type</span>
              <strong>{chartConfig.type}</strong>
            </div>
            <div>
              <span>X</span>
              <strong>{chartConfig.encoding.x?.name ?? "empty"}</strong>
            </div>
            <div>
              <span>Y</span>
              <strong>{chartConfig.encoding.y?.name ?? "empty"}</strong>
            </div>
          </div>
        )}
      </Panel>

      <Panel eyebrow="Workspace" title="Visualization" className="workspace-panel">
        {chartConfig.type ? (
          <div className="chart-stage">
            <div className="chart-empty-state">
              <p>Drag fields onto chart axes.</p>
            </div>
            <div className="chart-axis x-axis">
              <span>X</span>
              <strong>{chartConfig.encoding.x?.name ?? 'empty'}</strong>
            </div>
            <div className="chart-axis y-axis">
              <span>Y</span>
              <strong>{chartConfig.encoding.y?.name ?? 'empty'}</strong>
            </div>
          </div>
        ) : (
          <div className="chart-type-picker">
            <button className="widget" type="button" onClick={() => selectChartType("scatter")}>
              <ChartScatter size={22} />
              <span>Scatter</span>
            </button>
            <button className="widget" type="button" onClick={() => selectChartType("line")}>
              <ChartLine size={22} />
              <span>Line</span>
            </button>
            <button className="widget" type="button" onClick={() => selectChartType("bar")}>
              <ChartColumn size={22} />
              <span>Bar</span>
            </button>
          </div>
        )}

      </Panel>
    </main>
  )
}
export default App
