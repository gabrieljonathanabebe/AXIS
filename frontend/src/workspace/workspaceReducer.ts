import { getChartDefinition } from '../charts/chartDefinitions'
import { createDashboardStyle } from '../dashboardStyle/createDashboardStyle'
import { GRAPHITE } from '../dashboardStyle/styleRecipes'
import { findFreeLayout, findNeighborObjectId } from './chartLayout'

import type { CardInstance } from '../cards/types'
import type {
  ChartEncoding,
  ChartInstance,
  ChartSpec,
  ChartType,
} from '../charts/types'
import type { DashboardObject } from '../objects/types'
import type {
  DashboardAnimation,
  WorkspaceAction,
  WorkspaceState,
} from './types'

// ===== TYPES =================================================================
type CardUpdater = (card: CardInstance) => CardInstance

type ChartUpdater = (chart: ChartInstance) => ChartInstance

type ObjectUpdater = (object: DashboardObject) => DashboardObject

// ===== CONSTANTS =============================================================
/** Animation of a new dashboard, also added again by its plus. */
export const DASHBOARD_ANIMATION: DashboardAnimation = {
  duration: 500,
  easing: 'cubicOut',
  enabled: true,
}

export const initialWorkspaceState: WorkspaceState = {
  dashboard: {
    animation: DASHBOARD_ANIMATION,
    canvas: createDashboardStyle(GRAPHITE).canvas,
    layout: {
      gap: 8,
    },
    name: 'Untitled dashboard',
    style: GRAPHITE,
  },
  objects: [],
  selectedObjectId: null,
  selection: null,
}

// ===== HELPERS ===============================================================
/** Replaces one object; all other objects stay as they are. */
function updateObject(
  state: WorkspaceState,
  objectId: string,
  updater: ObjectUpdater,
): WorkspaceState {
  return {
    ...state,
    objects: state.objects.map((object) => {
      return object.id === objectId ? updater(object) : object
    }),
  }
}

/** Replaces one card; IDs of other kinds of objects are ignored. */
function updateCard(
  state: WorkspaceState,
  cardId: string,
  updater: CardUpdater,
): WorkspaceState {
  return updateObject(state, cardId, (object) => {
    return object.kind === 'card' ? updater(object) : object
  })
}

/** Replaces one chart; IDs of other kinds of objects are ignored. */
function updateChart(
  state: WorkspaceState,
  chartId: string,
  updater: ChartUpdater,
): WorkspaceState {
  return updateObject(state, chartId, (object) => {
    return object.kind === 'chart' ? updater(object) : object
  })
}

/** Copies an object into the first free spot and selects the copy. */
function duplicateObject(
  state: WorkspaceState,
  objectId: string,
  newObjectId: string,
): WorkspaceState {
  const source = state.objects.find((object) => object.id === objectId)
  if (!source) {
    return state
  }
  const duplicate: DashboardObject = {
    ...source,
    id: newObjectId,
    layout: findFreeLayout(state.objects, source.layout),
  }
  return {
    ...state,
    objects: [...state.objects, duplicate],
    selectedObjectId: newObjectId,
  }
}

// Keeps the fields the new type can encode; points and aggregated charts
// read data differently, so switching between them starts empty.
function carryOverEncoding(
  encoding: ChartEncoding,
  fromType: ChartType,
  toType: ChartType,
): ChartEncoding {
  const target = getChartDefinition(toType)
  if (getChartDefinition(fromType).dataMode !== target.dataMode) {
    return {}
  }
  return Object.fromEntries(
    Object.entries(encoding).filter(([key]) => {
      return target.encodings.some((definition) => definition.key === key)
    }),
  )
}

function setChartType(
  chart: ChartInstance,
  chartType: ChartType,
  defaultSpec: ChartSpec,
): ChartInstance {
  // Legend and labels sit differently in cartesian and radial charts.
  const isCoordinatesChange =
    getChartDefinition(chart.type).coordinates !==
    getChartDefinition(chartType).coordinates
  const { appearance } = isCoordinatesChange ? defaultSpec : chart.spec
  return {
    ...chart,
    type: chartType,
    spec: {
      ...chart.spec,
      appearance: {
        ...chart.spec.appearance,
        labels: {
          ...chart.spec.appearance.labels,
          visible: appearance.labels.visible,
          layout: defaultSpec.appearance.labels.layout,
        },
        legend: {
          ...chart.spec.appearance.legend,
          layout: {
            ...chart.spec.appearance.legend.layout,
            position: appearance.legend.layout.position,
          },
        },
      },
      data: {
        ...defaultSpec.data,
        encoding: carryOverEncoding(
          chart.spec.data.encoding,
          chart.type,
          chartType,
        ),
      },
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
    case 'card/updateAppearance':
      return updateCard(state, action.cardId, (card) => ({
        ...card,
        spec: {
          ...card.spec,
          appearance: { ...card.spec.appearance, ...action.patch },
        },
      }))
    case 'card/updateData':
      return updateCard(state, action.cardId, (card) => ({
        ...card,
        spec: {
          ...card.spec,
          data: { ...card.spec.data, ...action.patch },
        },
      }))
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
    case 'dashboard/update':
      return {
        ...state,
        dashboard: { ...state.dashboard, ...action.patch },
      }
    case 'dashboard/updateLayout':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          layout: { ...state.dashboard.layout, ...action.patch },
        },
      }
    case 'object/add':
      return {
        ...state,
        objects: [...state.objects, action.object],
        selectedObjectId: action.object.id,
      }
    case 'object/duplicate':
      return duplicateObject(state, action.objectId, action.newObjectId)
    case 'object/remove':
      return {
        ...state,
        objects: state.objects.filter((object) => {
          return object.id !== action.objectId
        }),
        selectedObjectId:
          state.selectedObjectId === action.objectId
            ? findNeighborObjectId(state.objects, action.objectId)
            : state.selectedObjectId,
        selection:
          state.selection?.sourceChartId === action.objectId
            ? null
            : state.selection,
      }
    case 'object/select': {
      const objectExists =
        action.objectId === null ||
        state.objects.some((object) => object.id === action.objectId)
      return objectExists
        ? { ...state, selectedObjectId: action.objectId }
        : state
    }
    case 'object/updateContainer':
      return updateObject(state, action.objectId, (object) => ({
        ...object,
        container: { ...object.container, ...action.patch },
      }))
    case 'object/updateLayout':
      return updateObject(state, action.objectId, (object) => ({
        ...object,
        layout: { ...object.layout, ...action.patch },
      }))
    case 'selection/clear':
      return { ...state, selection: null }
    case 'selection/set': {
      const sourceExists = state.objects.some((object) => {
        return object.id === action.selection.sourceChartId
      })
      return sourceExists ? { ...state, selection: action.selection } : state
    }
  }
}
