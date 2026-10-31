import FormatWidget from '../../shared/ui/FormatWidget'
import StrokeStyleControls from '../../shared/ui/StrokeStyleControls'

import type { AxisStrokeAppearance } from '../types'

type AxisStrokeWidgetProps = {
  label: string
  title: string
  value: AxisStrokeAppearance
  onChange: (value: AxisStrokeAppearance) => void
}

/**
 * Edits one line of an axis, its axis line or its gridlines: visibility,
 * width, line style, color and opacity.
 */
function AxisStrokeWidget({
  label,
  title,
  value,
  onChange,
}: AxisStrokeWidgetProps) {
  return (
    <FormatWidget
      title={title}
      visibility={{
        visible: value.visible,
        onChange: (visible) => {
          onChange({ ...value, visible })
        },
      }}
    >
      <StrokeStyleControls
        label={label}
        maxWidth={4}
        minWidth={1}
        value={value.stroke}
        onChange={(stroke) => onChange({ ...value, stroke })}
      />
    </FormatWidget>
  )
}

export default AxisStrokeWidget
