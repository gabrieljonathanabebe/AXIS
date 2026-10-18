import { ListChecks } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import InspectorWidget from '../InspectorWidget'

import type { InspectorWidgetVariant } from '../InspectorWidget'
import type {
  ChartInteractionSpec,
  LegendSelectionMode,
} from '../../charts/types'
// ===== TYPES =================================================================
type LegendInteractionWidgetProps = {
  value: ChartInteractionSpec['legend']
  onChange: (value: ChartInteractionSpec['legend']) => void
  variant?: InspectorWidgetVariant
}

// ===== GLOBAL CONSTANTS ======================================================
const selectionModeOptions = [
  { label: 'Multiple', value: 'multiple' },
  { label: 'Single', value: 'single' },
] satisfies {
  label: string
  value: LegendSelectionMode
}[]

// ===== COMPONENT =============================================================
/** Edits whether legend clicks select series, one or several at a time. */
function LegendInteractionWidget({
  value,
  onChange,
  variant,
}: LegendInteractionWidgetProps) {
  return (
    <InspectorWidget
      title="Interaction"
      icon={<ListChecks size={16} />}
      visibility={{
        label: 'Enabled',
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({ ...value, enabled })
        },
      }}
      variant={variant}
    >
      <ControlRow label="Selection">
        <SegmentedControl
          label="Legend selection mode"
          options={selectionModeOptions}
          value={value.selectionMode}
          onValueChange={(selectionMode) => {
            onChange({ ...value, selectionMode })
          }}
        />
      </ControlRow>
    </InspectorWidget>
  )
}

export default LegendInteractionWidget
