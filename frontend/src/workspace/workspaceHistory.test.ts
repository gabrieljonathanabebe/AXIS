import { describe, expect, it } from 'vitest'

import { createChartInstance } from '@/charts/createChartInstance'
import { createDashboardStyle } from '@/dashboardStyle/createDashboardStyle'
import { GRAPHITE } from '@/dashboardStyle/styleRecipes'
import {
  initialWorkspaceHistory,
  workspaceHistoryReducer,
} from './workspaceHistory'
import { initialWorkspaceState } from './workspaceReducer'

import type { WorkspaceAction, WorkspaceHistoryState } from './types'

// ===== HELPERS ===============================================================
/** History of a workspace with one bar chart and no undo steps yet. */
function createHistory(): WorkspaceHistoryState {
  const chart = createChartInstance({
    id: 'chart',
    layout: { height: 8, width: 12, x: 0, y: 0 },
    style: createDashboardStyle(GRAPHITE),
    type: 'bar',
  })
  return {
    ...initialWorkspaceHistory,
    present: { ...initialWorkspaceState, objects: [chart] },
  }
}

/**
 * Applies actions 100 ms apart, well inside the window in which quick
 * edits can count as one undo step.
 * @param actions Actions in the order the user makes them.
 * @returns The history after all actions.
 */
function applyQuickly(actions: WorkspaceAction[]): WorkspaceHistoryState {
  return actions.reduce((history, action, index) => {
    return workspaceHistoryReducer(history, {
      type: 'history/apply',
      action,
      timestamp: 1000 + index * 100,
    })
  }, createHistory())
}

// ===== TESTS =================================================================
describe('workspaceHistory, current grouping of quick edits', () => {
  it('groups quick aggregation changes into one undo step', () => {
    const history = applyQuickly([
      {
        type: 'chart/updateAggregation',
        chartId: 'chart',
        patch: { aggregation: 'mean' },
      },
      {
        type: 'chart/updateAggregation',
        chartId: 'chart',
        patch: { aggregation: 'max' },
      },
    ])
    expect(history.past).toHaveLength(1)
  })

  it('keeps each quick sort change as its own undo step', () => {
    const history = applyQuickly([
      {
        type: 'chart/updateCategoryOrder',
        chartId: 'chart',
        patch: { sort: { by: 'category', order: 'asc' } },
      },
      {
        type: 'chart/updateCategoryOrder',
        chartId: 'chart',
        patch: { sort: { by: 'category', order: 'desc' } },
      },
    ])
    expect(history.past).toHaveLength(2)
  })

  it('keeps each quick time grain change as its own undo step', () => {
    const history = applyQuickly([
      { type: 'chart/updateTimeGrain', chartId: 'chart', timeGrain: 'month' },
      { type: 'chart/updateTimeGrain', chartId: 'chart', timeGrain: 'year' },
    ])
    expect(history.past).toHaveLength(2)
  })
})
