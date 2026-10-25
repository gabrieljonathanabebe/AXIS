import {
  createDefaultContainer,
  createDefaultTitle,
} from '../objects/objectDefaults'
import { DEFAULT_NUMBER_FORMAT } from '../shared/format/valueFormats'
import {
  getChartDefinition,
  isPointsChartType,
  isRadialChartType,
} from './chartDefinitions'
import { DEFAULT_CATEGORICAL_PALETTE } from './colorPalettes'

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
export const CHART_TEXT_STYLE: TextStyle = {
  color: { kind: 'token', token: 'text' },
  fontSize: 12,
  fontStyle: 'normal',
  fontWeight: 'medium',
}

/** Default gridlines; each axis draws its own. */
export const CHART_GRID_LINES: AxisStrokeAppearance = {
  stroke: {
    color: { kind: 'token', token: 'gridLine' },
    lineStyle: 'solid',
    opacity: 0.08,
    width: 1,
  },
  visible: true,
}

/** Default axis line; each axis draws its own. */
export const CHART_AXIS_LINE: AxisStrokeAppearance = {
  stroke: {
    color: { kind: 'token', token: 'border' },
    lineStyle: 'solid',
    opacity: 1,
    width: 1,
  },
  visible: true,
}

/** Default border of filled marks: bars, points and pie segments; off. */
export const CHART_MARK_BORDER: StrokeStyle = {
  color: { kind: 'token', token: 'border' },
  lineStyle: 'solid',
  opacity: 1,
  width: 0,
}

type CreateChartInstanceParams = {
  type: ChartType
  layout: ObjectLayout
  id?: string
}

export function createDefaultChartSpec(type: ChartType): ChartSpec {
  const definition = getChartDefinition(type)
  const isRadialChart = isRadialChartType(type)
  // Points and radial charts have no category axis; marks are single items.
  const hasItemMarks = isPointsChartType(type) || isRadialChart
  return {
    data: {
      encoding: {},
      aggregation: definition.defaultAggregation,
      colorAggregation: 'mean',
    },
    appearance: {
      color: { kind: 'token', token: 'chart1' },
      colorScale: {
        categorical: {
          palette: [...DEFAULT_CATEGORICAL_PALETTE],
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
      title: createDefaultTitle(),
      xAxis: {
        visible: true,
        title: { text: '', textStyle: CHART_TEXT_STYLE, visible: true },
        min: null,
        max: null,
        gridLines: CHART_GRID_LINES,
        labels: {
          numberFormat: DEFAULT_NUMBER_FORMAT,
          rotation: 0,
          textStyle: CHART_TEXT_STYLE,
          tickCount: null,
          valueType: 'number',
        },
        line: CHART_AXIS_LINE,
      },
      yAxis: {
        visible: true,
        title: { text: '', textStyle: CHART_TEXT_STYLE, visible: true },
        min: null,
        max: null,
        gridLines: CHART_GRID_LINES,
        labels: {
          numberFormat: DEFAULT_NUMBER_FORMAT,
          rotation: 0,
          textStyle: CHART_TEXT_STYLE,
          tickCount: null,
          valueType: 'number',
        },
        line: CHART_AXIS_LINE,
      },
      legend: {
        visible: true,
        layout: {
          alignment: 'center',
          gap: 8,
          position: isRadialChart ? 'right' : 'bottom',
        },
        symbol: 'auto',
        textStyle: CHART_TEXT_STYLE,
        overflow: 'auto',
        itemWidth: 24,
        itemHeight: 14,
        inactiveColor: { kind: 'token', token: 'inactive' },
      },
      labels: {
        numberFormat: DEFAULT_NUMBER_FORMAT,
        visible: isRadialChart,
        layout: {
          position: isRadialChart ? 'inside' : hasItemMarks ? 'right' : 'top',
        },
        textStyle: CHART_TEXT_STYLE,
      },
      scatter: {
        border: CHART_MARK_BORDER,
        effect: { kind: 'none' },
        pointSize: 10,
        sizeRange: {
          min: 6,
          max: 28,
        },
        fill: { kind: 'solid', opacity: 0.9 },
        symbol: 'circle',
      },
      line: {
        stroke: { lineStyle: 'solid', opacity: 1, width: 3 },
        smooth: false,
        points: 'auto',
        areaFill: false,
        area: {
          kind: 'solid',
          opacity: 0.25,
        },
        effect: { kind: 'none' },
      },
      bar: {
        border: CHART_MARK_BORDER,
        borderRadius: 4,
        barWidth: 24,
        effect: { kind: 'none' },
        fill: { kind: 'solid', opacity: 1 },
      },
      pie: {
        border: CHART_MARK_BORDER,
        effect: { kind: 'none' },
        fill: { kind: 'solid', opacity: 1 },
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

/** Creates a chart object with the default spec and container of its type. */
export function createChartInstance({
  type,
  layout,
  id = crypto.randomUUID(),
}: CreateChartInstanceParams): ChartInstance {
  return {
    id,
    kind: 'chart',
    type,
    spec: createDefaultChartSpec(type),
    layout,
    container: createDefaultContainer(),
  }
}
