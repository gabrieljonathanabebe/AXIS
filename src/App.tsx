import { DndContext } from '@dnd-kit/core'

import BuildPanel from './components/build/BuildPanel'
import CanvasPanel from './components/canvas/CanvasPanel'
import DataPanel from './components/data/DataPanel'
import DragPreviewOverlay from './components/dnd/DragPreviewOverlay'
import InspectorPanel from './components/inspector/InspectorPanel'
import NavigationRail from './components/shell/NavigationRail'
import TopBar from './components/shell/TopBar'
import { useChartWorkspace } from './hooks/useChartWorkspace'
import { useDatasets } from './hooks/useDatasets'
import { useWorkspaceCommands } from './hooks/useWorkspaceCommands'
import { useWorkspaceLayout } from './hooks/useWorkspaceLayout'

function App() {
  const {
    activeDatasetSummary,
    dataset: uploadedDataset,
    datasetError,
    isLoading,
    profile,
    semanticRoleOverrides,
    setSemanticRole,
    uploadFile,
  } = useDatasets()

  const {
    activeDrag,
    addChart,
    canRedo,
    canUndo,
    charts,
    clearSelection,
    dashboard,
    dataset,
    duplicateChart,
    handleDragEnd,
    handleDragStart,
    redo,
    removeChart,
    renameDashboard,
    selectedChart,
    selectedChartId,
    selectChart,
    selection,
    sensors,
    setAggregation,
    setChartAppearance,
    setChartType,
    setEncodingField,
    setSelection,
    undo,
    updateAppearance,
    updateChartAppearance,
    updateChartLayout,
    updateChartTitle,
    updateContainer,
    updateDashboardLayout,
    updateInteraction,
  } = useChartWorkspace({ dataset: uploadedDataset })

  const {
    activeWorkspace,
    isBuildPanelCollapsed,
    isInspectorCollapsed,
    setActiveWorkspace,
    toggleBuildPanel,
    toggleInspector,
  } = useWorkspaceLayout()

  const commands = useWorkspaceCommands({
    canRedo,
    canUndo,
    selectedChartId,
    onDuplicateChart: duplicateChart,
    onRedo: redo,
    onRemoveChart: removeChart,
    onToggleBuildPanel: toggleBuildPanel,
    onToggleInspector: toggleInspector,
    onUndo: undo,
  })

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app-shell">
        <TopBar />
        <div className="app-body">
          <NavigationRail
            activeWorkspace={activeWorkspace}
            onWorkspaceChange={setActiveWorkspace}
          />
          <main
            className={`workspace visualize-workspace glass glass-thin ${isBuildPanelCollapsed ? 'is-build-panel-collapsed' : ''} ${isInspectorCollapsed ? 'is-inspector-collapsed' : ''}`}
            hidden={activeWorkspace !== 'visualize'}
          >
            <BuildPanel
              activeDatasetSummary={activeDatasetSummary}
              dataset={dataset}
              isCollapsed={isBuildPanelCollapsed}
              datasetError={datasetError}
              isLoading={isLoading}

              onSelectChartType={addChart}
              onToggleCollapse={toggleBuildPanel}
              onUploadFile={async (file) => {
                await uploadFile(file)
              }}
            />
            <CanvasPanel
              charts={charts}
              commands={commands}
              dashboard={dashboard}
              dataset={dataset}
              datasetId={activeDatasetSummary?.id ?? null}
              isDraggingField={activeDrag?.kind === 'field'}
              selectedChartId={selectedChartId}
              selection={selection}
              onClearSelection={clearSelection}
              onRenameDashboard={renameDashboard}
              onSelectChart={selectChart}
              onSelectData={setSelection}
              onUpdateChartAppearance={updateChartAppearance}
              onUpdateChartLayout={updateChartLayout}
              onUpdateChartTitle={updateChartTitle}
            />
            <InspectorPanel
              chart={selectedChart}
              dashboard={dashboard}
              fields={dataset.fields}
              isCollapsed={isInspectorCollapsed}
              onRenameDashboard={renameDashboard}
              onSetAggregation={setAggregation}
              onSetAppearance={updateAppearance}
              onSetInteraction={updateInteraction}
              onSetChartAppearance={setChartAppearance}
              onSetChartType={setChartType}
              onSetContainer={updateContainer}
              onSetDashboardLayout={updateDashboardLayout}
              onSetEncodingField={setEncodingField}
              onToggleCollapse={toggleInspector}
            />
          </main>
          <main className="workspace" hidden={activeWorkspace !== 'data'}>
            <DataPanel
              dataset={dataset}
              datasetName={activeDatasetSummary?.name ?? 'No dataset'}
              error={datasetError}
              isLoading={isLoading}
              profile={profile}
              semanticRoleOverrides={semanticRoleOverrides}
              onSemanticRoleChange={setSemanticRole}
            />
          </main>
        </div>
      </div>
      <DragPreviewOverlay activeDrag={activeDrag} />
    </DndContext>
  )
}

export default App
