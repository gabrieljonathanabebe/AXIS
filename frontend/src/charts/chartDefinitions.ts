import {
  ChartColumn,
  ChartLine,
  ChartPie,
  ChartScatter,
  Donut,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Aggregation, ChartEncoding, ChartType } from './types'
import type { SemanticRole } from '../datasets/types'

// ===== TYPES =================================================================
export type EncodingKey = keyof ChartEncoding

export type CompatibilityLevel = 'recommended' | 'supported' | 'invalid'

export type InspectorSection = 'data' | 'appearance' | 'axes' | 'interaction'

export type EncodingDefinition = {
  key: EncodingKey
  label: string
  required: boolean
  recommendedRoles: SemanticRole[]
  supportedRoles: SemanticRole[]
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

// ===== CONSTANTS =============================================================
const radialEncodings = [
  {
    key: 'x',
    label: 'Category',
    recommendedRoles: ['dimension'],
    required: true,
    supportedRoles: ['temporal'],
  },
  {
    key: 'y',
    label: 'Value',
    recommendedRoles: ['measure'],
    required: true,
    supportedRoles: [],
  },
] satisfies EncodingDefinition[]

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
        recommendedRoles: ['measure'],
        supportedRoles: ['temporal'],
      },
      {
        key: 'y',
        label: 'Y Axis',
        required: true,
        recommendedRoles: ['measure'],
        supportedRoles: [],
      },
      {
        key: 'color',
        label: 'Color',
        required: false,
        recommendedRoles: ['dimension'],
        supportedRoles: ['measure'],
      },
      {
        key: 'size',
        label: 'Size',
        required: false,
        recommendedRoles: ['measure'],
        supportedRoles: [],
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
        recommendedRoles: ['temporal'],
        supportedRoles: ['dimension', 'measure'],
      },
      {
        key: 'y',
        label: 'Y Axis',
        required: true,
        recommendedRoles: ['measure'],
        supportedRoles: [],
      },
      {
        key: 'series',
        label: 'Series',
        required: false,
        recommendedRoles: ['dimension'],
        supportedRoles: [],
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
        recommendedRoles: ['dimension'],
        supportedRoles: ['temporal'],
      },
      {
        key: 'y',
        label: 'Value',
        required: true,
        recommendedRoles: ['measure'],
        supportedRoles: [],
      },
      {
        key: 'series',
        label: 'Series',
        required: false,
        recommendedRoles: ['dimension'],
        supportedRoles: [],
      },
      {
        key: 'color',
        label: 'Color',
        required: false,
        recommendedRoles: ['measure'],
        supportedRoles: [],
      },
    ],
  },
  pie: {
    defaultAggregation: 'sum',
    encodings: radialEncodings,
    icon: ChartPie,
    inspectorSections: ['data', 'appearance', 'interaction'],
    label: 'Pie',
    supportedAggregations: ['sum', 'mean', 'median', 'min', 'max', 'count'],
    type: 'pie',
  },
  donut: {
    defaultAggregation: 'sum',
    encodings: radialEncodings,
    icon: Donut,
    inspectorSections: ['data', 'appearance', 'interaction'],
    label: 'Donut',
    supportedAggregations: ['sum', 'mean', 'median', 'min', 'max', 'count'],
    type: 'donut',
  },
} satisfies Record<ChartType, ChartDefinition>

export const chartDefinitionList = Object.values(chartDefinitions)

// ===== FUNCTIONS =============================================================
export function getChartDefinition(type: ChartType): ChartDefinition {
  return chartDefinitions[type]
}

export function getSemanticCompatibility(
  definition: ChartDefinition,
  encodingKey: EncodingKey,
  semanticRole: SemanticRole,
): CompatibilityLevel {
  const encoding = definition.encodings.find(({ key }) => {
    return key === encodingKey
  })

  if (!encoding) {
    return 'invalid'
  }

  if (encoding.recommendedRoles.includes(semanticRole)) {
    return 'recommended'
  }

  if (encoding.supportedRoles.includes(semanticRole)) {
    return 'supported'
  }

  return 'invalid'
}
