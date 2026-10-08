import type { DataField, DatasetProfile } from './types'
import { get, post } from '../shared/api/client'

export const DEMO_DATASET_ID = 'demo'

export type DatasetSummary = {
  id: string
  name: string
  row_count: number
  fields: DataField[]
}

export function uploadDataset(file: File): Promise<DatasetSummary> {
  const formData = new FormData()
  formData.append('file', file)
  return post<DatasetSummary>('/datasets', formData)
}

export function fetchDatasetSummary(
  datasetId: string,
): Promise<DatasetSummary> {
  return get<DatasetSummary>(`/datasets/${datasetId}`)
}

export function fetchDatasetProfile(
  datasetId: string,
): Promise<DatasetProfile> {
  return get<DatasetProfile>(`/datasets/${datasetId}/profile`)
}
