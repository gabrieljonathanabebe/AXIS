import ColorControl from '../shared/ui/ColorControl'
import ControlRow from '../shared/ui/ControlRow'
import FormatWidget from '../shared/ui/FormatWidget'
import LayoutControls from '../shared/ui/LayoutControls'
import Slider from '../shared/ui/Slider'
import StrokeStyleControls from '../shared/ui/StrokeStyleControls'
import { CONTAINER_BORDER } from './objectDefaults'

import type { ColorValue } from '../shared/colorValue'
import type { ColorPreset } from '../shared/ui/ColorControl'
import type {
  ObjectBackground,
  ObjectBackgroundPreset,
  ObjectContainer,
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
] satisfies ColorPreset<ObjectBackgroundPreset>[]

/**
 * Turns a container background into the value of its color control.
 * @param background Background of the container.
 * @returns Name of the preset or the own color.
 */
function toColorValue(
  background: ObjectBackground,
): ColorValue | ObjectBackgroundPreset {
  return background.kind === 'color' ? background.color : background.kind
}

/**
 * Turns the value of the color control into a container background.
 * @param value Name of a preset or an own color.
 * @returns Background of the container.
 */
function toBackground(
  value: ColorValue | ObjectBackgroundPreset,
): ObjectBackground {
  return typeof value === 'string'
    ? { kind: value }
    : { kind: 'color', color: value }
}

/**
 * Groups of a container: padding, corner radius, background and border,
 * in the fixed order Layout → Shape → Fill → Stroke.
 */
function ContainerWidget({ value, onChange }: ContainerWidgetProps) {
  return (
    <>
      <FormatWidget title="Layout">
        <LayoutControls
          label="Container"
          value={value.layout}
          onChange={(layout) => onChange('layout', layout)}
        />
      </FormatWidget>
      <FormatWidget title="Shape">
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
      </FormatWidget>
      <FormatWidget title="Background">
        <ControlRow label="Color">
          <ColorControl
            label="Container background"
            presets={backgroundPresets}
            value={toColorValue(value.background)}
            onChange={(color) => {
              onChange('background', toBackground(color))
            }}
          />
        </ControlRow>
      </FormatWidget>
      <FormatWidget title="Border">
        <StrokeStyleControls
          defaultColor={CONTAINER_BORDER.color}
          label="Container border"
          value={value.border}
          onChange={(border) => onChange('border', border)}
        />
      </FormatWidget>
    </>
  )
}

export default ContainerWidget
