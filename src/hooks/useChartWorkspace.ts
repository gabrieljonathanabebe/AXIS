import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useReducer, useState } from 'react'

import {
  createChartInstance,
  createDefaultChartSpec,
} from '../chart/createChartInstance'
import {
  initialWorkspaceHistory,
  workspaceHistoryReducer,
} from '../workspace/workspaceHistory'

import {
  DEFAULT_CHART_SIZE,
  findFreeChartLayout,
} from '../workspace/chartLayout'

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { ActiveDrag, DragPayload, DropTarget } from '../types/ui'
import type {
  ChartAggregationKey,
  ChartAppearanceSpec,
  ChartContainerAppearance,
  ChartDataSpec,
  ChartEncoding,
  ChartInteractionSpec,
  ChartMarkKey,
  ChartLayout,
  ChartTitleAppearance,
  ChartType,
  Dataset,
} from '../types/chart'
import type { DashboardLayout } from '../types/dashboard'
import type { DataSelection, WorkspaceAction } from '../types/workspace'

// ===== TYPES =================================================================
type UseChartWorkspaceParams = {
  dataset?: Dataset | null
}

type CreateChartAction = (chartId: string) => WorkspaceAction

// ===== CONSTANTS =============================================================
const EMPTY_DATASET: Dataset = { fields: [], rows: [] }

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

  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  function dispatch(action: WorkspaceAction): void {
    dispatchHistory({ type: 'history/apply', action, timestamp: Date.now() })
  }

  function undo(): void {
    dispatchHistory({ type: 'history/undo' })
  }

  function redo(): void {
    dispatchHistory({ type: 'history/redo' })
  }

  function dispatchForSelectedChart(createAction: CreateChartAction): void {
    if (selectedChartId) {
      dispatch(createAction(selectedChartId))
    }
  }

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

  function setSelection(selection: DataSelection): void {
    dispatch({ type: 'selection/set', selection })
  }

  function clearSelection(): void {
    dispatch({ type: 'selection/clear' })
  }

  function setChartType(type: ChartType): void {
    dispatchForSelectedChart((chartId) => ({
      type: 'chart/setType',
      chartId,
      chartType: type,
      defaultSpec: createDefaultChartSpec(type, dataset),
    }))
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

  function updateChartTitle(
    chartId: string,
    title: ChartTitleAppearance,
  ): void {
    dispatch({ type: 'chart/updateAppearance', chartId, patch: { title } })
  }

  function updateAppearance<TKey extends keyof ChartAppearanceSpec>(
    key: TKey,
    value: ChartAppearanceSpec[TKey],
  ): void {
    dispatchForSelectedChart((chartId) => ({
      type: 'chart/updateAppearance',
      chartId,
      patch: { [key]: value },
    }))
  }

  function updateContainer<TKey extends keyof ChartContainerAppearance>(
    key: TKey,
    value: ChartContainerAppearance[TKey],
  ): void {
    dispatchForSelectedChart((chartId) => ({
      type: 'chart/updateContainer',
      chartId,
      patch: { [key]: value },
    }))
  }

  function updateInteraction<TKey extends keyof ChartInteractionSpec>(
    key: TKey,
    value: ChartInteractionSpec[TKey],
  ): void {
    dispatchForSelectedChart((chartId) => ({
      type: 'chart/updateInteraction',
      chartId,
      patch: { [key]: value },
    }))
  }

  function renameDashboard(name: string): void {
    dispatch({ type: 'dashboard/update', patch: { name } })
  }

  function updateDashboardLayout<TKey extends keyof DashboardLayout>(
    key: TKey,
    value: DashboardLayout[TKey],
  ): void {
    dispatch({ type: 'dashboard/updateLayout', patch: { [key]: value } })
  }

  function setEncodingField(
    encodingKey: keyof ChartEncoding,
    fieldName: string,
  ): void {
    dispatchForSelectedChart((chartId) => ({
      type: 'chart/updateEncoding',
      chartId,
      patch: { [encodingKey]: fieldName || undefined },
    }))
  }

  function setAggregation<TKey extends ChartAggregationKey>(
    key: TKey,
    aggregation: ChartDataSpec[TKey],
  ): void {
    dispatchForSelectedChart((chartId) => ({
      type: 'chart/updateAggregation',
      chartId,
      patch: { [key]: aggregation },
    }))
  }

  function setChartAppearance<
    TMark extends ChartMarkKey,
    TOptionKey extends keyof ChartAppearanceSpec[TMark],
  >(
    mark: TMark,
    optionKey: TOptionKey,
    value: ChartAppearanceSpec[TMark][TOptionKey],
  ): void {
    dispatchForSelectedChart((chartId) => ({
      type: 'chart/updateMarkAppearance',
      chartId,
      mark,
      patch: { [optionKey]: value },
    }))
  }

  function getDragPayload(
    event: DragStartEvent | DragEndEvent,
  ): DragPayload | null {
    return event.active.data.current?.payload ?? null
  }

  function getDropTarget(event: DragEndEvent): DropTarget | null {
    return event.over?.data.current?.target ?? null
  }

  function handleDragStart(event: DragStartEvent): void {
    setActiveDrag(getDragPayload(event))
  }

  function handleDragEnd(event: DragEndEvent): void {
    const payload = getDragPayload(event)
    const target = getDropTarget(event)
    setActiveDrag(null)
    if (payload?.kind === 'chart-type' && target?.kind === 'canvas') {
      addChart(payload.chartType)
      return
    }
    if (payload?.kind === 'field' && target?.kind === 'encoding') {
      dispatch({ type: 'chart/select', chartId: target.chartId })
      dispatch({
        type: 'chart/updateEncoding',
        chartId: target.chartId,
        patch: { [target.encodingKey]: payload.field.name },
      })
    }
  }

  return {
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
  }
}
