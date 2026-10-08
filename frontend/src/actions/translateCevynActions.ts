import {
  createChartInstance,
  createDefaultChartSpec,
} from '../charts/createChartInstance'
import {
  DEFAULT_CHART_SIZE,
  findFreeChartLayout,
} from '../workspace/chartLayout'
import { workspaceReducer } from '../workspace/workspaceReducer'
import { validateCevynAction } from './validateCevynAction'
import type { CevynAction, CevynActionError, CevynActionResult } from './types'
import type { Dataset } from '../datasets/types'
import type { WorkspaceAction, WorkspaceState } from '../workspace/types'

// ===== HELPERS ===============================================================
function createChart(
  action: Extract<CevynAction, { type: 'chart/create' }>,
  state: WorkspaceState,
  dataset: Dataset,
): WorkspaceAction {
  const chart = createChartInstance({
    dataset,
    layout: findFreeChartLayout(state.charts, DEFAULT_CHART_SIZE),
    type: action.chartType,
  })
  const { data } = chart.spec
  return {
    type: 'chart/add',
    chart: {
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

function translateCevynAction(
  action: CevynAction,
  state: WorkspaceState,
  dataset: Dataset,
): WorkspaceAction {
  switch (action.type) {
    case 'chart/create':
      return createChart(action, state, dataset)
    case 'chart/remove':
      return { type: 'chart/remove', chartId: action.chartId }
    case 'chart/setTitle': {
      // Existence is checked by validateCevynAction before translation.
      const chart = state.charts.find(({ id }) => id === action.chartId)!
      const { title } = chart.spec.appearance
      return {
        type: 'chart/updateAppearance',
        chartId: action.chartId,
        patch: { title: { ...title, enabled: true, text: action.title } },
      }
    }
    case 'chart/setType':
      return {
        type: 'chart/setType',
        chartId: action.chartId,
        chartType: action.chartType,
        defaultSpec: createDefaultChartSpec(action.chartType, dataset),
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
    const workspaceAction = translateCevynAction(action, draft, dataset)
    workspaceActions.push(workspaceAction)
    draft = workspaceReducer(draft, workspaceAction)
  })

  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, workspaceActions }
}
