import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import SegmentedControl from '../../shared/ui/SegmentedControl'

import type { ChartInteractionSpec, LegendSelectionMode } from '../types'

// ===== TYPES =================================================================
type LegendInteractionWidgetProps = {
  value: ChartInteractionSpec['legend']
  onChange: (value: ChartInteractionSpec['legend']) => void
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
}: LegendInteractionWidgetProps) {
  return (
    <FormatWidget
      title="Interaction"
      visibility={{
        label: 'Enabled',
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({ ...value, enabled })
        },
      }}
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
    </FormatWidget>
  )
}

export default LegendInteractionWidget
