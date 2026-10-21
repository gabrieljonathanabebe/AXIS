import { DndContext } from '@dnd-kit/core'
import { useState } from 'react'

import BuildPanel from '../workspace/BuildPanel'
import CanvasPanel from '../workspace/CanvasPanel'
import CardFormatPopover from '../cards/CardFormatPopover'
import ChartFormatPopover from '../charts/format/ChartFormatPopover'
import { createChartActions } from '../charts/createChartActions'
import DataPanel from '../datasets/DataPanel'
import DragPreviewOverlay from '../workspace/DragPreviewOverlay'
import { getObjectDefinition } from '../objects/objectDefinitions'
import { isCardFormatElement } from '../cards/isCardFormatElement'
import { isChartFormatElement } from '../charts/getFormatElements'
import NavigationRail from './NavigationRail'
import TopBar from './TopBar'
import { useAskCevyn } from '../ai/useAskCevyn'
import { useChartWorkspace } from '../workspace/useChartWorkspace'
import { useDatasets } from '../datasets/useDatasets'
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
    undo,
  } = useChartWorkspace({ dataset: uploadedDataset })

  const chartActions = createChartActions({
    dispatch,
    selectedChartId: selectedChart?.id ?? null,
  })
  // Format popovers belong to the selected object and close when it changes.
  const [formatTarget, setFormatTarget] = useState<FormatTarget | null>(null)
  const activeFormatTarget =
    formatTarget?.objectId === selectedObjectId ? formatTarget : null
  const selectedObject = objects.find(({ id }) => id === selectedObjectId)
  const selectedCard = selectedObject?.kind === 'card' ? selectedObject : null

  /** Opens the format popover of an object at its container, next to it. */
  function openObjectFormat(objectId: string): void {
    const anchor = document.querySelector<HTMLElement>(
      `[data-object-id="${objectId}"]`,
    )
    if (anchor) {
      setFormatTarget({ anchor, element: 'container', objectId })
    }
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
    setActiveWorkspace,
    toggleBuildPanel,
  } = useWorkspaceLayout()

  const commands = useWorkspaceCommands({
    canRedo,
    canUndo,
    isFormatOpen: activeFormatTarget !== null,
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
              onAskCevyn={askCevyn}
              onFormatElement={setFormatTarget}
              onRenameDashboard={renameDashboard}
            />
            {selectedChart &&
            activeFormatTarget &&
            isChartFormatElement(activeFormatTarget.element) ? (
              <ChartFormatPopover
                actions={chartActions}
                chart={selectedChart}
                element={activeFormatTarget.element}
                fields={dataset.fields}
                target={activeFormatTarget}
                onClose={() => setFormatTarget(null)}
                onElementChange={(element) =>
                  setFormatTarget({ ...activeFormatTarget, element })
                }
              />
            ) : null}
            {selectedCard &&
            activeFormatTarget &&
            isCardFormatElement(activeFormatTarget.element) ? (
              <CardFormatPopover
                actions={canvasActions}
                card={selectedCard}
                element={activeFormatTarget.element}
                fields={dataset.fields}
                target={activeFormatTarget}
                onClose={() => setFormatTarget(null)}
                onElementChange={(element) =>
                  setFormatTarget({ ...activeFormatTarget, element })
                }
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
  )
}

export default App
