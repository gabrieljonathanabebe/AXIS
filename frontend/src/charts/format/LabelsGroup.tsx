import { getVisibility } from '@/shared/ui/groups/getVisibility'
import Group from '@/shared/ui/groups/Group'
import NumberFormatControls from '@/shared/ui/groups/NumberFormatGroup'
import PositionControls from '@/shared/ui/groups/PositionGroup'
import TextStyleControls from '@/shared/ui/groups/TextGroup'

import type { LabelPosition, LabelsAppearance } from '@/charts/types'
import type { OptionItem } from '@/shared/ui/primitives/Menu'

// ===== TYPES =================================================================
type LabelsGroupProps = {
  isRadial?: boolean
  onChange: (value: LabelsAppearance) => void
  positions: OptionItem<LabelPosition>[]
  value: LabelsAppearance
}

// ===== COMPONENT =============================================================
/**
 * Group of the data labels in the marks with its subgroups: where they
 * sit, how their text looks and their number format. Its eye shows or
 * hides the labels. The chart type offers its `positions`, e.g. outside
 * and inside for pie segments; radial charts label percentages, so they
 * have no number format.
 */
function LabelsGroup({
  isRadial = false,
  onChange,
  positions,
  value,
}: LabelsGroupProps) {
  return (
    <Group
      group="labels"
      title="Labels"
      visibility={getVisibility(value, onChange)}
    >
      <Group title="Position">
        <PositionControls
          label="Label"
          positions={positions}
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </Group>
      <Group title="Text">
        <TextStyleControls
          label="Label"
          value={value.textStyle}
          onChange={(textStyle) => onChange({ ...value, textStyle })}
        />
      </Group>
      {!isRadial ? (
        <Group title="Format">
          <NumberFormatControls
            label="Label"
            value={value.numberFormat}
            onChange={(numberFormat) => onChange({ ...value, numberFormat })}
          />
        </Group>
      ) : null}
    </Group>
  )
}

export default LabelsGroup
