import { useEffect, useReducer } from 'react'

import { parseCevynActions } from '../actions/parseCevynActions'
import { translateCevynActions } from '../actions/translateCevynActions'
import { createObject } from '../objects/createObject'
import { findChart } from '../objects/findChart'
import { useWorkspaceDnd } from './useWorkspaceDnd'
import {
  initialWorkspaceHistory,
  workspaceHistoryReducer,
} from './workspaceHistory'

import type { CevynActionResult } from '../actions/types'
import type { CardAppearanceSpec, CardDataSpec } from '../cards/types'
import type { ChartAppearanceSpec } from '../charts/types'
import type { Dataset } from '../datasets/types'
import type {
  ObjectContainer,
  ObjectLayout,
  ObjectTemplate,
} from '../objects/types'
import type {
  CanvasActions,
  DashboardLayout,
  DashboardSpec,
  DataSelection,
  WorkspaceAction,
} from './types'

type UseChartWorkspaceParams = {
  dataset?: Dataset | null
}

// ===== CONSTANTS =============================================================
const EMPTY_DATASET: Dataset = { fields: [] }

// ===== FUNCTION ==============================================================
/** Holds the workspace with its undo history and offers its changes. */
export function useChartWorkspace({
  dataset: externalDataset,
}: UseChartWorkspaceParams = {}) {
  const dataset = externalDataset ?? EMPTY_DATASET

  const [history, dispatchHistory] = useReducer(
    workspaceHistoryReducer,
    initialWorkspaceHistory,
  )
  const { dashboard, objects, selectedObjectId, selection } = history.present
  const canRedo = history.future.length > 0
  const canUndo = history.past.length > 0
  const charts = objects.filter((object) => object.kind === 'chart')
  const selectedChart = findChart(objects, selectedObjectId)
  const dnd = useWorkspaceDnd(dispatch, addObject)

  function dispatch(action: WorkspaceAction): void {
    dispatchHistory({ type: 'history/apply', action, timestamp: Date.now() })
  }

  function undo(): void {
    dispatchHistory({ type: 'history/undo' })
  }

  function redo(): void {
    dispatchHistory({ type: 'history/redo' })
  }

  function runActions(input: unknown): CevynActionResult {
    const parsed = parseCevynActions(input)
    if (!parsed.ok) {
      return parsed
    }
    const result = translateCevynActions(
      parsed.actions,
      history.present,
      dataset,
    )
    if (result.ok) {
      dispatchHistory({
        type: 'history/applyBatch',
        actions: result.workspaceActions,
        timestamp: Date.now(),
      })
    }
    return result
  }

  // Dev only: run Cevyn Actions from the console via `cevyn.run(...)`.
  useEffect(() => {
    if (import.meta.env.DEV) {
      Object.assign(window, { cevyn: { run: runActions } })
    }
  })

  /** Adds the object of a picker option in the first free spot. */
  function addObject(template: ObjectTemplate): void {
    dispatch({ type: 'object/add', object: createObject(template, objects) })
  }

  /** Copies an object; the copy gets a new ID and is selected. */
  function duplicateObject(objectId: string): void {
    dispatch({
      type: 'object/duplicate',
      objectId,
      newObjectId: crypto.randomUUID(),
    })
  }

  /** Removes an object from the canvas. */
  function removeObject(objectId: string): void {
    dispatch({ type: 'object/remove', objectId })
  }

  /** Selects an object, or the dashboard with null. */
  function selectObject(objectId: string | null): void {
    dispatch({ type: 'object/select', objectId })
  }

  function selectData(selection: DataSelection): void {
    dispatch({ type: 'selection/set', selection })
  }

  function clearSelection(): void {
    dispatch({ type: 'selection/clear' })
  }

  /** Changes one formatting entry of a card, e.g. its title. */
  function updateCardAppearance<TKey extends keyof CardAppearanceSpec>(
    cardId: string,
    key: TKey,
    value: CardAppearanceSpec[TKey],
  ): void {
    dispatch({
      type: 'card/updateAppearance',
      cardId,
      patch: { [key]: value },
    })
  }

  /** Changes what a card aggregates, e.g. its aggregation. */
  function updateCardData(cardId: string, patch: Partial<CardDataSpec>): void {
    dispatch({ type: 'card/updateData', cardId, patch })
  }

  function updateChartAppearance<TKey extends keyof ChartAppearanceSpec>(
    chartId: string,
    key: TKey,
    value: ChartAppearanceSpec[TKey],
  ): void {
    dispatch({
      type: 'chart/updateAppearance',
      chartId,
      patch: { [key]: value },
    })
  }

  /** Changes background, padding or corner radius of an object's container. */
  function updateObjectContainer(
    objectId: string,
    patch: Partial<ObjectContainer>,
  ): void {
    dispatch({ type: 'object/updateContainer', objectId, patch })
  }

  /** Moves or resizes an object. */
  function updateObjectLayout(objectId: string, layout: ObjectLayout): void {
    dispatch({ type: 'object/updateLayout', objectId, patch: layout })
  }

  /** Changes settings of the whole dashboard, e.g. the chart animation. */
  function updateDashboard(
    patch: Partial<Pick<DashboardSpec, 'animation' | 'name'>>,
  ): void {
    dispatch({ type: 'dashboard/update', patch })
  }

  /** Changes the layout of the dashboard, e.g. the gap between objects. */
  function updateDashboardLayout(patch: Partial<DashboardLayout>): void {
    dispatch({ type: 'dashboard/updateLayout', patch })
  }

  function renameDashboard(name: string): void {
    dispatch({ type: 'dashboard/update', patch: { name } })
  }

  const canvasActions: CanvasActions = {
    clearSelection,
    selectData,
    selectObject,
    updateCardAppearance,
    updateCardData,
    updateChartAppearance,
    updateDashboard,
    updateDashboardLayout,
    updateObjectContainer,
    updateObjectLayout,
  }

  return {
    ...dnd,
    addObject,
    canRedo,
    canUndo,
    canvasActions,
    charts,
    dashboard,
    dataset,
    dispatch,
    duplicateObject,
    objects,
    redo,
    removeObject,
    renameDashboard,
    runActions,
    selectedChart,
    selectedObjectId,
    selection,
    undo,
  }
}
