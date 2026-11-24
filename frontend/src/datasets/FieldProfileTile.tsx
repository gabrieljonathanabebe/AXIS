import { RotateCcw } from 'lucide-react'

import { formatNumber } from '@/shared/format/formatNumber'
import SelectControl from '@/shared/ui/controls/SelectControl'
import MiniHistogram from '@/shared/ui/MiniHistogram'
import IconButton from '@/shared/ui/primitives/IconButton'
import Tile from '@/shared/ui/tiles/Tile'
import { createDistributionBars } from './fieldDistribution'
import { getAllowedSemanticRoles, semanticRoleLabels } from './semanticRoles'

import type { OptionItem } from '@/shared/ui/primitives/OptionsMenu'
import type { FieldProfile, SemanticRole } from './types'

// ===== TYPES =================================================================
type FieldProfileTileProps = {
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
function FieldProfileTile({
  field,
  rowCount,
  semanticRole,
  onSemanticRoleChange,
}: FieldProfileTileProps) {
  const bars = createDistributionBars(field, rowCount)
  const roleOptions = createSemanticRoleOptions(field)
  const isOverridden = semanticRole !== field.semantic_role
  const detectedLabel = semanticRoleLabels[field.semantic_role]

  return (
    <Tile className="stat-tile field-profile">
      <div className="field-profile-text stack">
        <strong className="field-profile-name" title={field.name}>
          {field.name}
        </strong>
        <span className="stat-tile-hint">{createFieldSummary(field)}</span>
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
    </Tile>
  )
}

export default FieldProfileTile
