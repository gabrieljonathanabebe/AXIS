import { createChartInstance } from '../chart/createChartInstance'
import {
  DEFAULT_CHART_SIZE,
  findFreeChartLayout,
} from '../workspace/chartLayout'
import { workspaceReducer } from '../workspace/workspaceReducer'
import { validateCevynAction } from './validateCevynAction'
import type {
  CevynAction,
  CevynActionError,
  CevynActionResult,
} from '../types/actions'
import type { Dataset } from '../types/chart'
import type { WorkspaceAction, WorkspaceState } from '../types/workspace'

// ===== HELPERS ===============================================================
function translateCevynAction(
  action: CevynAction,
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
    const messages = validateCevynAction(action, dataset)
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
