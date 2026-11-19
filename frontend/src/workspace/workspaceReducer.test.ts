import { describe, expect, it } from 'vitest'

import {
  createChartInstance,
  createDefaultChartSpec,
} from '../charts/createChartInstance'
import { createDashboardStyle } from '../dashboardStyle/createDashboardStyle'
import { GRAPHITE } from '../dashboardStyle/styleRecipes'
import { initialWorkspaceState, workspaceReducer } from './workspaceReducer'

import type { ChartInstance, ChartType } from '../charts/types'
import type { WorkspaceState } from './types'

// ===== HELPERS ===============================================================
const style = createDashboardStyle(GRAPHITE)

/** Workspace with one bar chart of mean revenue by country, top 5 A–Z. */
function createState(): WorkspaceState {
  const chart = createChartInstance({
    id: 'chart',
    layout: { height: 8, width: 12, x: 0, y: 0 },
    style,
    type: 'bar',
  })
  chart.spec.data = {
    ...chart.spec.data,
    aggregation: 'mean',
    encoding: { x: 'country', y: 'revenue' },
    limit: { kind: 'top', count: 5 },
    sort: { by: 'category', order: 'asc' },
    timeGrain: 'month',
  }
  return { ...initialWorkspaceState, objects: [chart] }
}

/** Switches the chart of the state to another type. */
function setType(state: WorkspaceState, chartType: ChartType): WorkspaceState {
  return workspaceReducer(state, {
    type: 'chart/setType',
    chartId: 'chart',
    chartType,
    defaultSpec: createDefaultChartSpec(chartType, style),
  })
}

/** Reads the chart of the state. */
function getChart(state: WorkspaceState): ChartInstance {
  return state.objects[0] as ChartInstance
}

// ===== TESTS =================================================================
describe('chart/setType', () => {
  it('keeps the whole data spec between aggregated types', () => {
    const before = getChart(createState()).spec.data
    const after = getChart(setType(createState(), 'pie')).spec.data
    expect(after).toEqual(before)
  })

  it('keeps grain, sort and show on the way to a scatter', () => {
    const { data } = getChart(setType(createState(), 'scatter')).spec
    expect(data).toMatchObject({
      aggregation: 'none',
      encoding: {},
      limit: { kind: 'top', count: 5 },
      sort: { by: 'category', order: 'asc' },
      timeGrain: 'month',
    })
  })

  it('brings grain, sort and show back after bar, scatter, bar', () => {
    const state = setType(setType(createState(), 'scatter'), 'bar')
    expect(getChart(state).spec.data).toMatchObject({
      aggregation: 'sum',
      limit: { kind: 'top', count: 5 },
      sort: { by: 'category', order: 'asc' },
      timeGrain: 'month',
    })
  })
})
