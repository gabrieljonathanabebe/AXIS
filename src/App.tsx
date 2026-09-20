import { DndContext } from '@dnd-kit/core'

import BuildPanel from './components/build/BuildPanel'
import CanvasPanel from './components/canvas/CanvasPanel'
import DragPreviewOverlay from './components/dnd/DragPreviewOverlay'
import InspectorPanel from './components/inspector/InspectorPanel'
import { useChartWorkspace } from './hooks/useChartWorkspace'
import { useDatasets } from './hooks/useDatasets'

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
    dataset,
    handleDragEnd,
    handleDragStart,
    resetChart,
    selectedChart,
    selectedField,
    selectChartType,
    sensors,
    setAggregation,
    setChartAppearance,
    setEncodingField,
    setSelectedField,
    updateAppearance,
    updateInteraction,
  } = useChartWorkspace({ dataset: uploadedDataset })
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="app-shell">
        <BuildPanel
          activeDatasetSummary={activeDatasetSummary}
          fields={dataset.fields}
          isUploading={isUploading}
          selectedField={selectedField}
          uploadError={uploadError}
          onSelectChartType={selectChartType}
          onSelectField={setSelectedField}
          onUploadFile={async (file) => {
            await uploadFile(file)
          }}
        />
        <CanvasPanel
          chart={selectedChart}
          dataset={dataset}
          isDraggingField={activeDrag?.kind === 'field'}
          onResetChart={resetChart}
        />
        <InspectorPanel
          chart={selectedChart}
          fields={dataset.fields}
          onSetAggregation={setAggregation}
          onSetAppearance={updateAppearance}
          onSetInteraction={updateInteraction}
          onSetChartAppearance={setChartAppearance}
          onSetEncodingField={setEncodingField}
        />
      </main>
      <DragPreviewOverlay activeDrag={activeDrag} />
    </DndContext>
  )
}

export default App
