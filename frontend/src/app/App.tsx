import { DndContext } from '@dnd-kit/core'

import BuildPanel from '../workspace/BuildPanel'
import CanvasPanel from '../workspace/CanvasPanel'
import { createInspectorActions } from '../inspector/createInspectorActions'
import DataPanel from '../datasets/DataPanel'
import DragPreviewOverlay from '../workspace/DragPreviewOverlay'
import InspectorPanel from '../inspector/InspectorPanel'
import NavigationRail from './NavigationRail'
import TopBar from './TopBar'
import { useAskCevyn } from '../ai/useAskCevyn'
import { useChartWorkspace } from '../workspace/useChartWorkspace'
import { useDatasets } from '../datasets/useDatasets'
import { useWorkspaceCommands } from './useWorkspaceCommands'
import { useWorkspaceLayout } from './useWorkspaceLayout'

function App() {
  const {
    activeDatasetSummary,
    dataset: uploadedDataset,
    datasetError,
    datasetId,
    datasetName,
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
    canvasActions,
    charts,
    dashboard,
    dataset,
    dispatch,
    duplicateChart,
    handleDragEnd,
    handleDragStart,
    redo,
    removeChart,
    renameDashboard,
    runActions,
    selectedChart,
    selectedChartId,
    selection,
    sensors,
    undo,
  } = useChartWorkspace({ dataset: uploadedDataset })

  const inspectorActions = createInspectorActions({
    dataset,
    dispatch,
    selectedChartId,
  })

  const { askCevyn, askCevynState } = useAskCevyn({
    charts,
    dataset,
    datasetId,
    runActions,
  })

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
              datasetName={datasetName}
              isCollapsed={isBuildPanelCollapsed}
              datasetError={datasetError}
              isLoading={isLoading}
              onSelectChartType={addChart}
              onToggleCollapse={toggleBuildPanel}
              onUploadFile={async (file) => {
                await uploadFile(file)
              }}
              profile={profile}
              semanticRoleOverrides={semanticRoleOverrides}
            />
            <CanvasPanel
              actions={canvasActions}
              askCevynState={askCevynState}
              charts={charts}
              commands={commands}
              dashboard={dashboard}
              dataset={dataset}
              datasetId={datasetId}
              isDraggingField={activeDrag?.kind === 'field'}
              selectedChartId={selectedChartId}
              selection={selection}
              onAskCevyn={askCevyn}
              onRenameDashboard={renameDashboard}
            />
            <InspectorPanel
              actions={inspectorActions}
              chart={selectedChart}
              dashboard={dashboard}
              fields={dataset.fields}
              isCollapsed={isInspectorCollapsed}
              onRenameDashboard={renameDashboard}
              onToggleCollapse={toggleInspector}
            />
          </main>
          <main className="workspace" hidden={activeWorkspace !== 'data'}>
            <DataPanel
              dataset={dataset}
              datasetId={datasetId}
              datasetName={datasetName}
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
