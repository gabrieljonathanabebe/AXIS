import { useQuery } from '../shared/useQuery'
import { fetchFieldValues } from './tableApi'

import type { Query } from '../shared/useQuery'
import type { FieldValues } from './tableApi'

/** Loads the values of a field; keeps the old list while a search loads. */
export function useFieldValues(
  datasetId: string | null,
  fieldName: string,
  search: string,
): Query<FieldValues> {
  return useQuery({
    errorMessage: 'Values could not be loaded.',
    keepPreviousResult: true,
    load: (request) =>
      fetchFieldValues(request.datasetId, request.fieldName, request.search),
    request: datasetId ? { datasetId, fieldName, search } : null,
  })
}
