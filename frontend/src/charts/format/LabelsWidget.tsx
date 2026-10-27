import FormatWidget from '../../shared/ui/FormatWidget'
import LayoutControls from '../../shared/ui/LayoutControls'
import NumberFormatControls from '../../shared/ui/NumberFormatControls'
import TextStyleControls from '../../shared/ui/TextStyleControls'
import { CHART_TEXT_STYLE } from '../createChartInstance'

import type { OptionItem } from '../../shared/ui/OptionsMenu'
import type { LabelPosition, LabelsAppearance } from '../types'

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
 * they have no number format. Whether the labels show is set in the
 * popover header and by the eye of the labels group in the marks.
 */
function LabelsWidget({
  isRadial = false,
  onChange,
  positions,
  value,
}: LabelsWidgetProps) {
  return (
    <>
      <FormatWidget title="Layout">
        <LayoutControls
          label="Label"
          positions={positions}
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </FormatWidget>
      <FormatWidget title="Text">
        <TextStyleControls
          defaultColor={CHART_TEXT_STYLE.color}
          label="Label"
          value={value.textStyle}
          onChange={(textStyle) => onChange({ ...value, textStyle })}
        />
      </FormatWidget>
      {!isRadial ? (
        <FormatWidget title="Format">
          <NumberFormatControls
            label="Label"
            value={value.numberFormat}
            onChange={(numberFormat) => onChange({ ...value, numberFormat })}
          />
        </FormatWidget>
      ) : null}
    </>
  )
}

export default LabelsWidget
