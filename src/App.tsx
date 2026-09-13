import { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import type { ActiveSidePanel, WorkspaceView } from './types/ui'
import FieldDragOverlay from './components/FieldDragOverlay'
import { useChartWorkspace } from './hooks/useChartWorkspace'
import SidePanel from './components/SidePanel'
import WorkspacePanel from './components/WorkspacePanel'

function App() {
  const {
    activeDragField,
    chartConfig,
    dataset,
    handleDragEnd,
    handleDragStart,
    resetChart,
    selectedField,
    selectChartType,
    sensors,
    setSelectedField,
  } = useChartWorkspace()
  const [activeSidePanel, setActiveSidePanel] =
    useState<ActiveSidePanel>('data')
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("chart")

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="app-shell">
        <SidePanel
          activeSidePanel={activeSidePanel}
          chartConfig={chartConfig}
          fields={dataset.fields}
          selectedField={selectedField}
          onSelectField={setSelectedField}
          onSetActiveSidePanel={setActiveSidePanel}
        />
        <WorkspacePanel
          chartConfig={chartConfig}
          dataset={dataset}
          workspaceView={workspaceView}
          onResetChart={resetChart}
          onSelectChartType={selectChartType}
          onSetWorkspaceView={setWorkspaceView}
        />
      </main>
      <FieldDragOverlay activeField={activeDragField} />
    </DndContext>
  )
}
export default App
