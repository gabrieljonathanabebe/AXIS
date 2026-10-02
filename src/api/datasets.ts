import type { DataField, DataRow, DatasetProfile } from '../types/chart'
import { get, post } from './client'

export const DEMO_DATASET_ID = 'demo'

export type DatasetSummary = {
  id: string
  name: string
  row_count: number
  fields: DataField[]
}

export type DatasetRows = {
  dataset_id: string
  offset: number
  limit: number
  rows: DataRow[]
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

export function fetchDatasetRows(
  datasetId: string,
  limit = 100,
): Promise<DatasetRows> {
  return get<DatasetRows>(`/datasets/${datasetId}/rows`, {
    offset: 0,
    limit,
  })
}

export function fetchDatasetProfile(
  datasetId: string,
): Promise<DatasetProfile> {
  return get<DatasetProfile>(`/datasets/${datasetId}/profile`)
}
