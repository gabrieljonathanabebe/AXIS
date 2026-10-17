import { DEFAULT_CATEGORICAL_PALETTE } from './colorPalettes'
import type { ChartInstance, ChartSpec, ChartType } from './types'
import type { ObjectContainer, ObjectLayout } from '../objects/types'
import type { TextStyle } from '../shared/textStyle'
import {
  getChartDefinition,
  isPointsChartType,
  isRadialChartType,
} from './chartDefinitions'

/** Default look of the texts drawn by ECharts: axes, legend, labels. */
const CHART_TEXT_STYLE: TextStyle = {
  color: '#eef4ff',
  fontSize: 12,
  fontStyle: 'normal',
  fontWeight: 'medium',
}

type CreateChartInstanceParams = {
  type: ChartType
  layout: ObjectLayout
  id?: string
}

export function createDefaultChartContainer(): ObjectContainer {
  return {
    background: { kind: 'surface' },
    padding: 4,
    borderRadius: 24,
  }
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
      color: '#199E8A',
      colorScale: {
        categorical: {
          palette: [...DEFAULT_CATEGORICAL_PALETTE],
        },
        continuous: {
          startColor: '#fe0314',
          endColor: '#00fa2e',
          visible: true,
          position: 'right',
          orientation: 'vertical',
          min: null,
          max: null,
          labels: true,
        },
      },
      grid: {
        visible: true,
        color: '#334155',
        opacity: 0.08,
        lineStyle: 'solid',
      },
      title: {
        visible: true,
        text: '',
        alignment: 'start',
        textStyle: {
          color: '#eef4ff',
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 'medium',
        },
      },
      xAxis: {
        visible: true,
        title: '',
        min: null,
        max: null,
        format: 'auto',
        currency: 'EUR',
        labels: {
          rotation: 0,
          textStyle: CHART_TEXT_STYLE,
          tickCount: null,
        },
        titleStyle: CHART_TEXT_STYLE,
      },
      yAxis: {
        visible: true,
        title: '',
        min: null,
        max: null,
        format: 'auto',
        currency: 'EUR',
        labels: {
          rotation: 0,
          textStyle: CHART_TEXT_STYLE,
          tickCount: null,
        },
        titleStyle: CHART_TEXT_STYLE,
      },
      legend: {
        visible: true,
        position: isRadialChart ? 'right' : 'bottom',
        alignment: 'center',
        symbol: 'auto',
        textStyle: CHART_TEXT_STYLE,
        gap: 8,
        layout: 'auto',
        itemWidth: 24,
        itemHeight: 14,
        padding: 8,
        inactiveColor: '#8b95a7',
      },
      labels: {
        visible: isRadialChart,
        position: isRadialChart ? 'inside' : hasItemMarks ? 'right' : 'top',
        textStyle: CHART_TEXT_STYLE,
      },
      scatter: {
        pointSize: 10,
        sizeRange: {
          min: 6,
          max: 28,
        },
        opacity: 0.9,
        symbol: 'circle',
      },
      line: {
        lineWidth: 3,
        lineStyle: 'solid',
        smooth: false,
        showSymbol: true,
        areaFill: false,
        areaColor: '#199E8A',
        areaOpacity: 0.25,
      },
      bar: {
        borderRadius: 4,
        barWidth: 24,
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
        valueFormat: 'auto',
        delay: 0,
      },
      zoom: {
        enabled: false,
        inside: true,
        slider: false,
      },
      animation: {
        enabled: true,
        duration: 500,
        easing: 'cubicOut',
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
    container: createDefaultChartContainer(),
  }
}
