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
      color: '#1e90ff',
      showGrid: true,
      scatter: {
        pointSize: 10,
        opacity: 0.9,
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
      },
      animation: {
        enabled: true,
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
