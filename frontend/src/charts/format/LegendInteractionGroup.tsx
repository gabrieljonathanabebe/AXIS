import { ListChecks, MousePointerBan, SquareCheck } from 'lucide-react'

import SegmentedControl from '@/shared/ui/controls/SegmentedControl'
import Group from '@/shared/ui/groups/Group'
import Row from '@/shared/ui/rows/Row'

import type { ChartInteractionSpec, LegendSelectionMode } from '@/charts/types'
import type { OptionItem } from '@/shared/ui/primitives/SelectMenu'

// ===== TYPES =================================================================
type LegendInteractionGroupProps = {
  value: ChartInteractionSpec['legend']
  onChange: (value: ChartInteractionSpec['legend']) => void
}

/** What a click on a legend entry does; off turns the selection off. */
type SelectionChoice = LegendSelectionMode | 'off'

// ===== GLOBAL CONSTANTS ======================================================
const selectionChoiceOptions = [
  { icon: MousePointerBan, label: 'Off', value: 'off' },
  { icon: ListChecks, label: 'Multi', value: 'multiple' },
  { icon: SquareCheck, label: 'Single', value: 'single' },
] satisfies OptionItem<SelectionChoice>[]

// ===== COMPONENT =============================================================
/**
 * Interaction group of the legend: what a click on a legend entry does,
 * nothing or select one or several series, the three click modes of
 * ECharts. Off keeps the stored selection mode.
 */
function LegendInteractionGroup({
  value,
  onChange,
}: LegendInteractionGroupProps) {
  return (
    <Group title="Interaction">
      <Row layout="wide">
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
      </Row>
    </Group>
  )
}

export default LegendInteractionGroup
