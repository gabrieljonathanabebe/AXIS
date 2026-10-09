import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { createDistributionBars } from '../datasets/fieldDistribution'
import DataTableFilterPopover from './DataTableFilterPopover'
import { getFieldGroupDefinition } from '../datasets/fieldGroups'
import { semanticRoleLabels } from '../datasets/semanticRoles'
import IconBadge from '../shared/ui/IconBadge'
import MiniHistogram from '../shared/ui/MiniHistogram'

import type { DataField, FieldProfile } from '../datasets/types'
import type { SemanticRole } from '../datasets/types'
import type { TableFilter } from './tableApi'
import type { HistogramBar } from '../shared/ui/MiniHistogram'
import type { SortDirection } from './types'

// ===== TYPES =================================================================
type DataTableColumnHeaderProps = {
  datasetId: string | null
  field: DataField
  filter: TableFilter | null
  profileField: FieldProfile | null
  rowCount: number
  semanticRole: SemanticRole | null
  sortDirection: SortDirection | null
  onFilterChange: (filter: TableFilter | null) => void
  onSort: () => void
}

// ===== CONSTANTS =============================================================
const sortIconByDirection: Record<SortDirection, LucideIcon> = {
  asc: ArrowUp,
  desc: ArrowDown,
}

const ariaSortByDirection = {
  asc: 'ascending',
  desc: 'descending',
} as const satisfies Record<SortDirection, string>

// ===== HELPERS ===============================================================
// Statistics follow the detected role; after an override they no longer fit.
function createColumnBars(
  profileField: FieldProfile | null,
  semanticRole: SemanticRole | null,
  rowCount: number,
): HistogramBar[] {
  if (!profileField || profileField.statistics?.kind !== semanticRole) {
    return []
  }
  return createDistributionBars(profileField, rowCount)
}

// ===== COMPONENT =============================================================
function DataTableColumnHeader({
  datasetId,
  field,
  filter,
  profileField,
  rowCount,
  semanticRole,
  sortDirection,
  onFilterChange,
  onSort,
}: DataTableColumnHeaderProps) {
  const Icon = semanticRole ? getFieldGroupDefinition(semanticRole).icon : null
  const SortIcon = sortDirection
    ? sortIconByDirection[sortDirection]
    : ArrowUpDown
  const bars = createColumnBars(profileField, semanticRole, rowCount)
  const roleLabel = semanticRole ? semanticRoleLabels[semanticRole] : null

  return (
    <th
      aria-sort={sortDirection ? ariaSortByDirection[sortDirection] : undefined}
      scope="col"
    >
      <div
        className="data-column-header stack"
        title={roleLabel ? `${field.name} · ${roleLabel}` : field.name}
      >
        <div className="data-column-title cluster">
          <button
            className={`data-column-sort spread ${sortDirection ? 'is-sorted' : ''}`}
            type="button"
            onClick={onSort}
          >
            <IconBadge label={field.name}>
              {Icon ? <Icon size={14} /> : null}
            </IconBadge>
            <SortIcon className="data-column-sort-icon" size={12} />
          </button>
          <DataTableFilterPopover
            datasetId={datasetId}
            fieldName={field.name}
            filter={filter}
            profileField={profileField}
            semanticRole={semanticRole}
            onFilterChange={onFilterChange}
          />
        </div>
        <span className="data-column-type">
          {profileField?.physical_type ?? field.physical_type}
        </span>
        <div className="data-column-distribution">
          {bars.length > 0 ? (
            <MiniHistogram
              bars={bars}
              label={`Distribution of ${field.name}`}
            />
          ) : null}
        </div>
      </div>
    </th>
  )
}

export default DataTableColumnHeader
