import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useState } from 'react'

import DataTableColumnHeader from './DataTableColumnHeader'
import DataTableToolbar from './DataTableToolbar'
import { formatNumber } from '../shared/format/formatNumber'
import { getSemanticRole } from '../datasets/semanticRoles'
import { setFieldFilter } from './tableFilters'
import { useTableRows } from './useTableRows'
import EmptyState from '../shared/ui/EmptyState'

import type { UIEvent } from 'react'
import type { TableFilter } from './tableApi'
import type { TableRows } from './useTableRows'
import type {
  DataField,
  Dataset,
  DatasetProfile,
  FieldProfile,
  SemanticRoleOverrides,
} from '../datasets/types'
import type { SemanticRole } from '../datasets/types'
import type { SortDirection, TableSort } from './types'

// ===== TYPES =================================================================
type DataTableProps = {
  dataset: Dataset
  datasetId: string | null
  profile: DatasetProfile | null
  semanticRoleOverrides: SemanticRoleOverrides
}

type DataTableColumn = {
  field: DataField
  profileField: FieldProfile | null
  semanticRole: SemanticRole | null
}

type DataTableStatus = {
  description: string
  title: string
}

// ===== CONSTANTS =============================================================
const ariaSortByDirection = {
  asc: 'ascending',
  desc: 'descending',
} as const satisfies Record<SortDirection, string>

const ESTIMATED_ROW_HEIGHT = 33

// Distance in pixels to the end of the loaded rows that loads the next page.
const LOAD_MORE_THRESHOLD = 600

// Also covers the sticky header, which the virtualizer does not know about.
const ROW_OVERSCAN = 12

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

function getTableStatus(
  { error, isLoading, rows }: TableRows,
  hasFilters: boolean,
): DataTableStatus | null {
  if (rows.length > 0) {
    return null
  }
  if (error) {
    return { description: error, title: 'Rows unavailable' }
  }
  if (isLoading) {
    return { description: 'Loading rows…', title: 'Loading' }
  }
  if (hasFilters) {
    return {
      description: 'No rows match the active filters.',
      title: 'No matching rows',
    }
  }
  return { description: 'This dataset has no rows.', title: 'No rows' }
}

// ===== COMPONENT =============================================================
function DataTable({
  dataset,
  datasetId,
  profile,
  semanticRoleOverrides,
}: DataTableProps) {
  const columns = createColumns(dataset, profile, semanticRoleOverrides)
  const rowCount = profile?.row_count ?? 0
  const [sort, setSort] = useState<TableSort | null>(null)
  const [filters, setFilters] = useState<TableFilter[]>([])
  const tableRows = useTableRows(datasetId, sort, filters)
  const status = getTableStatus(tableRows, filters.length > 0)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const virtualizer = useVirtualizer({
    count: tableRows.rows.length,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    getScrollElement: () => scrollRef.current,
    overscan: ROW_OVERSCAN,
  })
  const virtualRows = virtualizer.getVirtualItems()
  const paddingTop = virtualRows[0]?.start ?? 0
  const paddingBottom =
    virtualizer.getTotalSize() - (virtualRows.at(-1)?.end ?? 0)

  // A new query starts at the top of the result.
  function scrollToTop(): void {
    scrollRef.current?.scrollTo({ top: 0 })
  }

  function changeFilters(nextFilters: TableFilter[]): void {
    setFilters(nextFilters)
    scrollToTop()
  }

  function changeSort(fieldName: string): void {
    setSort(getNextSort(sort, fieldName))
    scrollToTop()
  }

  function handleScroll(event: UIEvent<HTMLDivElement>): void {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget
    if (scrollHeight - scrollTop - clientHeight < LOAD_MORE_THRESHOLD) {
      tableRows.loadMore()
    }
  }

  function renderSpacer(height: number) {
    if (height <= 0) {
      return null
    }
    return (
      <tr aria-hidden="true" className="data-table-spacer">
        <td colSpan={columns.length + 1} style={{ height }} />
      </tr>
    )
  }

  return (
    <div className="data-table-view">
      <DataTableToolbar
        datasetRowCount={profile?.row_count ?? null}
        filters={filters}
        matchingRowCount={tableRows.totalCount}
        onClearFilters={() => {
          changeFilters([])
        }}
        onRemoveFilter={(fieldName) => {
          changeFilters(setFieldFilter(filters, fieldName, null))
        }}
      />
      <div
        className={`data-table ${tableRows.isLoading ? 'is-loading' : ''}`}
        ref={scrollRef}
        onScroll={handleScroll}
      >
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
                      datasetId={datasetId}
                      filter={
                        filters.find((filter) => filter.field === name) ?? null
                      }
                      onFilterChange={(filter) => {
                        changeFilters(setFieldFilter(filters, name, filter))
                      }}
                      rowCount={rowCount}
                      sortDirection={sortDirection}
                      onSort={() => {
                        changeSort(name)
                      }}
                    />
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {renderSpacer(paddingTop)}
            {virtualRows.map((virtualRow) => {
              const row = tableRows.rows[virtualRow.index]
              return (
                <tr
                  data-index={virtualRow.index}
                  key={virtualRow.key}
                  ref={virtualizer.measureElement}
                >
                  <td className="data-table-index">{virtualRow.index + 1}</td>
                  {columns.map(({ field, semanticRole }) => {
                    const value = row[field.name]
                    return (
                      <td
                        className={
                          semanticRole === 'measure' ? 'is-numeric' : ''
                        }
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
              )
            })}
            {renderSpacer(paddingBottom)}
          </tbody>
        </table>
        {status ? <EmptyState {...status} /> : null}
      </div>
    </div>
  )
}

export default DataTable
