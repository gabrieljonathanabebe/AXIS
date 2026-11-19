import { describe, expect, it } from 'vitest'

import { createDashboardStyle } from '../../../dashboardStyle/createDashboardStyle'
import { GRAPHITE } from '../../../dashboardStyle/styleRecipes'
import { createDefaultChartSpec } from '../../createChartInstance'
import { createChartContent } from './createChartContent'

import type { DataField } from '../../../datasets/types'
import type { ChartEncoding, ChartType } from '../../types'
import type { ChartContentContext } from './chartContentTypes'

// ===== HELPERS ===============================================================
const style = createDashboardStyle(GRAPHITE)

const fields: DataField[] = [
  {
    name: 'country',
    native_grain: null,
    physical_type: 'string',
    semantic_role: 'dimension',
  },
  {
    name: 'profit',
    native_grain: null,
    physical_type: 'integer',
    semantic_role: 'measure',
  },
  {
    name: 'revenue',
    native_grain: null,
    physical_type: 'integer',
    semantic_role: 'measure',
  },
]

/**
 * Context of a chart whose data holds one country and one row without
 * a country, as rows and as aggregated points.
 * @param chartType Type of the chart.
 * @param encoding Fields on the encodings of the chart.
 * @returns Everything the content of the chart is built from.
 */
function createContext(
  chartType: ChartType,
  encoding: ChartEncoding,
): ChartContentContext {
  const spec = createDefaultChartSpec(chartType, style)
  return {
    chartType,
    dataset: { fields },
    highlightResult: null,
    points: [
      { country: 'US', profit: 2, revenue: 1 },
      { country: null, profit: 4, revenue: 3 },
    ],
    queryResult: {
      points: [
        { color_value: null, series: null, value: 10, x: 'US' },
        { color_value: null, series: null, value: 5, x: null },
      ],
    },
    selection: null,
    spec: { ...spec, data: { ...spec.data, encoding } },
    theme: { style },
  }
}

// ===== TESTS =================================================================
describe('createChartContent, current label of a missing category (#32)', () => {
  it.each(['bar', 'line'] as const)(
    'shows an empty label on the X axis of a %s chart',
    (chartType) => {
      const context = createContext(chartType, { x: 'country', y: 'revenue' })
      expect(createChartContent(context).xAxis).toMatchObject({
        data: ['US', ''],
      })
    },
  )

  it.each(['pie', 'donut'] as const)(
    'shows "No category" in the legend of a %s chart',
    (chartType) => {
      const context = createContext(chartType, { x: 'country', y: 'revenue' })
      const names = createChartContent(context).legend.map(({ name }) => name)
      expect(names).toEqual(['US', 'No category'])
    },
  )

  it('shows "(empty)" in the legend of a scatter chart', () => {
    const context = createContext('scatter', {
      color: 'country',
      x: 'revenue',
      y: 'profit',
    })
    const names = createChartContent(context).legend.map(({ name }) => name)
    expect(names).toEqual(['US', '(empty)'])
  })
})
