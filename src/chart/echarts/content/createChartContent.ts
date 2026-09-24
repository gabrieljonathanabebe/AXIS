import type { ChartType } from '../../../types/chart'
import { createAggregatedChartContent } from './createAggregatedChartContent'
import { createScatterChartContent } from './createScatterChartContent'

import type {
  ChartContent,
  ChartContentBuilder,
  ChartContentContext,
} from './chartContentTypes'

const chartContentBuilders = {
  bar: createAggregatedChartContent,
  line: createAggregatedChartContent,
  scatter: createScatterChartContent,
} satisfies Record<ChartType, ChartContentBuilder>

export function createChartContent(context: ChartContentContext): ChartContent {
  const builder = chartContentBuilders[context.chartType]
  return builder(context)
}
