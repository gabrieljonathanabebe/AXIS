import {
  CircleDashed,
  Columns3,
  Copy,
  FileSpreadsheet,
  Rows3,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { groupFieldProfiles } from '../../data/fieldGroups'
import { formatNumber, formatPercent } from '../../data/formatNumber'
import { getSemanticRole } from '../../data/semanticRoles'
import CollapsibleSection from '../ui/CollapsibleSection'
import StatWidget from '../ui/StatWidget'
import FieldProfileWidget from './FieldProfileWidget'

import type {
  DatasetProfile,
  SemanticRole,
  SemanticRoleOverrides,
} from '../../types/chart'

// ===== TYPES =================================================================
type DatasetProfileViewProps = {
  profile: DatasetProfile
  semanticRoleOverrides: SemanticRoleOverrides
  onSemanticRoleChange: (fieldName: string, role: SemanticRole) => void
}

type DatasetStat = {
  hint?: string
  icon: ReactNode
  label: string
  share?: number
  value: number
}

// ===== HELPERS ===============================================================
function getShare(count: number, total: number): number {
  return total > 0 ? count / total : 0
}

function createDatasetStats(profile: DatasetProfile): DatasetStat[] {
  const cellCount = profile.row_count * profile.column_count
  const missingShare = getShare(profile.missing_count, cellCount)
  const duplicateShare = getShare(profile.duplicate_rows, profile.row_count)

  return [
    { icon: <Rows3 size={16} />, label: 'Rows', value: profile.row_count },
    {
      icon: <Columns3 size={16} />,
      label: 'Fields',
      value: profile.column_count,
    },
    {
      hint: `${formatPercent(missingShare)} of cells`,
      icon: <CircleDashed size={16} />,
      label: 'Missing cells',
      share: missingShare,
      value: profile.missing_count,
    },
    {
      hint: `${formatPercent(duplicateShare)} of rows`,
      icon: <Copy size={16} />,
      label: 'Duplicate rows',
      share: duplicateShare,
      value: profile.duplicate_rows,
    },
  ]
}

// ===== COMPONENT =============================================================
function DatasetProfileView({
  profile,
  semanticRoleOverrides,
  onSemanticRoleChange,
}: DatasetProfileViewProps) {
  const datasetStats = createDatasetStats(profile)
  const fieldGroups = groupFieldProfiles(profile.fields, semanticRoleOverrides)

  return (
    <div className="data-profile stack">
      <CollapsibleSection
        title="Dataset"
        icon={<FileSpreadsheet size={14} />}
        variant="plain"
      >
        <div className="data-profile-grid auto-grid">
          {datasetStats.map(({ value, ...stat }) => (
            <StatWidget
              {...stat}
              value={formatNumber(value)}
              key={stat.label}
            />
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Fields"
        icon={<Columns3 size={14} />}
        meta={profile.column_count}
        variant="plain"
      >
        {fieldGroups.map(({ icon: Icon, ...group }) => (
          <CollapsibleSection
            title={group.label}
            icon={<Icon size={14} />}
            meta={group.fields.length}
            defaultOpen={group.defaultOpen}
            variant="plain"
            key={group.key}
          >
            <div className="data-profile-grid auto-grid">
              {group.fields.map((field) => (
                <FieldProfileWidget
                  field={field}
                  rowCount={profile.row_count}
                  semanticRole={getSemanticRole(field, semanticRoleOverrides)}
                  onSemanticRoleChange={onSemanticRoleChange}
                  key={field.name}
                />
              ))}
            </div>
          </CollapsibleSection>
        ))}
      </CollapsibleSection>
    </div>
  )
}

export default DatasetProfileView
