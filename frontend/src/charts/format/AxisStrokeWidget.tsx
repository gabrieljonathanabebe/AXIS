import FormatWidget from '../../shared/ui/FormatWidget'
import StrokeStyleControls from '../../shared/ui/StrokeStyleControls'

import type { ColorValue } from '../../shared/colorValue'
import type { AxisStrokeAppearance } from '../types'

type AxisStrokeWidgetProps = {
  defaultColor: ColorValue
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
  defaultColor,
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
        defaultColor={defaultColor}
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
