import { DndContext } from '@dnd-kit/core'
import { useMemo, useState } from 'react'

import { useAskCevyn } from '../ai/useAskCevyn'
import CardFormatPanel from '../cards/CardFormatPanel'
import { isCardFormatElement } from '../cards/isCardFormatElement'
import { createChartActions } from '../charts/createChartActions'
import ChartFormatPanel from '../charts/format/ChartFormatPanel'
import { isChartFormatElement } from '../charts/getFormatElements'
import { createStyleColorPresets } from '../dashboardStyle/styleColorPresets'
import DataPanel from '../datasets/DataPanel'
import { useDatasets } from '../datasets/useDatasets'
import { getObjectDefinition } from '../objects/objectDefinitions'
import { SharedColorPresets } from '../shared/ui/colorPresets'
import BuildPanel from '../workspace/BuildPanel'
import CanvasPanel from '../workspace/CanvasPanel'
import DragPreviewOverlay from '../workspace/DragPreviewOverlay'
import { useChartWorkspace } from '../workspace/useChartWorkspace'
import NavigationRail from './NavigationRail'
import TopBar from './TopBar'
import { useWorkspaceCommands } from './useWorkspaceCommands'
import { useWorkspaceLayout } from './useWorkspaceLayout'

import type { FormatTarget } from '../objects/types'

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
    addObject,
    canRedo,
    canUndo,
    canvasActions,
    charts,
    dashboard,
    dataset,
    dispatch,
    duplicateObject,
    handleDragEnd,
    handleDragStart,
    objects,
    redo,
    removeObject,
    renameDashboard,
    runActions,
    selectedChart,
    selectedObjectId,
    selection,
    sensors,
    style,
    undo,
  } = useChartWorkspace({ dataset: uploadedDataset })

  const chartActions = createChartActions({
    dispatch,
    selectedChartId: selectedChart?.id ?? null,
    style,
  })
  const stylePresets = useMemo(() => {
    return createStyleColorPresets(style)
  }, [style])
  // Format popovers belong to the selected object and close when it changes.
  const [formatTarget, setFormatTarget] = useState<FormatTarget | null>(null)
  const activeFormatTarget =
    formatTarget?.objectId === selectedObjectId ? formatTarget : null
  const selectedObject = objects.find(({ id }) => id === selectedObjectId)
  const selectedCard = selectedObject?.kind === 'card' ? selectedObject : null

  /** Opens the format panel of an object at its container. */
  function openObjectFormat(objectId: string): void {
    setFormatTarget({ element: 'container', objectId })
  }

  const { askCevyn, askCevynState } = useAskCevyn({
    charts,
    dataset,
    datasetId,
    runActions,
  })

  const {
    activeWorkspace,
    isBuildPanelCollapsed,
    isFormatPanelCollapsed,
    setActiveWorkspace,
    toggleBuildPanel,
    toggleFormatPanel,
  } = useWorkspaceLayout()

  const commands = useWorkspaceCommands({
    canRedo,
    canUndo,
    isFormatOpen: activeFormatTarget !== null,
    isFormatPanelCollapsed,
    selectedObjectId,
    selectedObjectLabel: selectedObject
      ? getObjectDefinition(selectedObject.kind).label
      : 'object',
    onCloseFormat: () => setFormatTarget(null),
    onDuplicateObject: duplicateObject,
    onFormatObject: openObjectFormat,
    onRedo: redo,
    onRemoveObject: removeObject,
    onToggleBuildPanel: toggleBuildPanel,
    onToggleFormatPanel: toggleFormatPanel,
    onUndo: undo,
  })

  return (
    <SharedColorPresets value={stylePresets}>
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
              className={`workspace visualize-workspace glass glass-thin ${isBuildPanelCollapsed ? 'is-build-panel-collapsed' : ''}`}
              hidden={activeWorkspace !== 'visualize'}
            >
              <BuildPanel
                activeDatasetSummary={activeDatasetSummary}
                chart={selectedChart}
                chartActions={chartActions}
                dataset={dataset}
                datasetName={datasetName}
                isCollapsed={isBuildPanelCollapsed}
                datasetError={datasetError}
                isLoading={isLoading}
                onAddObject={addObject}
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
                commands={commands}
                dashboard={dashboard}
                dataset={dataset}
                datasetId={datasetId}
                draggedField={
                  activeDrag?.kind === 'field' ? activeDrag.field : null
                }
                formatTarget={activeFormatTarget}
                objects={objects}
                selectedObjectId={selectedObjectId}
                selection={selection}
                style={style}
                onAskCevyn={askCevyn}
                onFormatElement={setFormatTarget}
                onRenameDashboard={renameDashboard}
              />
              {selectedChart &&
              activeFormatTarget &&
              isChartFormatElement(activeFormatTarget.element) ? (
                <ChartFormatPanel
                  actions={chartActions}
                  chart={selectedChart}
                  element={activeFormatTarget.element}
                  fields={dataset.fields}
                  isCollapsed={isFormatPanelCollapsed}
                  style={style}
                  onElementChange={(element) =>
                    setFormatTarget({ ...activeFormatTarget, element })
                  }
                  onToggleCollapse={toggleFormatPanel}
                />
              ) : null}
              {selectedCard &&
              activeFormatTarget &&
              isCardFormatElement(activeFormatTarget.element) ? (
                <CardFormatPanel
                  actions={canvasActions}
                  card={selectedCard}
                  element={activeFormatTarget.element}
                  fields={dataset.fields}
                  isCollapsed={isFormatPanelCollapsed}
                  onElementChange={(element) =>
                    setFormatTarget({ ...activeFormatTarget, element })
                  }
                  onToggleCollapse={toggleFormatPanel}
                />
              ) : null}
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
    </SharedColorPresets>
  )
}

export default App
