import { DndContext } from '@dnd-kit/core'

import BuildPanel from './components/BuildPanel'
import CanvasPanel from './components/CanvasPanel'
import DragPreviewOverlay from './components/DragPreviewOverlay'
import InspectorPanel from './components/InspectorPanel'
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
    chartConfig,
    dataset,
    handleDragEnd,
    handleDragStart,
    resetChart,
    selectedField,
    selectChartType,
    sensors,
    setAggregation,
    setAppearance,
    setChartAppearance,
    setEncodingField,
    setSelectedField,
  } = useChartWorkspace({
    dataset: uploadedDataset,
  })
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
          chartConfig={chartConfig}
          dataset={dataset}
          isDraggingField={activeDrag?.kind === 'field'}
          onResetChart={resetChart}
        />
        <InspectorPanel
          chartConfig={chartConfig}
          fields={dataset.fields}
          onSetAggregation={setAggregation}
          onSetAppearance={setAppearance}
          onSetChartAppearance={setChartAppearance}
          onSetEncodingField={setEncodingField}
        />
      </main>
      <DragPreviewOverlay activeDrag={activeDrag} />
    </DndContext>
  )
}
export default App
