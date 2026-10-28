import { ListChecks, MousePointerBan, SquareCheck } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import SegmentedControl from '../../shared/ui/SegmentedControl'

import type { OptionItem } from '../../shared/ui/OptionsMenu'
import type { ChartInteractionSpec, LegendSelectionMode } from '../types'

// ===== TYPES =================================================================
type LegendInteractionWidgetProps = {
  value: ChartInteractionSpec['legend']
  onChange: (value: ChartInteractionSpec['legend']) => void
}

/** What a click on a legend entry does; off turns the selection off. */
type SelectionChoice = LegendSelectionMode | 'off'

// ===== GLOBAL CONSTANTS ======================================================
const selectionChoiceOptions = [
  { icon: MousePointerBan, label: 'Off', value: 'off' },
  { icon: ListChecks, label: 'Multiple', value: 'multiple' },
  { icon: SquareCheck, label: 'Single', value: 'single' },
] satisfies OptionItem<SelectionChoice>[]

// ===== COMPONENT =============================================================
/**
 * Interaction group of the legend: what a click on a legend entry does,
 * nothing or select one or several series, the three click modes of
 * ECharts. Off keeps the stored selection mode.
 */
function LegendInteractionWidget({
  value,
  onChange,
}: LegendInteractionWidgetProps) {
  return (
    <FormatWidget title="Interaction">
      <ControlRow>
        <SegmentedControl
          label="Legend click selection"
          options={selectionChoiceOptions}
          value={value.enabled ? value.selectionMode : 'off'}
          onValueChange={(choice) => {
            onChange(
              choice === 'off'
                ? { ...value, enabled: false }
                : { enabled: true, selectionMode: choice },
            )
          }}
        />
      </ControlRow>
    </FormatWidget>
  )
}

export default LegendInteractionWidget
