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
  color?: DataField
  size?: DataField
  series?: DataField
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

export type ChartTitleAppearance = {
  enabled: boolean
  text: string
  alignment: 'left' | 'center' | 'right'
}

export type ChartDataSpec = {
  encoding: ChartEncoding
  aggregation: Aggregation
}

export type ChartAppearanceSpec = {
  color: string
  title: ChartTitleAppearance
  grid: GridAppearance
  xAxis: AxisAppearance
  yAxis: AxisAppearance
  scatter: ScatterAppearance
  line: LineAppearance
  bar: BarAppearance
}

export type TooltipTrigger = 'item' | 'axis'

export type ValueFormat = 'auto' | 'number' | 'percent' | 'currency'

export type AnimationEasing = 'linear' | 'cubicOut' | 'cubicInOut'

export type ChartInteractionSpec = {
  tooltip: {
    enabled: boolean
    trigger: TooltipTrigger
    fields: string[]
    valueFormat: ValueFormat
    delay: number
  }
  zoom: {
    enabled: boolean
    inside: boolean
    slider: boolean
  }
  animation: {
    enabled: boolean
    duration: number
    easing: AnimationEasing
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

// ===== BASIC APPEARANCE TYPES ================================================

export type LineStyle = 'solid' | 'dashed' | 'dotted'

export type AxisFormat = 'auto' | 'number' | 'percent' | 'currency' | 'date'

export type GridAppearance = {
  enabled: boolean
  color: string
  opacity: number
  lineStyle: LineStyle
}

export type AxisAppearance = {
  enabled: boolean
  title: string
  min: number | null
  max: number | null
  format: AxisFormat
}
