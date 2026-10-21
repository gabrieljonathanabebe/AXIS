import type {
  ContainerFormatElement,
  DashboardObjectBase,
  ElementRect,
  ObjectTitleAppearance,
  SetContainer,
} from '../objects/types'
import type { DataField } from '../datasets/types'
import type { CurrencyCode, ValueFormat } from '../shared/format/valueFormats'
import type { HorizontalAlignment, TextStyle } from '../shared/textStyle'
import type { LineStyle } from '../shared/strokeStyle'

// ===== ACTIONS ===============================================================
export type SetAggregation = <TKey extends ChartAggregationKey>(
  key: TKey,
  aggregation: ChartDataSpec[TKey],
) => void

export type SetAppearance = <TKey extends keyof ChartAppearanceSpec>(
  key: TKey,
  value: ChartAppearanceSpec[TKey],
) => void

export type SetInteraction = <TKey extends keyof ChartInteractionSpec>(
  key: TKey,
  value: ChartInteractionSpec[TKey],
) => void

export type SetChartAppearance = <
  TChartKey extends ChartMarkKey,
  TOptionKey extends keyof ChartAppearanceSpec[TChartKey],
>(
  chartKey: TChartKey,
  optionKey: TOptionKey,
  value: ChartAppearanceSpec[TChartKey][TOptionKey],
) => void

export type SetChartType = (type: ChartType) => void

export type SetEncodingField = (
  axis: keyof ChartEncoding,
  fieldName: string,
) => void

/** Everything the format popover and the Build panel change on a chart. */
export type ChartActions = {
  setAggregation: SetAggregation
  setAppearance: SetAppearance
  setChartAppearance: SetChartAppearance
  setChartType: SetChartType
  setContainer: SetContainer
  setEncodingField: SetEncodingField
  setInteraction: SetInteraction
}

/** What a chart format widget needs: the chart, its fields and actions. */
export type ChartFormatProps = {
  actions: ChartActions
  chart: ChartInstance
  fields: DataField[]
}

// ===== AGGREGATION ===========================================================
export type Aggregation =
  'none' | 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count'

export type GroupAggregation = Exclude<Aggregation, 'none'>

// ===== AXIS ==================================================================
export type AxisAppearance = {
  visible: boolean
  title: string
  min: number | null
  max: number | null
  format: AxisFormat
  currency: CurrencyCode
  gridLines: GridAppearance
  labels: AxisLabelsAppearance
  titleStyle: TextStyle
}

export type AxisFormat = 'auto' | 'number' | 'percent' | 'currency' | 'date'

export type AxisLabelsAppearance = {
  rotation: number
  textStyle: TextStyle
  tickCount: number | null
}

export type AxisTitleEdit = {
  axis: 'x' | 'y'
  rect: ElementRect
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
  title: ObjectTitleAppearance
  xAxis: AxisAppearance
  yAxis: AxisAppearance
  labels: LabelsAppearance
  legend: LegendAppearance
  scatter: ScatterAppearance
  line: LineAppearance
  bar: BarAppearance
}

export type ChartDataSpec = {
  encoding: ChartEncoding
  aggregation: Aggregation
  colorAggregation: GroupAggregation
}

// Field names; roles and types are resolved from the dataset when read.
export type ChartEncoding = {
  x?: string
  y?: string
  color?: string
  size?: string
  series?: string
}

/** Chart elements that can be formatted directly on the chart. */
export type ChartFormatElement =
  | keyof Pick<ChartAppearanceSpec, 'legend' | 'title' | 'xAxis' | 'yAxis'>
  | 'colorScale'
  | ContainerFormatElement
  | 'marks'
  | 'tooltip'
  | 'xAxisLabels'
  | 'yAxisLabels'

/** A chart on the canvas: the shared object fields plus its content. */
export type ChartInstance = DashboardObjectBase & {
  kind: 'chart'
  type: ChartType
  spec: ChartSpec
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

// ===== GRID ================================================================
export type GridAppearance = {
  visible: boolean
  color: string
  opacity: number
  lineStyle: LineStyle
}

// ===== INTERACTION ===========================================================
export type TooltipTrigger = 'item' | 'axis'

// ===== LABEL =================================================================
export type LabelPosition = 'top' | 'right' | 'inside'

export type LabelsAppearance = {
  visible: boolean
  position: LabelPosition
  textStyle: TextStyle
}

// ===== LEGEND ================================================================
export type LegendAppearance = {
  alignment: HorizontalAlignment
  visible: boolean
  position: 'top' | 'bottom' | 'left' | 'right'
  symbol: 'auto' | 'circle' | 'rect' | 'line'
  textStyle: TextStyle
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
