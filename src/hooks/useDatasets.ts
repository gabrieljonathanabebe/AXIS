import { useState } from 'react'
import {
  fetchDatasetRows,
  uploadDataset,
} from '../api/datasets'
import type {
  DatasetRows,
  DatasetSummary,
} from '../api/datasets'
import type { Dataset } from '../types/chart'


type useDatasetsResults = {
  activeDatasetSummary: DatasetSummary | null
  dataset: Dataset | null
  isUploading: boolean
  uploadError: string | null
  uploadFile: (file: File) => Promise<void>
}

export function useDatasets(): useDatasetsResults {
  const [activeDatasetSummary, setActiveDatasetSummary] =
    useState<DatasetSummary | null>(null)
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function uploadFile(file: File): Promise<void> {
    setIsUploading(true)
    setUploadError(null)
    try {
      const summary = await uploadDataset(file)
      const rowsResponse = await fetchDatasetRows(summary.id)
      setActiveDatasetSummary(summary)
      setDataset(toDataset(summary, rowsResponse))
    } catch {
      setUploadError('Failed to upload dataset.')
    } finally {
      setIsUploading(false)
    }
  }

  return {
    activeDatasetSummary,
    dataset,
    isUploading,
    uploadError,
    uploadFile,
  }
}

function toDataset(
  summary: DatasetSummary,
  rowsResponse: DatasetRows
): Dataset {
  return {
    fields: summary.fields,
    rows: rowsResponse.rows,
  }
}