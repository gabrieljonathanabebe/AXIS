import { DndContext } from '@dnd-kit/core'

import BuildPanel from './components/build/BuildPanel'
import CanvasPanel from './components/canvas/CanvasPanel'
import DragPreviewOverlay from './components/dnd/DragPreviewOverlay'
import InspectorPanel from './components/inspector/InspectorPanel'
import { useChartWorkspace } from './hooks/useChartWorkspace'
import { useDatasets } from './hooks/useDatasets'
import { useWorkspaceLayout } from './hooks/useWorkspaceLayout'

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
    addChart,
    charts,
    clearSelection,
    dataset,
    duplicateChart,
    handleDragEnd,
    handleDragStart,
    removeChart,
    selectedChart,
    selectedChartId,
    selectedField,
    selectChart,
    selection,
    sensors,
    setAggregation,
    setChartAppearance,
    setChartType,
    setEncodingField,
    setSelection,
    setSelectedField,
    updateAppearance,
    updateChartAppearance,
    updateChartLayout,
    updateChartTitle,
    updateContainer,
    updateInteraction,
  } = useChartWorkspace({ dataset: uploadedDataset })
  const {
    isBuildPanelCollapsed,
    isInspectorCollapsed,
    toggleBuildPanel,
    toggleInspector,
  } = useWorkspaceLayout()

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main
        className={`app-shell ${isBuildPanelCollapsed ? 'is-build-panel-collapsed' : ''} ${isInspectorCollapsed ? 'is-inspector-collapsed' : ''}`}
      >
        <BuildPanel
          activeDatasetSummary={activeDatasetSummary}
          fields={dataset.fields}
          isCollapsed={isBuildPanelCollapsed}
          isUploading={isUploading}
          selectedField={selectedField}
          uploadError={uploadError}
          onSelectChartType={addChart}
          onSelectField={setSelectedField}
          onToggleCollapse={toggleBuildPanel}
          onUploadFile={async (file) => {
            await uploadFile(file)
          }}
        />
        <CanvasPanel
          charts={charts}
          dataset={dataset}
          datasetId={activeDatasetSummary?.id ?? null}
          isDraggingField={activeDrag?.kind === 'field'}
          selectedChartId={selectedChartId}
          selection={selection}
          onClearSelection={clearSelection}
          onDuplicateChart={duplicateChart}
          onRemoveChart={removeChart}
          onSelectChart={selectChart}
          onSelectData={setSelection}
          onUpdateChartAppearance={updateChartAppearance}
          onUpdateChartLayout={updateChartLayout}
          onUpdateChartTitle={updateChartTitle}
        />
        <InspectorPanel
          chart={selectedChart}
          fields={dataset.fields}
          isCollapsed={isInspectorCollapsed}
          onSetAggregation={setAggregation}
          onSetAppearance={updateAppearance}
          onSetInteraction={updateInteraction}
          onSetChartAppearance={setChartAppearance}
          onSetChartType={setChartType}
          onSetContainer={updateContainer}
          onSetEncodingField={setEncodingField}
          onToggleCollapse={toggleInspector}
        />
      </main>
      <DragPreviewOverlay activeDrag={activeDrag} />
    </DndContext>
  )
}

export default App
