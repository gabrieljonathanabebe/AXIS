import { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import type { ActiveSidePanel, WorkspaceView } from './types/ui'
import DragPreviewOverlay from './components/DragPreviewOverlay'
import { useChartWorkspace } from './hooks/useChartWorkspace'
import { useDatasets } from './hooks/useDatasets'
import SidePanel from './components/SidePanel'
import WorkspacePanel from './components/WorkspacePanel'

function App() {
  const {
    activeDatasetSummary,
    dataset: uploadedDataset,
    isUploading,
    uploadError,
    uploadFile,
  } = useDatasets()
  const {
    activeDrag,
    chartConfig,
    dataset,
    handleDragEnd,
    handleDragStart,
    resetChart,
    selectedField,
    selectChartType,
    sensors,
    setAggregation,
    setEncodingField,
    setSelectedField,
  } = useChartWorkspace({
    dataset: uploadedDataset,
  })
  const [activeSidePanel, setActiveSidePanel] =
    useState<ActiveSidePanel>('fields')
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("chart")

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className={`app-shell ${workspaceView === 'data' ? 'is-data-view' : ''}`}>
        {workspaceView === 'chart' ? (
          <SidePanel
            activeDatasetSummary={activeDatasetSummary}
            activeSidePanel={activeSidePanel}
            chartConfig={chartConfig}
            fields={dataset.fields}
            isUploading={isUploading}
            selectedField={selectedField}
            onSelectField={setSelectedField}
            onSelectChartType={selectChartType}
            onSetActiveSidePanel={setActiveSidePanel}
            onSetAggregation={setAggregation}
            onSetEncodingField={setEncodingField}
            onUploadFile={async (file) => {
              await uploadFile(file)
              setWorkspaceView('data')
            }}
            uploadError={uploadError}
          />
        ) : null}
        <WorkspacePanel
          chartConfig={chartConfig}
          dataset={dataset}
          isDraggingField={activeDrag?.kind === 'field'}
          workspaceView={workspaceView}
          onResetChart={resetChart}
          onSetWorkspaceView={setWorkspaceView}
        />
      </main>
      <DragPreviewOverlay activeDrag={activeDrag} />
    </DndContext>
  )
}
export default App
