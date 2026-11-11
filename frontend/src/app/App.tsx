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
import { findFormatGroup, getPanelElement } from '../objects/formatPanelElement'
import { getObjectDefinition } from '../objects/objectDefinitions'
import { resolveFormatElement } from '../objects/resolveFormatElement'
import { SharedColorPresets } from '../shared/ui/colorPresets'
import BuildPanel from '../workspace/BuildPanel'
import CanvasPanel from '../workspace/CanvasPanel'
import DashboardFormatPanel from '../workspace/DashboardFormatPanel'
import DragPreviewOverlay from '../workspace/DragPreviewOverlay'
import { useChartWorkspace } from '../workspace/useChartWorkspace'
import NavigationRail from './NavigationRail'
import TopBar from './TopBar'
import { useFormatFocus } from './useFormatFocus'
import { useWorkspaceCommands } from './useWorkspaceCommands'
import { useWorkspaceLayout } from './useWorkspaceLayout'

import type { ObjectFormatElement } from '../objects/types'

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
  // The format panel follows the selection and shows the element chosen
  // last, if the selected object has it, else "Chart" or "Card".
  const [chosenFormatElement, setChosenFormatElement] =
    useState<ObjectFormatElement>('container')
  const selectedObject = objects.find(({ id }) => id === selectedObjectId)
  const selectedCard = selectedObject?.kind === 'card' ? selectedObject : null
  const formatElement = selectedObject
    ? resolveFormatElement(selectedObject, chosenFormatElement, dataset.fields)
    : null
  // Small elements open their parent, e.g. a data label the marks, where
  // they are a group of their own.
  const panelElement = formatElement ? getPanelElement(formatElement) : null

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
    setIsFormatPanelCollapsed,
    toggleBuildPanel,
    toggleFormatPanel,
  } = useWorkspaceLayout()

  const {
    hoveredFormatGroup,
    isFormatPulsing,
    isOverFormatPanel,
    pulseFormatFocus,
  } = useFormatFocus()

  /**
   * Picks the part of the selected object that lights up: over the format
   * panel the group under the pointer, e.g. the data labels, or else the
   * element of the panel; after a click the chosen part for a moment.
   * @returns The part, or null when nothing is dimmed.
   */
  function getFocusedElement(): ObjectFormatElement | null {
    if (isOverFormatPanel) {
      return findFormatGroup(hoveredFormatGroup) ?? panelElement
    }
    return isFormatPulsing ? formatElement : null
  }

  const focusedElement = getFocusedElement()
  const focusTarget =
    selectedObject && focusedElement
      ? { element: focusedElement, objectId: selectedObject.id }
      : null

  /**
   * Shows an element in the format panel and lets it light up on its
   * object for a moment, e.g. after a click on an axis.
   * @param element Element to show.
   */
  function chooseFormatElement(element: ObjectFormatElement): void {
    setChosenFormatElement(element)
    pulseFormatFocus()
  }

  /**
   * Shows the selected object as a whole in the format panel and expands
   * the panel, e.g. after Enter on the object.
   */
  function openObjectFormat(): void {
    chooseFormatElement('container')
    setIsFormatPanelCollapsed(false)
  }

  const commands = useWorkspaceCommands({
    canRedo,
    canUndo,
    isFormatPanelCollapsed,
    selectedObjectId,
    selectedObjectLabel: selectedObject
      ? getObjectDefinition(selectedObject.kind).label
      : 'object',
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
                formatTarget={focusTarget}
                objects={objects}
                selectedObjectId={selectedObjectId}
                selection={selection}
                style={style}
                onAskCevyn={askCevyn}
                onFormatElement={({ element }) => chooseFormatElement(element)}
                onRenameDashboard={renameDashboard}
              />
              {selectedChart && isChartFormatElement(panelElement) ? (
                <ChartFormatPanel
                  actions={chartActions}
                  chart={selectedChart}
                  element={panelElement}
                  fields={dataset.fields}
                  isCollapsed={isFormatPanelCollapsed}
                  style={style}
                  onElementChange={chooseFormatElement}
                  onToggleCollapse={toggleFormatPanel}
                />
              ) : null}
              {selectedCard && isCardFormatElement(panelElement) ? (
                <CardFormatPanel
                  actions={canvasActions}
                  card={selectedCard}
                  element={panelElement}
                  fields={dataset.fields}
                  isCollapsed={isFormatPanelCollapsed}
                  onElementChange={chooseFormatElement}
                  onToggleCollapse={toggleFormatPanel}
                />
              ) : null}
              {selectedObject ? null : (
                <DashboardFormatPanel
                  actions={canvasActions}
                  dashboard={dashboard}
                  isCollapsed={isFormatPanelCollapsed}
                  onToggleCollapse={toggleFormatPanel}
                />
              )}
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
