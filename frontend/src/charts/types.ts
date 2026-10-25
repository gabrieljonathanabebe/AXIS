import type { DataField } from '../datasets/types'
import type {
  ContainerFormatElement,
  DashboardObjectBase,
  ElementRect,
  ObjectTitleAppearance,
  SetContainer,
} from '../objects/types'
import type { ColorValue } from '../shared/colorValue'
import type { Effect } from '../shared/effect'
import type { SeriesFill } from '../shared/fill'
import type { NumberFormat } from '../shared/format/valueFormats'
import type { Layout } from '../shared/layout'
import type { SeriesStrokeStyle, StrokeStyle } from '../shared/strokeStyle'
import type { TextStyle } from '../shared/textStyle'

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
  title: AxisTitleAppearance
  min: number | null
  max: number | null
  gridLines: AxisStrokeAppearance
  labels: AxisLabelsAppearance
  line: AxisStrokeAppearance
}

export type AxisLabelsAppearance = {
  numberFormat: NumberFormat
  rotation: number
  textStyle: TextStyle
  tickCount: number | null
  valueType: AxisValueType
}

/** A line an axis draws: its axis line or its gridlines. */
export type AxisStrokeAppearance = {
  visible: boolean
  stroke: StrokeStyle
}

/** Title of an axis; text, style and visibility match the object title. */
export type AxisTitleAppearance = Pick<
  ObjectTitleAppearance,
  'text' | 'textStyle' | 'visible'
>

export type AxisTitleEdit = {
  axis: 'x' | 'y'
  rect: ElementRect
}

/** What the labels of an axis show; numbers use its number format. */
export type AxisValueType = 'number' | 'date'

// ===== BAR ===================================================================
export type BarAppearance = {
  border: StrokeStyle
  borderRadius: number
  barWidth: number
  effect: Effect
  fill: SeriesFill
}

// ===== CHART =================================================================
export type ChartAggregationKey = keyof Pick<
  ChartDataSpec,
  'aggregation' | 'colorAggregation'
>

export type ChartAppearanceSpec = {
  color: ColorValue
  colorScale: ColorScaleAppearance
  title: ObjectTitleAppearance
  xAxis: AxisAppearance
  yAxis: AxisAppearance
  labels: LabelsAppearance
  legend: LegendAppearance
  scatter: ScatterAppearance
  line: LineAppearance
  bar: BarAppearance
  pie: PieAppearance
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
    numberFormat: NumberFormat
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
  'bar' | 'line' | 'pie' | 'scatter'
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
    palette: ColorValue[]
  }
  continuous: {
    startColor: ColorValue
    endColor: ColorValue
    visible: boolean
    layout: Pick<Layout<'left' | 'right'>, 'orientation' | 'position'>
    min: number | null
    max: number | null
    labels: boolean
  }
}

// ===== INTERACTION ===========================================================
export type TooltipTrigger = 'item' | 'axis'

// ===== LABEL =================================================================
export type LabelPosition = 'top' | 'right' | 'inside'

export type LabelsAppearance = {
  visible: boolean
  numberFormat: NumberFormat
  layout: Pick<Layout<LabelPosition>, 'position'>
  textStyle: TextStyle
}

// ===== LEGEND ================================================================
export type LegendAppearance = {
  visible: boolean
  layout: Pick<Layout, 'alignment' | 'gap' | 'position'>
  symbol: 'auto' | 'circle' | 'rect' | 'line'
  textStyle: TextStyle
  /** Whether too many entries page by scrolling; `plain` shows all. */
  overflow: 'auto' | 'plain' | 'scroll'
  itemWidth: number
  itemHeight: 14
  inactiveColor: ColorValue
}

export type LegendSelectionMode = 'multiple' | 'single'

// ===== LINE ==================================================================
export type LineAppearance = {
  stroke: SeriesStrokeStyle
  smooth: boolean
  points: LinePoints
  areaFill: boolean
  area: SeriesFill
  effect: Effect
}

/**
 * Whether a line shows its points: `auto` only while there are few enough
 * to read as points, not as a bead chain.
 */
export type LinePoints = 'auto' | 'on' | 'off'

// ===== PIE ===================================================================
/** Segments of pie and donut charts; the inner radius applies to donuts. */
export type PieAppearance = {
  border: StrokeStyle
  effect: Effect
  fill: SeriesFill
  innerRadius: number
}

// ===== SCATTER ===============================================================
export type ScatterAppearance = {
  border: StrokeStyle
  effect: Effect
  fill: SeriesFill
  pointSize: number
  sizeRange: ScatterSizeRange
  symbol: ScatterSymbol
}

export type ScatterSizeRange = {
  min: number
  max: number
}

export type ScatterSymbol = 'circle' | 'rect' | 'triangle' | 'diamond'
