import {
  createChartInstance,
  createDefaultChartSpec,
} from '../charts/createChartInstance'
import { createDashboardStyle } from '../dashboardStyle/createDashboardStyle'
import { findChart } from '../objects/findChart'
import { objectDefinitions } from '../objects/objectDefinitions'
import { findFreeLayout } from '../workspace/chartLayout'
import { workspaceReducer } from '../workspace/workspaceReducer'
import { validateCevynAction } from './validateCevynAction'

import type { Dataset } from '../datasets/types'
import type { WorkspaceAction, WorkspaceState } from '../workspace/types'
import type { CevynAction, CevynActionError, CevynActionResult } from './types'

// ===== HELPERS ===============================================================
/** Adds a chart with defaults, overridden by the values of the action. */
function createChart(
  action: Extract<CevynAction, { type: 'chart/create' }>,
  state: WorkspaceState,
): WorkspaceAction {
  const chart = createChartInstance({
    layout: findFreeLayout(state.objects, objectDefinitions.chart.defaultSize),
    style: createDashboardStyle(state.dashboard.style),
    type: action.chartType,
  })
  const { data } = chart.spec
  return {
    type: 'object/add',
    object: {
      ...chart,
      spec: {
        ...chart.spec,
        data: {
          ...data,
          aggregation: action.aggregation ?? data.aggregation,
          encoding: { ...data.encoding, ...action.encoding },
        },
      },
    },
  }
}

/** Turns one Cevyn action into the workspace action it stands for. */
function translateCevynAction(
  action: CevynAction,
  state: WorkspaceState,
): WorkspaceAction {
  switch (action.type) {
    case 'chart/create':
      return createChart(action, state)
    case 'chart/remove':
      return { type: 'object/remove', objectId: action.chartId }
    case 'chart/setTitle': {
      // Existence is checked by validateCevynAction before translation.
      const chart = findChart(state.objects, action.chartId)!
      const { title } = chart.spec.appearance
      return {
        type: 'chart/updateAppearance',
        chartId: action.chartId,
        patch: { title: { ...title, text: action.title, visible: true } },
      }
    }
    case 'chart/setType':
      return {
        type: 'chart/setType',
        chartId: action.chartId,
        chartType: action.chartType,
        defaultSpec: createDefaultChartSpec(
          action.chartType,
          createDashboardStyle(state.dashboard.style),
        ),
      }
    case 'chart/updateAggregation':
      return {
        type: 'chart/updateAggregation',
        chartId: action.chartId,
        patch: { aggregation: action.aggregation },
      }
    case 'chart/updateEncoding':
      return {
        type: 'chart/updateEncoding',
        chartId: action.chartId,
        patch: action.encoding,
      }
  }
}

// ===== FUNCTION ==============================================================
export function translateCevynActions(
  actions: CevynAction[],
  state: WorkspaceState,
  dataset: Dataset,
): CevynActionResult {
  const errors: CevynActionError[] = []
  const workspaceActions: WorkspaceAction[] = []
  let draft = state

  actions.forEach((action, index) => {
    const messages = validateCevynAction(action, draft, dataset)
    if (messages.length > 0) {
      errors.push(...messages.map((message) => ({ index, message })))
      return
    }
    const workspaceAction = translateCevynAction(action, draft)
    workspaceActions.push(workspaceAction)
    draft = workspaceReducer(draft, workspaceAction)
  })

  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, workspaceActions }
}
