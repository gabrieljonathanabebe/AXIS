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

export type ChartDataSpec = {
  encoding: ChartEncoding
  aggregation: Aggregation
}

export type ChartAppearanceSpec = {
  color: string
  showGrid: boolean
  scatter: ScatterAppearance
  line: LineAppearance
  bar: BarAppearance
}
export type ChartInteractionSpec = {
  tooltip: {
    enabled: boolean
  }
  animation: {
    enabled: boolean
  }
}

export type ChartSpec = {
  data: ChartDataSpec
  appearance: ChartAppearanceSpec
  interaction: ChartInteractionSpec
}

export type ChartLayout = {
  x: number
  y: number
  width: number
  height: number
}

export type ChartInstance = {
  id: string
  type: ChartType
  spec: ChartSpec
  layout: ChartLayout
}
