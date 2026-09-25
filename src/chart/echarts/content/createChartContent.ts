import type { ChartType } from '../../../types/chart'
import { createAggregatedChartContent } from './createAggregatedChartContent'
import { createPieChartContent } from './createPieChartContent'
import { createScatterChartContent } from './createScatterChartContent'

import type {
  ChartContent,
  ChartContentBuilder,
  ChartContentContext,
} from './chartContentTypes'

const chartContentBuilders = {
  bar: createAggregatedChartContent,
  donut: createPieChartContent,
  line: createAggregatedChartContent,
  pie: createPieChartContent,
  scatter: createScatterChartContent,
} satisfies Record<ChartType, ChartContentBuilder>

export function createChartContent(context: ChartContentContext): ChartContent {
  const builder = chartContentBuilders[context.chartType]
  return builder(context)
}
