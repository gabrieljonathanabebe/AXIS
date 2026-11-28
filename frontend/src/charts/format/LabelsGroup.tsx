import { getVisibility } from '@/shared/ui/groups/getVisibility'
import Group from '@/shared/ui/groups/Group'
import NumberFormatGroup from '@/shared/ui/groups/NumberFormatGroup'
import PositionGroup from '@/shared/ui/groups/PositionGroup'
import TextGroup from '@/shared/ui/groups/TextGroup'

import type { LabelPosition, LabelsAppearance } from '@/charts/types'
import type { OptionItem } from '@/shared/optionItem'

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
      <PositionGroup
        label="Label"
        sides={positions}
        value={value.position}
        onChange={(position) => onChange({ ...value, position })}
      />
      <TextGroup
        label="Label"
        value={value.textStyle}
        onChange={(textStyle) => onChange({ ...value, textStyle })}
      />
      {!isRadial ? (
        <NumberFormatGroup
          label="Label"
          value={value.numberFormat}
          onChange={(numberFormat) => onChange({ ...value, numberFormat })}
        />
      ) : null}
    </Group>
  )
}

export default LabelsGroup
