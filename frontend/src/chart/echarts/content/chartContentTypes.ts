import type { EChartsOption } from 'echarts'

import type { ChartQueryResult } from '../../../api/chartQuery'
import type { ChartSpec, ChartType } from '../../../types/chart'
import type { DataRow, Dataset } from '../../../datasets/types'
import type { ChartTheme } from '../chartTheme'
import type { DataSelection } from '../../../types/workspace'

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
  highlightResult: ChartQueryResult | null
  points: DataRow[]
  queryResult: ChartQueryResult | null
  selection: DataSelection | null
  spec: ChartSpec
  theme: ChartTheme
}

export type ChartContentBuilder = (context: ChartContentContext) => ChartContent
