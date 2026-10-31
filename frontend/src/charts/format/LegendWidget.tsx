import FormatWidget from '../../shared/ui/FormatWidget'
import LayoutControls from '../../shared/ui/LayoutControls'
import TextStyleControls from '../../shared/ui/TextStyleControls'

import type { LegendAppearance } from '../types'

type LegendWidgetProps = {
  value: LegendAppearance
  onChange: (value: LegendAppearance) => void
}

/**
 * Groups of the chart legend: where it sits and how its text looks.
 * Whether it shows is the eye in the popover header.
 */
function LegendWidget({ value, onChange }: LegendWidgetProps) {
  return (
    <>
      <FormatWidget title="Layout">
        <LayoutControls
          label="Legend"
          maxGap={40}
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </FormatWidget>
      <FormatWidget title="Text">
        <TextStyleControls
          label="Legend text"
          value={value.textStyle}
          onChange={(textStyle) => onChange({ ...value, textStyle })}
        />
      </FormatWidget>
    </>
  )
}

export default LegendWidget
