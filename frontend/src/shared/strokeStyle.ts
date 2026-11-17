import type { Paint, SeriesPaint } from './paint'

// ===== TYPES =================================================================
/** How a line is dashed; ECharts and SVG both know these values. */
export type LineStyle = 'solid' | 'dashed' | 'dotted'

/**
 * How a line or outline looks, e.g. the border of a container: its paint
 * like a fill, its dash and width. `TPaint` is a paint with its own color
 * unless the stroke takes the color of its series.
 */
export type StrokeStyle<TPaint extends Paint | SeriesPaint = Paint> = {
  lineStyle: LineStyle
  opacity: number
  paint: TPaint
  width: number
}

/** Stroke of a data series, e.g. a line; its color comes from the series. */
export type SeriesStrokeStyle = StrokeStyle<SeriesPaint>

/**
 * A stroke with an eye, e.g. a border or the gridlines of an axis: hiding
 * it keeps its values, so showing it again brings them back.
 */
export type StrokeAppearance<TPaint extends Paint | SeriesPaint = Paint> = {
  visible: boolean
  stroke: StrokeStyle<TPaint>
}
