import type { DataField, DatasetProfile, ValueCount } from '../types/chart'
import { get, post } from './client'

export const DEMO_DATASET_ID = 'demo'

export type DatasetSummary = {
  id: string
  name: string
  row_count: number
  fields: DataField[]
}

export type FieldValues = {
  field: string
  total_count: number
  values: ValueCount[]
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

export function fetchFieldValues(
  datasetId: string,
  fieldName: string,
  search: string,
): Promise<FieldValues> {
  const field = encodeURIComponent(fieldName)
  return get<FieldValues>(`/datasets/${datasetId}/fields/${field}/values`, {
    search,
  })
}
