import { createDefaultChartSpec } from './createChartInstance'

import type { DashboardStyle } from '../dashboardStyle/types'
import type { WorkspaceAction } from '../workspace/types'
import type { ChartActions } from './types'

// ===== TYPES =================================================================
type ChartActionsParams = {
  dispatch: (action: WorkspaceAction) => void
  selectedChartId: string | null
  style: DashboardStyle
}

// ===== FUNCTION ==============================================================
/**
 * Turns format and Build panel edits into actions on the selected chart.
 * @param params Dispatch, selected chart and the current style.
 * @returns Actions of the selected chart.
 */
export function createChartActions({
  dispatch,
  selectedChartId,
  style,
}: ChartActionsParams): ChartActions {
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
        defaultSpec: createDefaultChartSpec(type, style),
      }))
    },
    setContainer: (key, value) => {
      dispatchForChart((chartId) => ({
        type: 'object/updateContainer',
        objectId: chartId,
        patch: { [key]: value },
      }))
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
