import { ChartColumn, Database, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import ChartTypePicker from './components/ChartPicker'
import ChartStage from './components/ChartStage'
import FieldList from './components/FieldList'
import type {
  ChartConfig,
  ChartEncoding,
  ChartType,
  DataField,
  Dataset,
} from './types/chart'
import { createDemoDataset } from './data/createDemoDataset'
import { getDefaultEncoding } from './chart/getDefaultEncoding'
import DataTable from './components/DataTable'
import Panel from './components/Panel'
import SettingsSummary from './components/SettingsSummary'
import DataTypeIcon from './components/DataTypeIcon'
import './App.css'

type ActiveSidePanel = "data" | "settings"
type WorkspaceView = "chart" | "data"

function App() {
  const [activeSidePanel, setActiveSidePanel] =
    useState<ActiveSidePanel>('data')
  const [workspaceView, setwWorkspaceView] = useState<WorkspaceView>("chart")
  const [dataset] = useState<Dataset>(() => createDemoDataset())
  const [activeDragField, setActiveDragField] = useState<DataField | null>(null)
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    encoding: {}
  })
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  function handleDragStart(event: DragStartEvent) {
    const field = findFieldByDragId(String(event.active.id))
    setActiveDragField(field ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragField(null)
    const field = findFieldByDragId(String(event.active.id))
    const axis = String(event.over?.id)
    if (!field) {
      return
    }
    if (axis === 'axis:x') {
      assignFieldToAxis('x', field)
    }
    if (axis === 'axis:y') {
      assignFieldToAxis('y', field)
    }
  }

  function selectChartType(type: ChartType) {
    setChartConfig({
      type,
      encoding: getDefaultEncoding(type, dataset),
      aggregate: type === "scatter" ? undefined : "sum",
    })
  }

  function assignFieldToAxis(axis: keyof ChartEncoding, field: DataField) {
    setChartConfig((currentConfig) => ({
      ...currentConfig,
      encoding: {
        ...currentConfig.encoding,
        [axis]: field
      },
    }))
  }

  function findFieldByDragId(id: string) {
    const fieldName = id.replace("field:", "")
    return dataset.fields.find((field) => field.name === fieldName)
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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
              <ChartStage
                chartConfig={chartConfig}
                dataset={dataset}
              />
            ) : (
              <ChartTypePicker onSelectChartType={selectChartType} />
            )
          ) : (
            <DataTable dataset={dataset} />
          )}
        </Panel>
      </main>
      <DragOverlay>
        {activeDragField ? (
          <div className='chip field-chip drag-overlay-chip'>
            <span className='field-chip-title'>
              <span className='field-chip-icon'>
                <DataTypeIcon type={activeDragField.type} />
              </span>
              <span>{activeDragField.name}</span>
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
export default App
