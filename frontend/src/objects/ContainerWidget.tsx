import { SquareRoundCorner } from 'lucide-react'

import { createContainerEffect, sortContainerEffects } from '../shared/effect'
import { getPaintColor } from '../shared/paint'
import ContainerEffectsControls from '../shared/ui/ContainerEffectsControls'
import ControlRow from '../shared/ui/ControlRow'
import FillControls from '../shared/ui/FillControls'
import FormatWidget from '../shared/ui/FormatWidget'
import LayoutControls from '../shared/ui/LayoutControls'
import ScrubbableNumber from '../shared/ui/ScrubbableNumber'
import StrokeStyleControls from '../shared/ui/StrokeStyleControls'
import { CONTAINER_BORDER } from './objectDefaults'

import type { ObjectContainer, SetContainer } from './types'

type ContainerWidgetProps = {
  value: ObjectContainer
  onChange: SetContainer
}

/**
 * Groups of a container: padding, corner radius, background, border and
 * effects, in the fixed order Layout → Shape → Fill → Stroke → Effects.
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
        <ControlRow>
          <ScrubbableNumber
            icon={<SquareRoundCorner size={14} />}
            label="Container radius"
            max={32}
            min={0}
            step={2}
            unit="px"
            value={value.borderRadius}
            onValueChange={(borderRadius) => {
              onChange('borderRadius', borderRadius)
            }}
          />
        </ControlRow>
      </FormatWidget>
      <FormatWidget title="Background">
        <FillControls
          label="Container background"
          presets={[]}
          value={value.background}
          onChange={(background) => onChange('background', background)}
        />
      </FormatWidget>
      <FormatWidget title="Border">
        <StrokeStyleControls
          defaultColor={getPaintColor(CONTAINER_BORDER.paint)}
          label="Container border"
          value={value.border}
          onChange={(border) => onChange('border', border)}
        />
      </FormatWidget>
      <FormatWidget
        title="Effects"
        onAdd={() => {
          onChange(
            'effects',
            sortContainerEffects([
              ...value.effects,
              createContainerEffect('shadow'),
            ]),
          )
        }}
      >
        {value.effects.length > 0 ? (
          <ContainerEffectsControls
            label="Container"
            value={value.effects}
            onChange={(effects) => onChange('effects', effects)}
          />
        ) : null}
      </FormatWidget>
    </>
  )
}

export default ContainerWidget
