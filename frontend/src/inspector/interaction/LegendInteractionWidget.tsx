import { ListChecks } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import InspectorWidget from '../InspectorWidget'

import type {
  ChartInteractionSpec,
  LegendSelectionMode,
} from '../../charts/types'
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
function LegendInteractionWidget({
  value,
  onChange,
}: LegendInteractionWidgetProps) {
  // ===== RETURN ==============================================================
  return (
    <InspectorWidget
      title="Legend Interaction"
      icon={<ListChecks size={16} />}
      visibility={{
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
    </InspectorWidget>
  )
}

export default LegendInteractionWidget
