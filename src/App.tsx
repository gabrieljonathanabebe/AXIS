import { Database, SlidersHorizontal } from 'lucide-react'
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

type EncodingChannel = "x" | "y"

type ChartConfig = {
  type: ChartType
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
    type: "scatter",
    encoding: {}
  })

  const [selectedField, setSelectedField] = useState<DataField | null>(null)

  function assignSelectedField(channel: EncodingChannel) {
    if (!selectedField) {
      return
    }
    setChartConfig((currentConfig) => ({
      ...currentConfig,
      encoding: {
        ...currentConfig.encoding,
        [channel]: selectedField,
      },
    }))
  }

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
              className={`panel-action ${isDataPanel ? 'panel-action-active' : ''}`}
              type="button"
              aria-label="Show data fields"
              onClick={() => setActiveSidePanel('data')}
            >
              <Database size={18} />
            </button>

            <button
              className={`panel-action ${!isDataPanel ? 'panel-action-active' : ''}`}
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
                className={`field-chip ${selectedField?.name === field.name
                  ? "field-chip-active"
                  : ""
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
        <div className="chart-stage">
          <p>Drop fields to build a visualization.</p>
        </div>
        <div className="encoding-zones">
          <button
            className="drop-zone"
            type="button"
            onClick={() => assignSelectedField("x")}
          >
            <span>X</span>
            <span>{chartConfig.encoding.x?.name ?? 'empty'}</span>
          </button>

          <button
            className="drop-zone"
            type="button"
            onClick={() => assignSelectedField("y")}
          >
            <span>Y</span>
            <span>{chartConfig.encoding.y?.name ?? 'empty'}</span>
          </button>
        </div>
      </Panel>
    </main>
  )
}
export default App
