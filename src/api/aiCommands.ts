import type {
  Aggregation,
  ChartEncoding,
  ChartType,
  DataField,
} from '../types/chart'
import { post } from './client'

export type AiChartContext = {
  aggregation: Aggregation
  encoding: ChartEncoding
  id: string
  title?: string
  type: ChartType
}

export type AiCommandRequest = {
  charts: AiChartContext[]
  fields: DataField[]
  prompt: string
}

export type AiCommandResult = {
  actions: unknown[] | null
  message: string | null
}

export function postAiCommand(
  request: AiCommandRequest,
): Promise<AiCommandResult> {
  return post<AiCommandResult>('/ai/commands', JSON.stringify(request), {
    'Content-Type': 'application/json',
  })
}
