import type { DashboardStyle } from '../dashboardStyle/types'
import type { DataField } from '../datasets/types'
import type {
  ContainerFormatElement,
  DashboardObjectBase,
  ElementRect,
  ObjectLayout,
  ObjectTitleAppearance,
  SetContainer,
} from '../objects/types'
import type { ColorValue } from '../shared/colorValue'
import type { Effect } from '../shared/effect'
import type { SeriesFill } from '../shared/fill'
import type {
  DateFormat,
  NumberFormat,
  TimeGrain,
} from '../shared/format/valueFormats'
import type { Layout } from '../shared/layout'
import type { SeriesStrokeStyle, StrokeAppearance } from '../shared/strokeStyle'
import type { Surface } from '../shared/surface'
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
  setCategoryOrder: (patch: Partial<ChartCategoryOrder>) => void
  setChartAppearance: SetChartAppearance
  setChartType: SetChartType
  setContainer: SetContainer
  setEncodingField: SetEncodingField
  setInteraction: SetInteraction
  setLayout: (layout: ObjectLayout) => void
  setTimeGrain: (timeGrain: TimeGrain | null) => void
}

/** What a chart format widget needs: the chart, its fields and actions. */
export type ChartFormatProps = {
  actions: ChartActions
  chart: ChartInstance
  fields: DataField[]
  style: DashboardStyle
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
  gridLines: StrokeAppearance
  labels: AxisLabelsAppearance
  line: StrokeAppearance
}

export type AxisLabelsAppearance = {
  dateFormat: DateFormat
  numberFormat: NumberFormat
  rotation: number
  textStyle: TextStyle
  tickCount: number | null
  valueType: AxisValueType
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
  border: StrokeAppearance
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
  tooltip: TooltipAppearance
}

/** How the chart sorts and limits the categories on X. */
export type ChartCategoryOrder = Pick<ChartDataSpec, 'limit' | 'sort'>

export type ChartDataSpec = {
  encoding: ChartEncoding
  aggregation: Aggregation
  colorAggregation: GroupAggregation
  timeGrain: TimeGrain | null
  sort: ChartSort
  limit: ChartLimit | null
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
  | keyof Pick<
      ChartAppearanceSpec,
      'labels' | 'legend' | 'title' | 'xAxis' | 'yAxis'
    >
  | 'colorScale'
  | 'colorScaleLabels'
  | 'colorScaleTitle'
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

/** Keeps the categories with the largest or smallest total value. */
export type ChartLimit = {
  kind: 'top' | 'bottom'
  count: number
}

export type ChartMarkKey = keyof Pick<
  ChartAppearanceSpec,
  'bar' | 'line' | 'pie' | 'scatter'
>

/** Order of the categories: by their total value or by their name. */
export type ChartSort = {
  by: 'value' | 'category'
  order: 'asc' | 'desc'
}

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
    layout: Pick<Layout, 'alignment' | 'position'>
    /** Size of the bar along its side and across it, in pixels. */
    size: { length: number; thickness: number }
    /** Corners and border of the bar; its fill is the data color. */
    bar: Pick<Surface, 'border' | 'borderRadius'>
    min: number | null
    max: number | null
    title: AxisTitleAppearance
    labels: ColorScaleLabelsAppearance
    ticks: StrokeAppearance
  }
}

/**
 * Values along the continuous color scale: like the labels of an axis,
 * without rotation and dates, since the color field is always a number.
 */
export type ColorScaleLabelsAppearance = Pick<
  AxisLabelsAppearance,
  'numberFormat' | 'textStyle' | 'tickCount'
> & {
  visible: boolean
}

// ===== INTERACTION ===========================================================
/**
 * Look of the data tooltip: its padding and the gap between its rows, its
 * surface, drawn as CSS, and its text; the color and weight are those of
 * the values, the labels fade the color. What it shows and when is
 * interaction.
 */
export type TooltipAppearance = {
  layout: Pick<Layout, 'gap' | 'padding'>
  surface: Surface
  textStyle: TextStyle
}

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
  layout: Pick<Layout, 'alignment' | 'gap' | 'padding' | 'position'>
  symbol: 'auto' | 'circle' | 'rect' | 'line'
  textStyle: TextStyle
  /** Whether too many entries page by scrolling; `plain` shows all. */
  overflow: 'auto' | 'plain' | 'scroll'
  itemWidth: number
  itemHeight: 14
  inactiveColor: ColorValue
  surface: Surface
}

export type LegendSelectionMode = 'multiple' | 'single'

/**
 * One entry of the legend as the chart draws it: the name of a series or
 * category and its color, e.g. a palette color.
 */
export type LegendEntry = {
  color: string
  name: string
  /** Shown text if it differs from the name, e.g. a formatted date. */
  label?: string
}

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
  border: StrokeAppearance
  effect: Effect
  fill: SeriesFill
  innerRadius: number
}

// ===== SCATTER ===============================================================
export type ScatterAppearance = {
  border: StrokeAppearance
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
