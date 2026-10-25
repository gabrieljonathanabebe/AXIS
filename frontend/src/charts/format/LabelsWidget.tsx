import FormatWidget from '../../shared/ui/FormatWidget'
import LayoutControls from '../../shared/ui/LayoutControls'
import NumberFormatControls from '../../shared/ui/NumberFormatControls'
import TextStyleControls from '../../shared/ui/TextStyleControls'
import { CHART_TEXT_STYLE } from '../createChartInstance'

import type { LabelPosition, LabelsAppearance } from '../types'

// ===== TYPES =================================================================
type LabelsWidgetProps = {
  isRadial?: boolean
  onChange: (value: LabelsAppearance) => void
  value: LabelsAppearance
}

// ===== CONSTANTS =============================================================
const positionOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Right', value: 'right' },
  { label: 'Inside', value: 'inside' },
] satisfies { label: string; value: LabelPosition }[]

const radialPositionOptions = [
  { label: 'Outside', value: 'right' },
  { label: 'Inside', value: 'inside' },
] satisfies { label: string; value: LabelPosition }[]

// ===== COMPONENT =============================================================
/**
 * Group of the data labels with its toggle: where they sit, how their text
 * looks and their number format. Radial charts label percentages, so they
 * have no number format.
 */
function LabelsWidget({
  isRadial = false,
  onChange,
  value,
}: LabelsWidgetProps) {
  return (
    <FormatWidget
      title="Labels"
      visibility={{
        visible: value.visible,
        onChange: (visible) => onChange({ ...value, visible }),
      }}
    >
      <LayoutControls
        label="Label"
        positions={isRadial ? radialPositionOptions : positionOptions}
        value={value.layout}
        onChange={(layout) => onChange({ ...value, layout })}
      />
      <TextStyleControls
        defaultColor={CHART_TEXT_STYLE.color}
        label="Label"
        value={value.textStyle}
        onChange={(textStyle) => onChange({ ...value, textStyle })}
      />
      {!isRadial ? (
        <NumberFormatControls
          label="Label"
          value={value.numberFormat}
          onChange={(numberFormat) => onChange({ ...value, numberFormat })}
        />
      ) : null}
    </FormatWidget>
  )
}

export default LabelsWidget
