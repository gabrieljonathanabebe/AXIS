import { DEFAULT_CATEGORICAL_PALETTE } from './colorPalettes'
import { getChartDefinition } from './chartDefinitions'
import { getDefaultEncoding } from './getDefaultEncoding'
import type {
  ChartInstance,
  ChartSpec,
  ChartType,
  Dataset,
} from '../types/chart'

type CreateChartInstanceParams = {
  type: ChartType
  dataset: Dataset
  id?: string
}

export function createDefaultChartSpec(
  type: ChartType,
  dataset: Dataset,
): ChartSpec {
  const definition = getChartDefinition(type)
  return {
    data: {
      encoding: getDefaultEncoding(type, dataset),
      aggregation: definition.defaultAggregation,
    },
    appearance: {
      color: '#1E90FF',
      colorScale: {
        categorical: {
          palette: [...DEFAULT_CATEGORICAL_PALETTE],
        },
        continuous: {
          startColor: '#BFE3FF',
          endColor: '#1E90FF',
        },
      },
      grid: {
        enabled: true,
        color: '#334155',
        opacity: 0.08,
        lineStyle: 'solid',
      },
      title: {
        enabled: false,
        text: '',
        alignment: 'left',
      },
      xAxis: {
        enabled: true,
        title: '',
        min: null,
        max: null,
        format: 'auto',
        currency: 'EUR',
      },
      yAxis: {
        enabled: true,
        title: '',
        min: null,
        max: null,
        format: 'auto',
        currency: 'EUR',
      },
      labels: {
        enabled: false,
        position: type === 'scatter' ? 'right' : 'top',
        color: '#eef4ff',
        fontSize: 12,
        fontWeight: 'medium',
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
        smooth: false,
        showSymbol: true,
      },
      bar: {
        borderRadius: 4,
        barWidth: 24,
      },
    },
    interaction: {
      tooltip: {
        enabled: true,
        trigger: type === 'scatter' ? 'item' : 'axis',
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

export function createChartInstance({
  type,
  dataset,
  id = crypto.randomUUID(),
}: CreateChartInstanceParams): ChartInstance {
  return {
    id,
    type,
    spec: createDefaultChartSpec(type, dataset),
    layout: {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    },
  }
}
