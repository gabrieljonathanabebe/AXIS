import { HIGHLIGHT_SERIES_PREFIX } from './content/selectionStyle'
import { getElementRect } from './getElementRect'

import type { ECharts } from 'echarts'
import type { ElementRect } from '../../objects/types'
import type { ChartFormatElement } from '../types'

// ===== TYPES =================================================================
/** Something ECharts draws on its canvas: a text, a shape or a group. */
type ChartElement = Parameters<typeof getElementRect>[0]

/** A group of drawn elements, e.g. the labels of an axis. */
type ChartGroup = ChartElement & { children: () => ChartElement[] }

/** The data of one series, with the element drawn for each item. */
type SeriesData = {
  count: () => number
  getItemGraphicEl: (index: number) => ChartElement | undefined
}

/** One series of the internal model, e.g. the bars of a bar chart. */
type SeriesModel = {
  getData: () => SeriesData
  id: string
  subType: string
}

/** The parts of an axis or grid model this file reads. */
type ComponentModel = {
  axis?: { axisBuilder?: { group: ChartGroup } }
  coordinateSystem?: { getRect: () => ElementRect }
}

/**
 * The internals of an ECharts instance this file reads. ECharts types them
 * as private on the instance and hands them to extensions as `ExtensionAPI`.
 */
type ChartInternals = {
  getModel: () => {
    getComponent: (mainType: string, index: number) => unknown
    getSeries: () => SeriesModel[]
  }
  getViewOfSeriesModel: (series: SeriesModel) => { group: ChartElement }
}

// ===== CONSTANTS =============================================================
/**
 * Most parts framed one by one; more, e.g. the points of a large scatter,
 * get one frame around the plot.
 */
const MAX_FRAMED_PARTS = 100

// ===== HELPERS ===============================================================
/** Keeps the elements that are drawn, without gaps of missing items. */
function isElement<T extends ChartElement>(
  element: T | null | undefined,
): element is T {
  return Boolean(element)
}

/** Lists the series of the content, without the overlays of a selection. */
function getContentSeries(chart: ChartInternals): SeriesModel[] {
  return chart
    .getModel()
    .getSeries()
    .filter((series) => !series.id.startsWith(HIGHLIGHT_SERIES_PREFIX))
}

/** Lists the element drawn for each item of a series, e.g. each bar. */
function getItemElements(series: SeriesModel): ChartElement[] {
  const data = series.getData()
  return Array.from({ length: data.count() }, (_, index) => {
    return data.getItemGraphicEl(index)
  }).filter(isElement)
}

/**
 * Finds the visible data label of a mark: the text ECharts attaches to its
 * shape, for a point to the symbol inside its group.
 */
function getItemLabel(element: ChartElement): ChartElement | null {
  const shape = element.isGroup
    ? (element as ChartGroup).children()[0]
    : element
  const label = shape?.getTextContent()
  return label && !label.ignore && !label.invisible ? label : null
}

/** Lists the marks one by one; a line counts as a whole with its points. */
function getMarkElements(chart: ChartInternals): ChartElement[] {
  return getContentSeries(chart).flatMap((series) => {
    return series.subType === 'line'
      ? [chart.getViewOfSeriesModel(series).group]
      : getItemElements(series)
  })
}

/** Lists the visible data labels of all marks. */
function getLabelElements(chart: ChartInternals): ChartElement[] {
  return getContentSeries(chart)
    .flatMap(getItemElements)
    .map(getItemLabel)
    .filter(isElement)
}

/** Finds the group of an axis: line, ticks, labels and title, no gridlines. */
function getAxisGroup(
  chart: ChartInternals,
  axis: 'xAxis' | 'yAxis',
): ChartGroup | null {
  const model = chart.getModel().getComponent(axis, 0) as
    ComponentModel | undefined
  return model?.axis?.axisBuilder?.group ?? null
}

/** Finds the labels of an axis, the only group inside the axis group. */
function getAxisLabels(
  chart: ChartInternals,
  axis: 'xAxis' | 'yAxis',
): ChartElement | null {
  const group = getAxisGroup(chart, axis)
  return group?.children().find((child) => child.isGroup) ?? null
}

/** Measures the plot: the grid of a cartesian chart, else e.g. the pie. */
function measurePlot(chart: ChartInternals): ElementRect | null {
  const grid = chart.getModel().getComponent('grid', 0) as
    ComponentModel | undefined
  const rect = grid?.coordinateSystem?.getRect()
  if (rect) {
    return { height: rect.height, width: rect.width, x: rect.x, y: rect.y }
  }
  const [series] = getContentSeries(chart)
  return series
    ? getElementRect(chart.getViewOfSeriesModel(series).group)
    : null
}

/** Frames the parts one by one, or the plot when there are too many. */
function measureParts(
  chart: ChartInternals,
  parts: ChartElement[],
): ElementRect[] {
  if (parts.length <= MAX_FRAMED_PARTS) {
    return parts.map(getElementRect)
  }
  const plot = measurePlot(chart)
  return plot ? [plot] : []
}

// ===== FUNCTION ==============================================================
/**
 * Measures the parts of the element in focus that ECharts draws, without
 * drawing again. Reads ECharts internals, kept to this file.
 * @param instance ECharts instance of the chart.
 * @param element Element in focus.
 * @returns Bounds inside the canvas, or null for elements ECharts does not
 *   draw or that get no frame yet, e.g. the title or the legend.
 */
export function measureFocusRects(
  instance: ECharts,
  element: ChartFormatElement,
): ElementRect[] | null {
  const chart = instance as unknown as ChartInternals
  switch (element) {
    case 'labels':
      return measureParts(chart, getLabelElements(chart))
    case 'marks':
      return measureParts(chart, getMarkElements(chart))
    case 'xAxis':
    case 'yAxis':
      return measureParts(
        chart,
        [getAxisGroup(chart, element)].filter(isElement),
      )
    case 'xAxisLabels':
      return measureParts(
        chart,
        [getAxisLabels(chart, 'xAxis')].filter(isElement),
      )
    case 'yAxisLabels':
      return measureParts(
        chart,
        [getAxisLabels(chart, 'yAxis')].filter(isElement),
      )
    default:
      return null
  }
}
