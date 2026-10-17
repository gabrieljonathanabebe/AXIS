import type { GridComponentOption, SeriesOption } from 'echarts'

import { LEGEND_EDGE_OFFSETS } from './createLegendOption'
import { FONT_WEIGHT_VALUES } from '../../shared/textStyle'
import type { LegendAppearance } from '../types'
import type { TextStyle } from '../../shared/textStyle'

// ===== TYPES =================================================================
type CreateGridOptionParams = {
  legend: LegendAppearance
  series: SeriesOption | SeriesOption[]
  showsLegend: boolean
}

// ===== CONSTANTS =============================================================
/** Room for axis labels and titles on each side of the plot. */
const BASE_GRID = { bottom: 72, left: 72, right: 56, top: 40 }

/**
 * Distance from the legend to the plot. Left and bottom also hold the axis
 * labels and titles, so the legend stays outside of them.
 */
const LEGEND_TO_PLOT = { bottom: 56, left: 88, right: 32, top: 32 }

/** ECharts defaults for legend padding, icon width and icon-to-text gap. */
const LEGEND_PADDING = 5
const LEGEND_ICON_WIDTH = 25
const LEGEND_TEXT_GAP = 5

let measureContext: CanvasRenderingContext2D | null | undefined

// ===== HELPERS ===============================================================
/**
 * Measures text like ECharts draws it, in its default sans-serif font.
 * @param text Text to measure.
 * @param style Size, weight and slant the text is drawn in.
 * @returns Width in pixels; estimated when no canvas is available.
 */
function measureTextWidth(text: string, style: TextStyle): number {
  const { fontSize, fontStyle, fontWeight } = style
  measureContext ??= document.createElement('canvas').getContext('2d')
  if (!measureContext) {
    return text.length * fontSize * 0.6
  }
  const weight = FONT_WEIGHT_VALUES[fontWeight]
  measureContext.font = `${fontStyle} ${weight} ${fontSize}px sans-serif`
  return measureContext.measureText(text).width
}

/**
 * Space the legend takes from the plot on its side of the chart.
 * @param legend Legend appearance with position and font size.
 * @param names Legend entries, one per series.
 * @returns One row height for top and bottom, the widest entry for the sides.
 */
function getLegendExtent(legend: LegendAppearance, names: string[]): number {
  const padding = 2 * LEGEND_PADDING
  if (legend.position === 'top' || legend.position === 'bottom') {
    return Math.max(legend.itemHeight, legend.textStyle.fontSize) + padding
  }
  const textWidth = Math.max(
    0,
    ...names.map((name) => measureTextWidth(name, legend.textStyle)),
  )
  return LEGEND_ICON_WIDTH + LEGEND_TEXT_GAP + textWidth + padding
}

// ===== FUNCTION ==============================================================
/**
 * Creates the plot grid and moves it away from a visible legend, so the
 * legend never covers the plot, its labels or the axis titles.
 * @param params Legend appearance, the series behind the legend entries and
 * whether the legend is shown.
 * @returns Grid margins in pixels.
 */
export function createGridOption({
  legend,
  series,
  showsLegend,
}: CreateGridOptionParams): GridComponentOption {
  if (!showsLegend) {
    return { ...BASE_GRID, containLabel: false }
  }
  const { position } = legend
  const names = [series].flat().map((item) => String(item.name ?? ''))
  return {
    ...BASE_GRID,
    containLabel: false,
    [position]:
      LEGEND_EDGE_OFFSETS[position] +
      getLegendExtent(legend, names) +
      LEGEND_TO_PLOT[position],
  }
}
