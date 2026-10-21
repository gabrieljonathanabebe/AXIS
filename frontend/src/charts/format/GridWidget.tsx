import ColorControl from '../../shared/ui/ColorControl'
import ControlRow from '../../shared/ui/ControlRow'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import Slider from '../../shared/ui/Slider'
import FormatWidget from '../../shared/ui/FormatWidget'

import type { GridAppearance } from '../types'
import type { LineStyle } from '../../shared/strokeStyle'

type GridWidgetProps = {
  value: GridAppearance
  onChange: (value: GridAppearance) => void
}

const lineStyleOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
] satisfies { label: string; value: LineStyle }[]

/** Edits the gridlines of one axis: color, opacity and line style. */
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
      <ControlRow label="Color">
        <ColorControl
          label="Grid color"
          value={value.color}
          onChange={(color) => {
            onChange({
              ...value,
              color,
            })
          }}
        />
      </ControlRow>
      <ControlRow label="Opacity">
        <Slider
          label="Grid opacity"
          min={0.05}
          max={1}
          step={0.05}
          value={value.opacity}
          onValueChange={(opacity) => {
            onChange({
              ...value,
              opacity,
            })
          }}
        />
      </ControlRow>
      <ControlRow label="Line style">
        <SegmentedControl
          label="Grid line style"
          options={lineStyleOptions}
          value={value.lineStyle}
          renderOption={(option) => (
            <span
              className="line-style-preview"
              style={{ borderTopStyle: option.value }}
            />
          )}
          onValueChange={(lineStyle) => {
            onChange({
              ...value,
              lineStyle,
            })
          }}
        />
      </ControlRow>
    </FormatWidget>
  )
}

export default GridWidget
