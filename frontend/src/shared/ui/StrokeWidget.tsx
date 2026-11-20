import FormatWidget from './FormatWidget'
import StrokeStyleControls from './StrokeStyleControls'

import type { PaintType } from '@/shared/paint'
import type { StrokeAppearance } from '@/shared/strokeStyle'

type StrokeWidgetProps = {
  label: string
  maxWidth?: number
  minWidth?: number
  paintTypes?: PaintType[]
  title: string
  value: StrokeAppearance
  onChange: (value: StrokeAppearance) => void
}

/**
 * Group of one stroke with an eye in its heading, e.g. a border or the
 * gridlines of an axis: color, opacity, width and line style. The eye
 * hides the stroke and keeps its values; a shown stroke is at least 1 px.
 */
function StrokeWidget({
  label,
  maxWidth,
  minWidth = 1,
  paintTypes,
  title,
  value,
  onChange,
}: StrokeWidgetProps) {
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
        maxWidth={maxWidth}
        minWidth={minWidth}
        paintTypes={paintTypes}
        value={value.stroke}
        onChange={(stroke) => onChange({ ...value, stroke })}
      />
    </FormatWidget>
  )
}

export default StrokeWidget
