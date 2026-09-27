import type { ChartInstance, ChartSpec, ChartType } from '../types/chart'
import { findFreeChartLayout } from './chartLayout'
import type { WorkspaceAction, WorkspaceState } from '../types/workspace'

// ===== TYPES =================================================================
type ChartUpdater = (chart: ChartInstance) => ChartInstance

// ===== CONSTANTS =============================================================
export const initialWorkspaceState: WorkspaceState = {
  charts: [],
  selectedChartId: null,
  selection: null,
}

// ===== HELPERS ===============================================================
function updateChart(
  state: WorkspaceState,
  chartId: string,
  updater: ChartUpdater,
): WorkspaceState {
  return {
    ...state,
    charts: state.charts.map((chart) => {
      return chart.id === chartId ? updater(chart) : chart
    }),
  }
}

function duplicateChart(
  state: WorkspaceState,
  chartId: string,
  newChartId: string,
): WorkspaceState {
  const sourceChart = state.charts.find((chart) => chart.id === chartId)
  if (!sourceChart) {
    return state
  }
  const duplicate: ChartInstance = {
    ...sourceChart,
    id: newChartId,
    layout: findFreeChartLayout(state.charts, sourceChart.layout),
  }
  return {
    ...state,
    charts: [...state.charts, duplicate],
    selectedChartId: newChartId,
  }
}

function setChartType(
  chart: ChartInstance,
  chartType: ChartType,
  defaultSpec: ChartSpec,
): ChartInstance {
  return {
    ...chart,
    type: chartType,
    spec: {
      ...chart.spec,
      appearance: {
        ...chart.spec.appearance,
        labels: {
          ...chart.spec.appearance.labels,
          position: defaultSpec.appearance.labels.position,
        },
      },
      data: defaultSpec.data,
      interaction: {
        ...chart.spec.interaction,
        tooltip: {
          ...chart.spec.interaction.tooltip,
          trigger: defaultSpec.interaction.tooltip.trigger,
        },
      },
    },
  }
}

// ===== REDUCER ===============================================================
export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case 'chart/add':
      return {
        ...state,
        charts: [...state.charts, action.chart],
        selectedChartId: action.chart.id,
      }
    case 'chart/duplicate':
      return duplicateChart(state, action.chartId, action.newChartId)
    case 'chart/remove':
      return {
        ...state,
        charts: state.charts.filter((chart) => chart.id !== action.chartId),
        selectedChartId:
          state.selectedChartId === action.chartId
            ? null
            : state.selectedChartId,
        selection:
          state.selection?.sourceChartId === action.chartId
            ? null
            : state.selection,
      }
    case 'chart/select': {
      const chartExists =
        action.chartId === null ||
        state.charts.some((chart) => chart.id === action.chartId)
      return chartExists ? { ...state, selectedChartId: action.chartId } : state
    }
    case 'chart/setType':
      return updateChart(state, action.chartId, (chart) => {
        return setChartType(chart, action.chartType, action.defaultSpec)
      })
    case 'chart/updateAggregation':
      return updateChart(state, action.chartId, (chart) => ({
        ...chart,
        spec: {
          ...chart.spec,
          data: { ...chart.spec.data, ...action.patch },
        },
      }))
    case 'chart/updateAppearance':
      return updateChart(state, action.chartId, (chart) => ({
        ...chart,
        spec: {
          ...chart.spec,
          appearance: { ...chart.spec.appearance, ...action.patch },
        },
      }))
    case 'chart/updateEncoding':
      return updateChart(state, action.chartId, (chart) => ({
        ...chart,
        spec: {
          ...chart.spec,
          data: {
            ...chart.spec.data,
            encoding: { ...chart.spec.data.encoding, ...action.patch },
          },
        },
      }))
    case 'chart/updateInteraction':
      return updateChart(state, action.chartId, (chart) => ({
        ...chart,
        spec: {
          ...chart.spec,
          interaction: { ...chart.spec.interaction, ...action.patch },
        },
      }))
    case 'chart/updateLayout':
      return updateChart(state, action.chartId, (chart) => ({
        ...chart,
        layout: { ...chart.layout, ...action.patch },
      }))
    case 'chart/updateMarkAppearance':
      return updateChart(state, action.chartId, (chart) => ({
        ...chart,
        spec: {
          ...chart.spec,
          appearance: {
            ...chart.spec.appearance,
            [action.mark]: {
              ...chart.spec.appearance[action.mark],
              ...action.patch,
            },
          },
        },
      }))
    case 'selection/clear':
      return { ...state, selection: null }
    case 'selection/set': {
      const sourceExists = state.charts.some((chart) => {
        return chart.id === action.selection.sourceChartId
      })
      return sourceExists ? { ...state, selection: action.selection } : state
    }
  }
}
