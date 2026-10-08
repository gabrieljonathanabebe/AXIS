import { RotateCcw } from 'lucide-react'

import { createDistributionBars } from '../../data/fieldDistribution'
import { formatNumber } from '../../data/formatNumber'
import {
  getAllowedSemanticRoles,
  semanticRoleLabels,
} from '../../data/semanticRoles'
import IconButton from '../ui/IconButton'
import MiniHistogram from '../ui/MiniHistogram'
import SelectControl from '../ui/SelectControl'
import Widget from '../ui/Widget'

import type { FieldProfile, SemanticRole } from '../../types/chart'
import type { OptionItem } from '../ui/OptionsMenu'

// ===== TYPES =================================================================
type FieldProfileWidgetProps = {
  field: FieldProfile
  rowCount: number
  semanticRole: SemanticRole
  onSemanticRoleChange: (fieldName: string, role: SemanticRole) => void
}

// ===== HELPERS ===============================================================
function createFieldSummary(field: FieldProfile): string {
  const parts = [
    field.physical_type,
    `${formatNumber(field.unique_count)} unique`,
  ]

  if (field.missing_count > 0) {
    parts.push(`${formatNumber(field.missing_count)} missing`)
  }
  return parts.join(' · ')
}

function createSemanticRoleOptions(
  field: FieldProfile,
): OptionItem<SemanticRole>[] {
  return getAllowedSemanticRoles(field).map((role) => ({
    label: semanticRoleLabels[role],
    value: role,
  }))
}

// ===== COMPONENT =============================================================
function FieldProfileWidget({
  field,
  rowCount,
  semanticRole,
  onSemanticRoleChange,
}: FieldProfileWidgetProps) {
  const bars = createDistributionBars(field, rowCount)
  const roleOptions = createSemanticRoleOptions(field)
  const isOverridden = semanticRole !== field.semantic_role
  const detectedLabel = semanticRoleLabels[field.semantic_role]

  return (
    <Widget className="stat-widget field-profile">
      <div className="field-profile-text stack">
        <strong className="field-profile-name" title={field.name}>
          {field.name}
        </strong>
        <span className="stat-widget-hint">{createFieldSummary(field)}</span>
      </div>
      <div className="field-profile-role cluster">
        <SelectControl
          disabled={roleOptions.length < 2}
          label={`Semantic role of ${field.name}`}
          options={roleOptions}
          value={semanticRole}
          onChange={(role) => {
            onSemanticRoleChange(field.name, role)
          }}
        />
        {isOverridden ? (
          <IconButton
            label={`Reset to detected role (${detectedLabel})`}
            size="xs"
            variant="ghost"
            onClick={() => {
              onSemanticRoleChange(field.name, field.semantic_role)
            }}
          >
            <RotateCcw size={12} />
          </IconButton>
        ) : null}
      </div>
      {bars.length > 0 ? (
        <MiniHistogram bars={bars} label={`Distribution of ${field.name}`} />
      ) : null}
    </Widget>
  )
}

export default FieldProfileWidget
