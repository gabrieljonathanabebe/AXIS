import { useEffect, useReducer } from 'react'

import { parseCevynActions } from '../actions/parseCevynActions'
import { translateCevynActions } from '../actions/translateCevynActions'
import { createChartInstance } from '../charts/createChartInstance'
import { DEFAULT_CHART_SIZE, findFreeChartLayout } from './chartLayout'
import { useWorkspaceDnd } from './useWorkspaceDnd'
import {
  initialWorkspaceHistory,
  workspaceHistoryReducer,
} from './workspaceHistory'

import type { CevynActionResult } from '../actions/types'
import type {
  ChartAppearanceSpec,
  ChartLayout,
  ChartType,
} from '../charts/types'
import type { Dataset } from '../datasets/types'
import type { CanvasActions, DataSelection, WorkspaceAction } from './types'

type UseChartWorkspaceParams = {
  dataset?: Dataset | null
}

// ===== CONSTANTS =============================================================
const EMPTY_DATASET: Dataset = { fields: [] }

// ===== FUNCTION ==============================================================
export function useChartWorkspace({
  dataset: externalDataset,
}: UseChartWorkspaceParams = {}) {
  const dataset = externalDataset ?? EMPTY_DATASET

  const [history, dispatchHistory] = useReducer(
    workspaceHistoryReducer,
    initialWorkspaceHistory,
  )
  const { charts, dashboard, selectedChartId, selection } = history.present
  const canRedo = history.future.length > 0
  const canUndo = history.past.length > 0
  const selectedChart =
    charts.find((chart) => chart.id === selectedChartId) ?? null
  const dnd = useWorkspaceDnd(dispatch, addChart)

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

  function addChart(type: ChartType): void {
    dispatch({
      type: 'chart/add',
      chart: createChartInstance({
        type,
        dataset,
        layout: findFreeChartLayout(charts, DEFAULT_CHART_SIZE),
      }),
    })
  }

  function duplicateChart(chartId: string): void {
    dispatch({
      type: 'chart/duplicate',
      chartId,
      newChartId: crypto.randomUUID(),
    })
  }

  function removeChart(chartId: string): void {
    dispatch({ type: 'chart/remove', chartId })
  }

  function selectChart(chartId: string | null): void {
    dispatch({ type: 'chart/select', chartId })
  }

  function selectData(selection: DataSelection): void {
    dispatch({ type: 'selection/set', selection })
  }

  function clearSelection(): void {
    dispatch({ type: 'selection/clear' })
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

  function updateChartLayout(chartId: string, layout: ChartLayout): void {
    dispatch({ type: 'chart/updateLayout', chartId, patch: layout })
  }

  function renameDashboard(name: string): void {
    dispatch({ type: 'dashboard/update', patch: { name } })
  }

  const canvasActions: CanvasActions = {
    clearSelection,
    selectChart,
    selectData,
    updateChartAppearance,
    updateChartLayout,
  }

  return {
    ...dnd,
    addChart,
    canRedo,
    canUndo,
    canvasActions,
    charts,
    dashboard,
    dataset,
    dispatch,
    duplicateChart,
    redo,
    removeChart,
    renameDashboard,
    runActions,
    selectedChart,
    selectedChartId,
    selection,
    undo,
  }
}
