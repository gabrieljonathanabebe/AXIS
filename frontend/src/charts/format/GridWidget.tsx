import StrokeStyleControls from '../../shared/ui/StrokeStyleControls'
import FormatWidget from '../../shared/ui/FormatWidget'

import type { GridAppearance } from '../types'

type GridWidgetProps = {
  value: GridAppearance
  onChange: (value: GridAppearance) => void
}

/** Edits the gridlines of one axis: width, line style, color and opacity. */
function GridWidget({ value, onChange }: GridWidgetProps) {
  return (
    <FormatWidget
      title="Gridlines"
      visibility={{
        visible: value.visible,
        onChange: (visible) => {
          onChange({ ...value, visible })
        },
      }}
    >
      <StrokeStyleControls
        label="Grid"
        maxWidth={4}
        minWidth={1}
        value={value.stroke}
        onChange={(stroke) => onChange({ ...value, stroke })}
      />
    </FormatWidget>
  )
}

export default GridWidget
