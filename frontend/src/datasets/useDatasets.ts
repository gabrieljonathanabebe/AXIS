import { useEffect, useMemo, useState } from 'react'

import { applySemanticRoleOverrides } from './semanticRoles'
import {
  DEMO_DATASET_ID,
  fetchDatasetProfile,
  fetchDatasetSummary,
  uploadDataset,
} from './datasetsApi'
import type { DatasetSummary } from './datasetsApi'
import type { Dataset, DatasetProfile, SemanticRoleOverrides } from './types'
import type { SemanticRole } from './types'

// ===== TYPES =================================================================
type useDatasetsResults = {
  activeDatasetSummary: DatasetSummary | null
  dataset: Dataset | null
  datasetError: string | null
  isLoading: boolean
  profile: DatasetProfile | null
  semanticRoleOverrides: SemanticRoleOverrides
  setSemanticRole: (fieldName: string, role: SemanticRole) => void
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
  const [semanticRoleOverrides, setSemanticRoleOverrides] =
    useState<SemanticRoleOverrides>({})

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
      setSemanticRoleOverrides({})
    } catch {
      setDatasetError('Failed to upload dataset.')
    } finally {
      setIsLoading(false)
    }
  }

  function setSemanticRole(fieldName: string, role: SemanticRole): void {
    const field = loadedDataset?.profile.fields.find(
      (profileField) => profileField.name === fieldName,
    )
    if (!field) {
      return
    }
    setSemanticRoleOverrides((currentOverrides) => {
      const nextOverrides = { ...currentOverrides }
      if (role === field.semantic_role) {
        delete nextOverrides[fieldName]
      } else {
        nextOverrides[fieldName] = role
      }
      return nextOverrides
    })
  }

  const dataset = useMemo(() => {
    if (!loadedDataset) {
      return null
    }
    return {
      ...loadedDataset.dataset,
      fields: applySemanticRoleOverrides(
        loadedDataset.dataset.fields,
        semanticRoleOverrides,
      ),
    }
  }, [loadedDataset, semanticRoleOverrides])

  return {
    activeDatasetSummary: loadedDataset?.summary ?? null,
    dataset,
    datasetError,
    isLoading,
    profile: loadedDataset?.profile ?? null,
    semanticRoleOverrides,
    setSemanticRole,
    uploadFile,
  }
}

// ===== HELPERS ===============================================================
async function loadDataset(summary: DatasetSummary): Promise<LoadedDataset> {
  const profile = await fetchDatasetProfile(summary.id)
  return { dataset: { fields: summary.fields }, profile, summary }
}
