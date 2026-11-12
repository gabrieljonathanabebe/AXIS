import { SquareRoundCorner } from 'lucide-react'

import { createContainerEffect } from '../shared/effect'
import { addFill } from '../shared/fill'
import ContainerEffectsControls from '../shared/ui/ContainerEffectsControls'
import ControlRow from '../shared/ui/ControlRow'
import FillListControls from '../shared/ui/FillListControls'
import FormatWidget from '../shared/ui/FormatWidget'
import LayoutControls from '../shared/ui/LayoutControls'
import PositionControls from '../shared/ui/PositionControls'
import ScrubbableNumber from '../shared/ui/ScrubbableNumber'
import StrokeStyleControls from '../shared/ui/StrokeStyleControls'
import { getLayoutBounds } from '../workspace/chartLayout'

import type { LayoutBox } from '../shared/ui/BoxFieldsRow'
import type {
  ObjectContainer,
  ObjectLayout,
  ObjectSize,
  SetContainer,
} from './types'

type ContainerWidgetProps = {
  layout: ObjectLayout
  minSize: ObjectSize
  value: ObjectContainer
  onChange: SetContainer
  onLayoutChange: (layout: ObjectLayout) => void
}

/**
 * Groups of a container: position, size and padding, corner radius,
 * background, border and effects, in the fixed order Position → Layout →
 * Shape → Fill → Stroke → Effects. Position and size are grid cells,
 * limited like dragging.
 */
function ContainerWidget({
  layout,
  minSize,
  value,
  onChange,
  onLayoutChange,
}: ContainerWidgetProps) {
  const box: LayoutBox = {
    bounds: getLayoutBounds(layout, minSize),
    unitName: 'grid cells',
    value: layout,
    onChange: (patch) => onLayoutChange({ ...layout, ...patch }),
  }
  return (
    <>
      <FormatWidget title="Position">
        <PositionControls
          box={box}
          label="Container"
          value={value.layout}
          onChange={(layout) => onChange('layout', layout)}
        />
      </FormatWidget>
      <FormatWidget title="Layout">
        <LayoutControls
          box={box}
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
      <FormatWidget
        title="Background"
        onAdd={() => onChange('background', addFill(value.background))}
      >
        <FillListControls
          label="Container"
          value={value.background}
          onChange={(background) => onChange('background', background)}
        />
      </FormatWidget>
      <FormatWidget title="Border">
        <StrokeStyleControls
          label="Container border"
          value={value.border}
          onChange={(border) => onChange('border', border)}
        />
      </FormatWidget>
      <FormatWidget
        title="Effects"
        onAdd={() => {
          onChange('effects', [
            ...value.effects,
            createContainerEffect('shadow'),
          ])
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
