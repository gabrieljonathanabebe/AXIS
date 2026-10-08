import { Grid2X2 } from 'lucide-react'

import ColorControl from '../../ui/ColorControl'
import ControlRow from '../../ui/ControlRow'
import SegmentedControl from '../../ui/SegmentedControl'
import Slider from '../../ui/Slider'
import InspectorWidget from '../InspectorWidget'

import type { GridAppearance, LineStyle } from '../../../types/chart'

type GridWidgetProps = {
  value: GridAppearance
  onChange: (value: GridAppearance) => void
}

const lineStyleOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
] satisfies { label: string; value: LineStyle }[]

function GridWidget({ value, onChange }: GridWidgetProps) {
  return (
    <InspectorWidget
      title="Grid"
      icon={<Grid2X2 size={16} />}
      visibility={{
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({ ...value, enabled })
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
    </InspectorWidget>
  )
}

export default GridWidget
