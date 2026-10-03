// ===== AGGREGATION ===========================================================
export type Aggregation =
  'none' | 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count'

export type GroupAggregation = Exclude<Aggregation, 'none'>

// ===== ALIGNMENT =============================================================
export type HorizontalAlignment = 'start' | 'center' | 'end'

// ===== AXIS ==================================================================
export type AxisAppearance = {
  enabled: boolean
  title: string
  min: number | null
  max: number | null
  format: AxisFormat
  currency: CurrencyCode
  labels: AxisLabelsAppearance
  titleStyle: AxisTitleStyle
}

export type AxisFormat = 'auto' | 'number' | 'percent' | 'currency' | 'date'

export type AxisLabelsAppearance = {
  rotation: number
  tickCount: number | null
}

export type AxisTitleStyle = {
  color: string
  fontSize: number
  fontWeight: LabelFontWeight
}

// ===== BAR ===================================================================
export type BarAppearance = {
  borderRadius: number
  barWidth: number
}

// ===== CHART =================================================================
export type ChartAggregationKey = keyof Pick<
  ChartDataSpec,
  'aggregation' | 'colorAggregation'
>

export type ChartAppearanceSpec = {
  color: string
  colorScale: ColorScaleAppearance
  title: ChartTitleAppearance
  grid: GridAppearance
  xAxis: AxisAppearance
  yAxis: AxisAppearance
  labels: LabelsAppearance
  legend: LegendAppearance
  scatter: ScatterAppearance
  line: LineAppearance
  bar: BarAppearance
}

export type ChartContainerAppearance = {
  background: ChartContainerBackground
  padding: number
  borderRadius: number
}

export type ChartContainerBackground =
  { kind: ChartContainerBackgroundPreset } | { kind: 'color'; color: string }

export type ChartContainerBackgroundPreset = 'glass' | 'surface' | 'none'

export type ChartDataSpec = {
  encoding: ChartEncoding
  aggregation: Aggregation
  colorAggregation: GroupAggregation
}

export type ChartEncoding = {
  x?: DataField
  y?: DataField
  color?: DataField
  size?: DataField
  series?: DataField
}

export type ChartInstance = {
  id: string
  type: ChartType
  spec: ChartSpec
  layout: ChartLayout
  container: ChartContainerAppearance
}

export type ChartInteractionSpec = {
  legend: {
    enabled: boolean
    selectionMode: LegendSelectionMode
  }
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

export type ChartLayout = {
  x: number
  y: number
  width: number
  height: number
}

export type ChartMarkKey = keyof Pick<
  ChartAppearanceSpec,
  'bar' | 'line' | 'scatter'
>

export type ChartSpec = {
  data: ChartDataSpec
  appearance: ChartAppearanceSpec
  interaction: ChartInteractionSpec
}

export type ChartTitleAppearance = {
  alignment: HorizontalAlignment
  enabled: boolean
  text: string
}

export type ChartType = 'scatter' | 'line' | 'bar' | 'pie' | 'donut'

// ===== COLOR =================================================================
export type ColorScaleAppearance = {
  categorical: {
    palette: string[]
  }
  continuous: {
    startColor: string
    endColor: string
    visible: boolean
    position: 'left' | 'right'
    orientation: 'vertical' | 'horizontal'
    min: number | null
    max: number | null
    labels: boolean
  }
}

// ===== DATA ==================================================================
export type DataField = {
  name: string
  physical_type: PhysicalType
  semantic_type: SemanticType
}

export type DataRow = Record<string, DataValue>

export type Dataset = {
  fields: DataField[]
  rows: DataRow[]
}

export type DataValue = string | number | null

// User corrections of the detected semantic role, keyed by field name.
export type SemanticRoleOverrides = Record<string, SemanticRole>

export type DatasetProfile = {
  dataset_id: string
  row_count: number
  column_count: number
  missing_count: number
  duplicate_rows: number
  fields: FieldProfile[]
}

export type FieldProfile = {
  name: string
  physical_type: PhysicalType
  semantic_role: SemanticRole
  missing_count: number
  unique_count: number
  statistics: FieldStatistics | null
}

export type FieldStatistics =
  MeasureStatistics | DimensionStatistics | TemporalStatistics

export type MeasureStatistics = {
  kind: 'measure'
  min: number | null
  max: number | null
  mean: number | null
  median: number | null
  histogram: number[]
}

export type DimensionStatistics = {
  kind: 'dimension'
  value_counts: ValueCount[]
}

export type TemporalStatistics = {
  kind: 'temporal'
  min: string | null
  max: string | null
  histogram: number[]
}

export type ValueCount = {
  value: string
  count: number
}

// ===== FORMAT ================================================================
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY'

export type ValueFormat = 'auto' | 'number' | 'percent' | 'currency'

// ===== GRID ================================================================
export type GridAppearance = {
  enabled: boolean
  color: string
  opacity: number
  lineStyle: LineStyle
}

// ===== INTERACTION ===========================================================
export type TooltipTrigger = 'item' | 'axis'

export type AnimationEasing = 'linear' | 'cubicOut' | 'cubicInOut'

// ===== LABEL =================================================================
export type LabelPosition = 'top' | 'right' | 'inside'

export type LabelFontWeight = 'light' | 'medium' | 'bold'

export type LabelsAppearance = {
  enabled: boolean
  position: LabelPosition
  color: string
  fontSize: number
  fontWeight: LabelFontWeight
}

// ===== LEGEND ================================================================
export type LegendAppearance = {
  alignment: HorizontalAlignment
  visible: boolean
  position: 'top' | 'bottom' | 'left' | 'right'
  symbol: 'auto' | 'circle' | 'rect' | 'line'
  textColor: string
  fontSize: number
  gap: number
  layout: 'auto' | 'plain' | 'scroll'
  itemWidth: number
  itemHeight: 14
  padding: number
  inactiveColor: string
}

export type LegendSelectionMode = 'multiple' | 'single'

// ===== LINE ==================================================================
export type LineAppearance = {
  lineWidth: number
  lineStyle: LineStyle
  smooth: boolean
  showSymbol: boolean
  areaFill: boolean
  areaColor: string
  areaOpacity: number
}

export type LineStyle = 'solid' | 'dashed' | 'dotted'

// ===== SCATTER ===============================================================
export type ScatterAppearance = {
  pointSize: number
  sizeRange: ScatterSizeRange
  opacity: number
  symbol: ScatterSymbol
}

export type ScatterSizeRange = {
  min: number
  max: number
}

export type ScatterSymbol = 'circle' | 'rect' | 'triangle' | 'diamond'

// ===== TYPES =================================================================
export type PhysicalType =
  'integer' | 'float' | 'string' | 'boolean' | 'date' | 'datetime'

export type SemanticType = 'numeric' | 'categorical' | 'temporal' | 'identifier'

export type SemanticRole = 'measure' | 'dimension' | 'temporal' | 'identifier'
