import { useMemo, useState } from 'react'

import DataTableColumnHeader from './DataTableColumnHeader'
import { formatNumber } from '../../data/formatNumber'
import { getSemanticRole } from '../../data/semanticRoles'
import { sortRows } from '../../data/sortRows'

import type {
  DataField,
  Dataset,
  DatasetProfile,
  FieldProfile,
  SemanticRole,
  SemanticRoleOverrides,
} from '../../types/chart'
import type { SortDirection, TableSort } from '../../types/ui'

// ===== TYPES =================================================================
type DataTableProps = {
  dataset: Dataset
  profile: DatasetProfile | null
  semanticRoleOverrides: SemanticRoleOverrides
}

type DataTableColumn = {
  field: DataField
  profileField: FieldProfile | null
  semanticRole: SemanticRole | null
}

// ===== CONSTANTS =============================================================
const ariaSortByDirection = {
  asc: 'ascending',
  desc: 'descending',
} as const satisfies Record<SortDirection, string>

// ===== HELPERS ===============================================================
function createColumns(
  dataset: Dataset,
  profile: DatasetProfile | null,
  overrides: SemanticRoleOverrides,
): DataTableColumn[] {
  const profileFieldsByName = new Map(
    profile?.fields.map((field) => [field.name, field]),
  )

  return dataset.fields.map((field) => {
    const profileField = profileFieldsByName.get(field.name) ?? null
    return {
      field,
      profileField,
      semanticRole: profileField
        ? getSemanticRole(profileField, overrides)
        : null,
    }
  })
}

function formatCellValue(value: number | string): string {
  return typeof value === 'number' ? formatNumber(value) : value
}

// Cycles ascending → descending → unsorted.
function getNextSort(
  sort: TableSort | null,
  fieldName: string,
): TableSort | null {
  if (sort?.fieldName !== fieldName) {
    return { direction: 'asc', fieldName }
  }
  return sort.direction === 'asc' ? { direction: 'desc', fieldName } : null
}

// ===== COMPONENT =============================================================
function DataTable({
  dataset,
  profile,
  semanticRoleOverrides,
}: DataTableProps) {
  const columns = createColumns(dataset, profile, semanticRoleOverrides)
  const rowCount = profile?.row_count ?? dataset.rows.length
  const [sort, setSort] = useState<TableSort | null>(null)
  const rows = useMemo(() => sortRows(dataset.rows, sort), [dataset.rows, sort])

  return (
    <div className="data-table">
      <table className="data-table-grid">
        <thead>
          <tr>
            <th className="data-table-index" scope="col">
              #
            </th>
            {columns.map((column) => {
              const { name } = column.field
              const sortDirection =
                sort?.fieldName === name ? sort.direction : null
              return (
                <th
                  aria-sort={
                    sortDirection
                      ? ariaSortByDirection[sortDirection]
                      : undefined
                  }
                  scope="col"
                  key={name}
                >
                  <DataTableColumnHeader
                    {...column}
                    rowCount={rowCount}
                    sortDirection={sortDirection}
                    onSort={() => {
                      setSort(getNextSort(sort, name))
                    }}
                  />
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="data-table-index">{rowIndex + 1}</td>
              {columns.map(({ field, semanticRole }) => {
                const value = row[field.name]
                return (
                  <td
                    className={semanticRole === 'measure' ? 'is-numeric' : ''}
                    key={field.name}
                  >
                    {value === null ? (
                      <span className="data-table-missing">—</span>
                    ) : (
                      formatCellValue(value)
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
