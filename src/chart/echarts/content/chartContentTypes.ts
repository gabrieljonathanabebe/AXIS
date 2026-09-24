import type { EChartsOption } from 'echarts'

import type { ChartQueryResult } from '../../../api/chartQuery'
import type { ChartSpec, ChartType, Dataset } from '../../../types/chart'
import type { ChartTheme } from '../chartTheme'

// ===== TYPES =================================================================
export type ChartContent = {
  series: NonNullable<EChartsOption['series']>
  visualMap?: EChartsOption['visualMap']
  xAxis?: EChartsOption['xAxis']
  yAxis?: EChartsOption['yAxis']
}

export type ChartContentContext = {
  chartType: ChartType
  dataset: Dataset
  queryResult: ChartQueryResult | null
  spec: ChartSpec
  theme: ChartTheme
}

export type ChartContentBuilder = (context: ChartContentContext) => ChartContent
