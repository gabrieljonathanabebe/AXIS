import { createDistributionBars } from '../../data/fieldDistribution'
import { formatNumber } from '../../data/formatNumber'
import MiniHistogram from '../ui/MiniHistogram'
import Widget from '../ui/Widget'

import type { FieldProfile } from '../../types/chart'

// ===== TYPES =================================================================
type FieldProfileWidgetProps = {
  field: FieldProfile
  rowCount: number
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

// ===== COMPONENT =============================================================
function FieldProfileWidget({ field, rowCount }: FieldProfileWidgetProps) {
  const bars = createDistributionBars(field, rowCount)

  return (
    <Widget className="stat-widget field-profile">
      <div className="field-profile-text stack">
        <strong className="field-profile-name" title={field.name}>
          {field.name}
        </strong>
        <span className="stat-widget-hint">{createFieldSummary(field)}</span>
      </div>
      {bars.length > 0 ? (
        <MiniHistogram bars={bars} label={`Distribution of ${field.name}`} />
      ) : null}
    </Widget>
  )
}

export default FieldProfileWidget
