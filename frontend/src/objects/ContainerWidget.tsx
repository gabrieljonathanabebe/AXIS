import ColorControl from '../shared/ui/ColorControl'
import ControlRow from '../shared/ui/ControlRow'
import ScrubbableNumber from '../shared/ui/ScrubbableNumber'
import Slider from '../shared/ui/Slider'
import StrokeStyleControls from '../shared/ui/StrokeStyleControls'
import FormatWidget from '../shared/ui/FormatWidget'

import type { ColorPreset } from '../shared/ui/ColorControl'
import type {
  ObjectContainer,
  ObjectBackground,
  ObjectBackgroundPreset,
  SetContainer,
} from './types'

type ContainerWidgetProps = {
  value: ObjectContainer
  onChange: SetContainer
}

const backgroundPresets = [
  { label: 'Surface', value: 'surface', fill: 'var(--glass-fill-regular)' },
  { label: 'Glass', value: 'glass', fill: 'var(--glass-fill-liquid)' },
  { label: 'Blue', value: 'blue', fill: 'var(--chart-fill-blue)' },
  { label: 'Violet', value: 'violet', fill: 'var(--chart-fill-violet)' },
] satisfies (ColorPreset & { value: ObjectBackgroundPreset })[]

function isBackgroundPreset(value: string): value is ObjectBackgroundPreset {
  return backgroundPresets.some((preset) => preset.value === value)
}

function toColorValue(background: ObjectBackground): string {
  return background.kind === 'color' ? background.color : background.kind
}

function toBackground(value: string): ObjectBackground {
  return isBackgroundPreset(value)
    ? { kind: value }
    : { kind: 'color', color: value }
}

/** Edits background, padding, corner radius and border of a container. */
function ContainerWidget({ value, onChange }: ContainerWidgetProps) {
  return (
    <FormatWidget title="Container">
      <ControlRow label="Background">
        <ColorControl
          label="Container background"
          presets={backgroundPresets}
          value={toColorValue(value.background)}
          onChange={(color) => {
            onChange('background', toBackground(color))
          }}
        />
      </ControlRow>
      <ControlRow label="Padding">
        <ScrubbableNumber
          label="Container padding"
          min={0}
          max={64}
          step={2}
          value={value.padding}
          onValueChange={(padding) => {
            onChange('padding', padding)
          }}
        />
      </ControlRow>
      <ControlRow label="Radius">
        <Slider
          label="Container radius"
          min={0}
          max={32}
          step={2}
          value={value.borderRadius}
          onValueChange={(borderRadius) => {
            onChange('borderRadius', borderRadius)
          }}
        />
      </ControlRow>
      <StrokeStyleControls
        label="Container border"
        rowLabelPrefix="Border"
        value={value.border}
        onChange={(border) => onChange('border', border)}
      />
    </FormatWidget>
  )
}

export default ContainerWidget
