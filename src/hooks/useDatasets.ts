import { useEffect, useState } from 'react'
import {
  DEMO_DATASET_ID,
  fetchDatasetProfile,
  fetchDatasetRows,
  fetchDatasetSummary,
  uploadDataset,
} from '../api/datasets'
import type { DatasetRows, DatasetSummary } from '../api/datasets'
import type { Dataset, DatasetProfile } from '../types/chart'

// ===== TYPES =================================================================
type useDatasetsResults = {
  activeDatasetSummary: DatasetSummary | null
  dataset: Dataset | null
  datasetError: string | null
  isLoading: boolean
  profile: DatasetProfile | null
  uploadFile: (file: File) => Promise<void>
}

type LoadedDataset = {
  dataset: Dataset
  profile: DatasetProfile
  summary: DatasetSummary
}

// ===== FUNCTION ==============================================================
export function useDatasets(): useDatasetsResults {
  const [loadedDataset, setLoadedDataset] = useState<LoadedDataset | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [datasetError, setDatasetError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    fetchDatasetSummary(DEMO_DATASET_ID)
      .then(loadDataset)
      .then((result) => {
        if (!isCancelled) {
          setLoadedDataset(result)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setDatasetError('Failed to load demo dataset.')
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  async function uploadFile(file: File): Promise<void> {
    setIsLoading(true)
    setDatasetError(null)
    try {
      const summary = await uploadDataset(file)
      setLoadedDataset(await loadDataset(summary))
    } catch {
      setDatasetError('Failed to upload dataset.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    activeDatasetSummary: loadedDataset?.summary ?? null,
    dataset: loadedDataset?.dataset ?? null,
    datasetError,
    isLoading,
    profile: loadedDataset?.profile ?? null,
    uploadFile,
  }
}

// ===== HELPERS ===============================================================
async function loadDataset(summary: DatasetSummary): Promise<LoadedDataset> {
  const [rowsResponse, profile] = await Promise.all([
    fetchDatasetRows(summary.id),
    fetchDatasetProfile(summary.id),
  ])
  return { dataset: toDataset(summary, rowsResponse), profile, summary }
}

function toDataset(
  summary: DatasetSummary,
  rowsResponse: DatasetRows,
): Dataset {
  return {
    fields: summary.fields,
    rows: rowsResponse.rows,
  }
}
