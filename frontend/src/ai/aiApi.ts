import { postJson } from '../shared/api/client'

import type { Aggregation, ChartEncoding, ChartType } from '../charts/types'
import type { DataField, SemanticRole } from '../datasets/types'

export type AiChartContext = {
  aggregation: Aggregation
  encoding: ChartEncoding
  id: string
  title?: string
  type: ChartType
}

export type AiChartRule = {
  encodings: AiEncodingRule[]
  supported_aggregations: Aggregation[]
  type: ChartType
}

export type AiCommandRequest = {
  chart_rules: AiChartRule[]
  charts: AiChartContext[]
  fields: DataField[]
  prompt: string
}

export type AiCommandResult = {
  actions: unknown[] | null
  message: string | null
}

export type AiEncodingRule = {
  key: keyof ChartEncoding
  recommended_roles: SemanticRole[]
  required: boolean
  supported_roles: SemanticRole[]
}

export function postAiCommand(
  datasetId: string,
  request: AiCommandRequest,
): Promise<AiCommandResult> {
  return postJson<AiCommandResult>(
    `/datasets/${datasetId}/ai-commands`,
    request,
  )
}
