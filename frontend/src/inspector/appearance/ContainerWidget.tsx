import { Frame } from 'lucide-react'

import ColorControl from '../../shared/ui/ColorControl'
import ControlRow from '../../shared/ui/ControlRow'
import ScrubbableNumber from '../../shared/ui/ScrubbableNumber'
import Slider from '../../shared/ui/Slider'
import InspectorWidget from '../InspectorWidget'

import type { ColorPreset } from '../../shared/ui/ColorControl'
import type { SetContainer } from '../types'
import type {
  ChartContainerAppearance,
  ChartContainerBackground,
  ChartContainerBackgroundPreset,
} from '../../charts/types'

type ContainerWidgetProps = {
  value: ChartContainerAppearance
  onChange: SetContainer
}

const backgroundPresets = [
  { label: 'Surface', value: 'surface', fill: 'var(--glass-fill-regular)' },
  { label: 'Glass', value: 'glass', fill: 'var(--glass-fill-liquid)' },
  { label: 'Blue', value: 'blue', fill: 'var(--chart-fill-blue)' },
  { label: 'Violet', value: 'violet', fill: 'var(--chart-fill-violet)' },
] satisfies (ColorPreset & { value: ChartContainerBackgroundPreset })[]

function isBackgroundPreset(
  value: string,
): value is ChartContainerBackgroundPreset {
  return backgroundPresets.some((preset) => preset.value === value)
}

function toColorValue(background: ChartContainerBackground): string {
  return background.kind === 'color' ? background.color : background.kind
}

function toBackground(value: string): ChartContainerBackground {
  return isBackgroundPreset(value)
    ? { kind: value }
    : { kind: 'color', color: value }
}

function ContainerWidget({ value, onChange }: ContainerWidgetProps) {
  return (
    <InspectorWidget title="Container" icon={<Frame size={16} />}>
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
    </InspectorWidget>
  )
}

export default ContainerWidget
