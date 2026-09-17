export type DataField = {
  name: string
  physical_type: PhysicalType
  semantic_type: SemanticType
}

export type DataValue = string | number | null

export type DataRow = Record<string, DataValue>

export type Dataset = {
  fields: DataField[]
  rows: DataRow[]
}

export type ChartType = 'scatter' | 'line' | 'bar'

export type Aggregation =
  'none' | 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count'

export type ChartEncoding = {
  x?: DataField
  y?: DataField
}

export type ChartConfig = {
  type?: ChartType
  encoding: ChartEncoding
  aggregate?: Aggregation
  appearance: ChartAppearance
}

export type PhysicalType =
  'integer' | 'float' | 'string' | 'boolean' | 'date' | 'datetime'

export type SemanticType = 'numeric' | 'categorical' | 'temporal' | 'identifier'

export type ScatterAppearance = {
  pointSize: number
  opacity: number
}

export type LineAppearance = {
  lineWidth: number
  smooth: boolean
  showSymbol: boolean
}

export type BarAppearance = {
  borderRadius: number
  barWidth: number
}

export type ChartAppearance = {
  color: string
  showGrid: boolean
  showTooltip: boolean
  animation: boolean
  scatter: ScatterAppearance
  line: LineAppearance
  bar: BarAppearance
}
