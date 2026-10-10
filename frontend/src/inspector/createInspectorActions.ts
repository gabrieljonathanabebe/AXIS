import { createDefaultChartSpec } from '../charts/createChartInstance'

import type { Dataset } from '../datasets/types'
import type { WorkspaceAction } from '../workspace/types'
import type { InspectorActions } from './types'

// ===== TYPES =================================================================
type InspectorActionsParams = {
  dataset: Dataset
  dispatch: (action: WorkspaceAction) => void
  selectedChartId: string | null
}

// ===== FUNCTION ==============================================================
/** Turns inspector edits into workspace actions for the selected chart. */
export function createInspectorActions({
  dataset,
  dispatch,
  selectedChartId,
}: InspectorActionsParams): InspectorActions {
  function dispatchForChart(
    createAction: (chartId: string) => WorkspaceAction,
  ) {
    if (selectedChartId) {
      dispatch(createAction(selectedChartId))
    }
  }

  return {
    setAggregation: (key, aggregation) => {
      dispatchForChart((chartId) => ({
        type: 'chart/updateAggregation',
        chartId,
        patch: { [key]: aggregation },
      }))
    },
    setAppearance: (key, value) => {
      dispatchForChart((chartId) => ({
        type: 'chart/updateAppearance',
        chartId,
        patch: { [key]: value },
      }))
    },
    setChartAppearance: (mark, optionKey, value) => {
      dispatchForChart((chartId) => ({
        type: 'chart/updateMarkAppearance',
        chartId,
        mark,
        patch: { [optionKey]: value },
      }))
    },
    setChartType: (type) => {
      dispatchForChart((chartId) => ({
        type: 'chart/setType',
        chartId,
        chartType: type,
        defaultSpec: createDefaultChartSpec(type, dataset),
      }))
    },
    setContainer: (key, value) => {
      dispatchForChart((chartId) => ({
        type: 'chart/updateContainer',
        chartId,
        patch: { [key]: value },
      }))
    },
    setDashboardLayout: (key, value) => {
      dispatch({ type: 'dashboard/updateLayout', patch: { [key]: value } })
    },
    setEncodingField: (encodingKey, fieldName) => {
      dispatchForChart((chartId) => ({
        type: 'chart/updateEncoding',
        chartId,
        patch: { [encodingKey]: fieldName || undefined },
      }))
    },
    setInteraction: (key, value) => {
      dispatchForChart((chartId) => ({
        type: 'chart/updateInteraction',
        chartId,
        patch: { [key]: value },
      }))
    },
  }
}
