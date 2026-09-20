import { Grid2X2 } from 'lucide-react'

import ColorControl from '../../ui/ColorControl'
import ControlRow from '../../ui/ControlRow'
import IconButton from '../../ui/IconButton'
import SelectControl from '../../ui/SelectControl'
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
    <InspectorWidget title="Grid" icon={<Grid2X2 size={16} />}>
      <ControlRow label="Enabled">
        <IconButton
          size="sm"
          label={value.enabled ? 'Hide grid' : 'Show grid'}
          isActive={value.enabled}
          onClick={() => {
            onChange({
              ...value,
              enabled: !value.enabled,
            })
          }}
        >
          <Grid2X2 size={15} />
        </IconButton>
      </ControlRow>
      {value.enabled ? (
        <div className="inspector-widget-subproperties">
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
            <SelectControl
              label="Grid line style"
              options={lineStyleOptions}
              value={value.lineStyle}
              onChange={(lineStyle) => {
                onChange({
                  ...value,
                  lineStyle,
                })
              }}
            />
          </ControlRow>
        </div>
      ) : null}
    </InspectorWidget>
  )
}

export default GridWidget
