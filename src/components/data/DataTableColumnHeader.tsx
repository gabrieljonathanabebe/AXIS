import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { createDistributionBars } from '../../data/fieldDistribution'
import DataTableFilterPopover from './DataTableFilterPopover'
import { getFieldGroupDefinition } from '../../data/fieldGroups'
import { semanticRoleLabels } from '../../data/semanticRoles'
import IconBadge from '../ui/IconBadge'
import MiniHistogram from '../ui/MiniHistogram'

import type { DataField, FieldProfile, SemanticRole } from '../../types/chart'
import type { TableFilter } from '../../api/tableQuery'
import type { HistogramBar, SortDirection } from '../../types/ui'

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
          <MiniHistogram bars={bars} label={`Distribution of ${field.name}`} />
        ) : null}
      </div>
    </div>
  )
}

export default DataTableColumnHeader
