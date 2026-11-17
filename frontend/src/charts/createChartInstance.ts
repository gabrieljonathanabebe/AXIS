import {
  createDefaultContainer,
  createDefaultTitle,
} from '../objects/objectDefaults'
import { createColorValue } from '../shared/colorValue'
import { DEFAULT_NUMBER_FORMAT } from '../shared/format/valueFormats'
import {
  getChartDefinition,
  isPointsChartType,
  isRadialChartType,
} from './chartDefinitions'

import type { DashboardStyle } from '../dashboardStyle/types'
import type { ObjectLayout } from '../objects/types'
import type { StrokeAppearance } from '../shared/strokeStyle'
import type { Surface } from '../shared/surface'
import type { TextStyle } from '../shared/textStyle'
import type { ChartInstance, ChartSpec, ChartType } from './types'

/**
 * Default look of a text drawn by ECharts, e.g. axis labels or legend.
 * @param color Hex color of the role the text takes.
 * @returns Text style in that color.
 */
function createChartTextStyle(color: string): TextStyle {
  return {
    color: createColorValue(color),
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'medium',
  }
}

/** Default gridlines; each axis draws its own. */
function createGridLines(style: DashboardStyle): StrokeAppearance {
  return {
    stroke: {
      lineStyle: 'solid',
      opacity: 0.1,
      paint: { color: createColorValue(style.colors.gridLine), kind: 'solid' },
      width: 1,
    },
    visible: true,
  }
}

/** Default axis line; each axis draws its own. */
function createAxisLine(style: DashboardStyle): StrokeAppearance {
  return {
    stroke: {
      lineStyle: 'solid',
      opacity: 1,
      paint: { color: createColorValue(style.colors.axis), kind: 'solid' },
      width: 1,
    },
    visible: true,
  }
}

/**
 * Default border of a box or a filled mark in the chart, e.g. the legend
 * or a bar: hidden, 1 px in the border color of the style, so showing it
 * takes that color.
 */
function createBorder(style: DashboardStyle): StrokeAppearance {
  return {
    stroke: {
      lineStyle: 'solid',
      opacity: 1,
      paint: { color: createColorValue(style.colors.border), kind: 'solid' },
      width: 1,
    },
    visible: false,
  }
}

/**
 * Default surface of a box in the chart, e.g. the legend: no fill and a
 * hidden border, so the box looks as before.
 */
function createBoxSurface(style: DashboardStyle): Surface {
  return {
    background: [],
    border: createBorder(style),
    borderRadius: 8,
    effects: [],
  }
}

type CreateChartInstanceParams = {
  type: ChartType
  layout: ObjectLayout
  style: DashboardStyle
  id?: string
}

/**
 * Creates the spec of a new chart; every color comes from the style.
 * @param type Chart type, decides axes, legend and label positions.
 * @param style Current dashboard style.
 * @returns Spec of a new chart of that type.
 */
export function createDefaultChartSpec(
  type: ChartType,
  style: DashboardStyle,
): ChartSpec {
  const definition = getChartDefinition(type)
  const isRadialChart = isRadialChartType(type)
  // Points and radial charts have no category axis; marks are single items.
  const hasItemMarks = isPointsChartType(type) || isRadialChart
  const textStyle = createChartTextStyle(style.colors.text)
  const axisTextStyle = createChartTextStyle(style.colors.textMuted)
  const gridLines = createGridLines(style)
  const axisLine = createAxisLine(style)
  const markBorder = createBorder(style)
  return {
    data: {
      encoding: {},
      aggregation: definition.defaultAggregation,
      colorAggregation: 'mean',
    },
    appearance: {
      color: createColorValue(style.palette[0]),
      colorScale: {
        categorical: {
          palette: style.palette.map(createColorValue),
        },
        continuous: {
          startColor: { kind: 'custom', color: '#fe0314' },
          endColor: { kind: 'custom', color: '#00fa2e' },
          visible: true,
          layout: { alignment: 'center', position: 'right' },
          size: { length: 200, thickness: 20 },
          bar: { border: createBorder(style), borderRadius: 0 },
          min: null,
          max: null,
          title: { text: '', textStyle: axisTextStyle, visible: true },
          labels: {
            numberFormat: { ...DEFAULT_NUMBER_FORMAT, compact: true },
            textStyle: axisTextStyle,
            tickCount: null,
            visible: true,
          },
          ticks: { ...axisLine, visible: false },
        },
      },
      title: createDefaultTitle(style),
      xAxis: {
        visible: true,
        title: { text: '', textStyle: axisTextStyle, visible: true },
        min: null,
        max: null,
        gridLines: gridLines,
        labels: {
          numberFormat: DEFAULT_NUMBER_FORMAT,
          rotation: 0,
          textStyle: axisTextStyle,
          tickCount: null,
          valueType: 'number',
        },
        line: axisLine,
      },
      yAxis: {
        visible: true,
        title: { text: '', textStyle: axisTextStyle, visible: true },
        min: null,
        max: null,
        gridLines: gridLines,
        labels: {
          numberFormat: DEFAULT_NUMBER_FORMAT,
          rotation: 0,
          textStyle: axisTextStyle,
          tickCount: null,
          valueType: 'number',
        },
        line: axisLine,
      },
      legend: {
        visible: true,
        layout: {
          alignment: 'center',
          gap: 8,
          padding: 8,
          position: isRadialChart ? 'right' : 'bottom',
        },
        symbol: 'auto',
        textStyle,
        overflow: 'auto',
        itemWidth: 24,
        itemHeight: 14,
        inactiveColor: createColorValue(style.colors.inactive),
        surface: createBoxSurface(style),
      },
      labels: {
        numberFormat: DEFAULT_NUMBER_FORMAT,
        visible: isRadialChart,
        layout: {
          position: isRadialChart ? 'inside' : hasItemMarks ? 'right' : 'top',
        },
        textStyle,
      },
      scatter: {
        border: markBorder,
        effect: { kind: 'none' },
        pointSize: 10,
        sizeRange: {
          min: 6,
          max: 28,
        },
        fill: { opacity: 0.9, paint: { kind: 'solid' } },
        symbol: 'circle',
      },
      line: {
        stroke: {
          lineStyle: 'solid',
          opacity: 1,
          paint: { kind: 'solid' },
          width: 3,
        },
        smooth: false,
        points: 'auto',
        areaFill: false,
        area: {
          opacity: 0.25,
          paint: { kind: 'solid' },
        },
        effect: { kind: 'none' },
      },
      bar: {
        border: markBorder,
        borderRadius: 4,
        barWidth: 24,
        effect: { kind: 'none' },
        fill: { opacity: 1, paint: { kind: 'solid' } },
      },
      pie: {
        border: markBorder,
        effect: { kind: 'none' },
        fill: { opacity: 1, paint: { kind: 'solid' } },
        innerRadius: 42,
      },
      tooltip: {
        layout: { gap: 4, padding: 10 },
        surface: style.tooltip,
        textStyle: { ...textStyle, fontSize: 13 },
      },
    },
    interaction: {
      legend: {
        enabled: true,
        selectionMode: 'multiple',
      },
      tooltip: {
        enabled: true,
        trigger: hasItemMarks ? 'item' : 'axis',
        fields: [],
        numberFormat: DEFAULT_NUMBER_FORMAT,
        delay: 0,
      },
      zoom: {
        enabled: false,
        inside: true,
        slider: false,
      },
    },
  }
}

/**
 * Creates a chart object with the default spec and container of its type.
 * @param params Chart type, layout, current style and an optional ID.
 * @returns A new chart in the current style.
 */
export function createChartInstance({
  type,
  layout,
  style,
  id = crypto.randomUUID(),
}: CreateChartInstanceParams): ChartInstance {
  return {
    id,
    kind: 'chart',
    type,
    spec: createDefaultChartSpec(type, style),
    layout,
    container: createDefaultContainer(style),
  }
}
