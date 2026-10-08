import { ListFilter, Rows3, X } from 'lucide-react'

import { formatNumber } from '../shared/format/formatNumber'
import { formatTableFilter } from './tableFilters'
import Button from '../shared/ui/Button'
import Chip from '../shared/ui/Chip'

import type { TableFilter } from './tableApi'

// ===== TYPES =================================================================
type DataTableToolbarProps = {
  datasetRowCount: number | null
  filters: TableFilter[]
  matchingRowCount: number | null
  onClearFilters: () => void
  onRemoveFilter: (fieldName: string) => void
}

// ===== COMPONENT =============================================================
function DataTableToolbar({
  datasetRowCount,
  filters,
  matchingRowCount,
  onClearFilters,
  onRemoveFilter,
}: DataTableToolbarProps) {
  const hasFilters = filters.length > 0

  return (
    <div
      className={`data-table-toolbar cluster ${hasFilters ? 'is-filtering' : ''}`}
    >
      <span className="data-table-count inline-cluster">
        <Rows3 size={14} />
        {matchingRowCount === null ? null : (
          <span>
            <strong>{formatNumber(matchingRowCount)}</strong>
            {hasFilters && datasetRowCount !== null
              ? ` of ${formatNumber(datasetRowCount)}`
              : ''}{' '}
            rows
          </span>
        )}
      </span>
      {filters.map((filter) => {
        const label = formatTableFilter(filter)
        return (
          <Chip
            aria-label={`Remove filter ${label}`}
            isActive
            className="data-filter-chip inline-cluster"
            title="Remove filter"
            key={filter.field}
            onClick={() => {
              onRemoveFilter(filter.field)
            }}
          >
            <span className="data-filter-chip-label">{label}</span>
            <X size={12} />
          </Chip>
        )
      })}
      {hasFilters ? (
        <Button className="data-filter-clear-all" onClick={onClearFilters}>
          Clear all
        </Button>
      ) : (
        <span className="data-table-hint inline-cluster">
          <ListFilter size={12} />
          Filter from a column header
        </span>
      )}
    </div>
  )
}

export default DataTableToolbar
