import Group from '@/shared/ui/Group'
import NumberFormatControls from '@/shared/ui/NumberFormatControls'
import PositionControls from '@/shared/ui/PositionControls'
import TextStyleControls from '@/shared/ui/TextStyleControls'

import type { LabelPosition, LabelsAppearance } from '@/charts/types'
import type { OptionItem } from '@/shared/ui/OptionsMenu'

// ===== TYPES =================================================================
type LabelsWidgetProps = {
  isRadial?: boolean
  onChange: (value: LabelsAppearance) => void
  positions: OptionItem<LabelPosition>[]
  value: LabelsAppearance
}

// ===== COMPONENT =============================================================
/**
 * Groups of the data labels element: where they sit, how their text looks
 * and their number format. The chart type offers its `positions`, e.g.
 * outside and inside for pie segments; radial charts label percentages, so
 * they have no number format. Whether the labels show is the eye of their
 * group in the marks.
 */
function LabelsWidget({
  isRadial = false,
  onChange,
  positions,
  value,
}: LabelsWidgetProps) {
  return (
    <>
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
    </>
  )
}

export default LabelsWidget
