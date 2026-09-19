import { ChartColumn, ChartLine, ChartScatter } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  Aggregation,
  ChartEncoding,
  ChartType,
  SemanticType,
} from '../types/chart'

export type EncodingKey = keyof ChartEncoding

export type CompatibilityLevel = 'recommended' | 'supported' | 'invalid'

export type InspectorSection = 'data' | 'appearance' | 'axes' | 'interaction'

export type EncodingDefinition = {
  key: EncodingKey
  label: string
  required: boolean
  recommendedTypes: SemanticType[]
  supportedTypes: SemanticType[]
}

export type ChartDefinition = {
  type: ChartType
  label: string
  icon: LucideIcon
  encodings: EncodingDefinition[]
  inspectorSections: InspectorSection[]
  defaultAggregation: Aggregation
  supportedAggregations: Aggregation[]
}

export const chartDefinitions = {
  scatter: {
    type: 'scatter',
    label: 'Scatter',
    icon: ChartScatter,
    defaultAggregation: 'none',
    supportedAggregations: ['none'],
    inspectorSections: ['data', 'appearance', 'axes', 'interaction'],
    encodings: [
      {
        key: 'x',
        label: 'X Axis',
        required: true,
        recommendedTypes: ['numeric'],
        supportedTypes: ['temporal'],
      },
      {
        key: 'y',
        label: 'Y Axis',
        required: true,
        recommendedTypes: ['numeric'],
        supportedTypes: [],
      },
      {
        key: 'color',
        label: 'Color',
        required: false,
        recommendedTypes: ['categorical'],
        supportedTypes: ['numeric'],
      },
      {
        key: 'size',
        label: 'Size',
        required: false,
        recommendedTypes: ['numeric'],
        supportedTypes: [],
      },
    ],
  },
  line: {
    type: 'line',
    label: 'Line',
    icon: ChartLine,
    defaultAggregation: 'sum',
    supportedAggregations: ['sum', 'mean', 'median', 'min', 'max', 'count'],
    inspectorSections: ['data', 'appearance', 'axes', 'interaction'],
    encodings: [
      {
        key: 'x',
        label: 'X Axis',
        required: true,
        recommendedTypes: ['temporal'],
        supportedTypes: ['categorical', 'numeric'],
      },
      {
        key: 'y',
        label: 'Y Axis',
        required: true,
        recommendedTypes: ['numeric'],
        supportedTypes: [],
      },
      {
        key: 'series',
        label: 'Series',
        required: false,
        recommendedTypes: ['categorical'],
        supportedTypes: [],
      },
    ],
  },
  bar: {
    type: 'bar',
    label: 'Bar',
    icon: ChartColumn,
    defaultAggregation: 'sum',
    supportedAggregations: ['sum', 'mean', 'median', 'min', 'max', 'count'],
    inspectorSections: ['data', 'appearance', 'axes', 'interaction'],
    encodings: [
      {
        key: 'x',
        label: 'Category',
        required: true,
        recommendedTypes: ['categorical'],
        supportedTypes: ['temporal'],
      },
      {
        key: 'y',
        label: 'Value',
        required: true,
        recommendedTypes: ['numeric'],
        supportedTypes: [],
      },
    ],
  },
} satisfies Record<ChartType, ChartDefinition>

export const chartDefinitionList = Object.values(chartDefinitions)

export function getChartDefinition(type: ChartType): ChartDefinition {
  return chartDefinitions[type]
}

export function getSemanticCompatibility(
  definition: ChartDefinition,
  encodingKey: EncodingKey,
  semanticType: SemanticType,
): CompatibilityLevel {
  const encoding = definition.encodings.find(({ key }) => {
    return key === encodingKey
  })

  if (!encoding) {
    return 'invalid'
  }

  if (encoding.recommendedTypes.includes(semanticType)) {
    return 'recommended'
  }

  if (encoding.supportedTypes.includes(semanticType)) {
    return 'supported'
  }

  return 'invalid'
}
