import BackgroundGroup from '@/shared/ui/groups/BackgroundGroup'
import BorderGroup from '@/shared/ui/groups/BorderGroup'
import EffectsGroup from '@/shared/ui/groups/EffectsGroup'
import LayoutGroup from '@/shared/ui/groups/LayoutGroup'
import PositionGroup from '@/shared/ui/groups/PositionGroup'
import ShapeGroup from '@/shared/ui/groups/ShapeGroup'
import { getLayoutBounds } from '@/workspace/chartLayout'

import type { LayoutBox } from '@/shared/ui/rows/BoxRow'
import type {
  ObjectContainer,
  ObjectLayout,
  ObjectSize,
  SetContainer,
} from './types'

type ContainerElementProps = {
  layout: ObjectLayout
  minSize: ObjectSize
  value: ObjectContainer
  onChange: SetContainer
  onLayoutChange: (layout: ObjectLayout) => void
}

/**
 * Groups of a container in the fixed order Position → Layout → Shape →
 * Fill → Stroke → Effects: position, size and padding, then corners,
 * background, border and effects of its surface. Position and size are
 * grid cells, limited like dragging.
 */
function ContainerElement({
  layout,
  minSize,
  value,
  onChange,
  onLayoutChange,
}: ContainerElementProps) {
  const box: LayoutBox = {
    bounds: getLayoutBounds(layout, minSize),
    unitName: 'grid cells',
    value: layout,
    onChange: (patch) => onLayoutChange({ ...layout, ...patch }),
  }
  return (
    <>
      <PositionGroup box={box} label="Container" />
      <LayoutGroup
        box={box}
        label="Container"
        value={value.layout}
        onChange={(layout) => onChange('layout', layout)}
      />
      <ShapeGroup
        label="Container"
        value={value.borderRadius}
        onChange={(borderRadius) => onChange('borderRadius', borderRadius)}
      />
      <BackgroundGroup
        label="Container"
        value={value.background}
        onChange={(background) => onChange('background', background)}
      />
      <BorderGroup
        label="Container"
        value={value.border}
        onChange={(border) => onChange('border', border)}
      />
      <EffectsGroup
        label="Container"
        value={value.effects}
        onChange={(effects) => onChange('effects', effects)}
      />
    </>
  )
}

export default ContainerElement
