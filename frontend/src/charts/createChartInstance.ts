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
import type { StrokeStyle } from '../shared/strokeStyle'
import type { TextStyle } from '../shared/textStyle'
import type {
  AxisStrokeAppearance,
  ChartInstance,
  ChartSpec,
  ChartType,
} from './types'

/** Default look of the texts drawn by ECharts: axes, legend, labels. */
function createChartTextStyle(style: DashboardStyle): TextStyle {
  return {
    color: createColorValue(style.colors.text),
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'medium',
  }
}

/** Default gridlines; each axis draws its own. */
function createGridLines(style: DashboardStyle): AxisStrokeAppearance {
  return {
    stroke: {
      lineStyle: 'solid',
      opacity: 0.08,
      paint: { color: createColorValue(style.colors.gridLine), kind: 'solid' },
      width: 1,
    },
    visible: true,
  }
}

/** Default axis line; each axis draws its own. */
function createAxisLine(style: DashboardStyle): AxisStrokeAppearance {
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

/** Default border of filled marks: bars, points and pie segments; off. */
function createMarkBorder(style: DashboardStyle): StrokeStyle {
  return {
    lineStyle: 'solid',
    opacity: 1,
    paint: { color: createColorValue(style.colors.border), kind: 'solid' },
    width: 0,
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
  const textStyle = createChartTextStyle(style)
  const gridLines = createGridLines(style)
  const axisLine = createAxisLine(style)
  const markBorder = createMarkBorder(style)
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
          layout: { orientation: 'vertical', position: 'right' },
          min: null,
          max: null,
          labels: true,
        },
      },
      title: createDefaultTitle(style),
      xAxis: {
        visible: true,
        title: { text: '', textStyle: textStyle, visible: true },
        min: null,
        max: null,
        gridLines: gridLines,
        labels: {
          numberFormat: DEFAULT_NUMBER_FORMAT,
          rotation: 0,
          textStyle: textStyle,
          tickCount: null,
          valueType: 'number',
        },
        line: axisLine,
      },
      yAxis: {
        visible: true,
        title: { text: '', textStyle: textStyle, visible: true },
        min: null,
        max: null,
        gridLines: gridLines,
        labels: {
          numberFormat: DEFAULT_NUMBER_FORMAT,
          rotation: 0,
          textStyle: textStyle,
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
          position: isRadialChart ? 'right' : 'bottom',
        },
        symbol: 'auto',
        textStyle: textStyle,
        overflow: 'auto',
        itemWidth: 24,
        itemHeight: 14,
        inactiveColor: createColorValue(style.colors.inactive),
      },
      labels: {
        numberFormat: DEFAULT_NUMBER_FORMAT,
        visible: isRadialChart,
        layout: {
          position: isRadialChart ? 'inside' : hasItemMarks ? 'right' : 'top',
        },
        textStyle: textStyle,
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
