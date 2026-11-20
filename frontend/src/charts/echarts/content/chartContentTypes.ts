import type { EChartsOption } from 'echarts'
import type { ChartQueryResult } from '@/charts/chartsApi'
import type { ChartTheme } from '@/charts/echarts/chartTheme'
import type { ChartSpec, ChartType, LegendEntry } from '@/charts/types'
import type { DataRow, Dataset } from '@/datasets/types'
import type { DataSelection } from '@/workspace/types'

// ===== TYPES =================================================================
export type ChartContent = {
  legend: LegendEntry[]
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
