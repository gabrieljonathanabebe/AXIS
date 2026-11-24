import Group from '@/shared/ui/Group'
import LayoutControls from '@/shared/ui/LayoutControls'
import PositionControls from '@/shared/ui/PositionControls'
import SurfaceControls from '@/shared/ui/SurfaceControls'
import { getLayoutBounds } from '@/workspace/chartLayout'

import type { Surface } from '@/shared/surface'
import type { LayoutBox } from '@/shared/ui/BoxFieldsRow'
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
 * Groups of a container: position, size and padding, then its surface
 * (`SurfaceControls`), in the fixed order Position → Layout → Shape →
 * Fill → Stroke → Effects. Position and size are grid cells, limited
 * like dragging.
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
  /**
   * Saves one property of the surface, which is a property of the
   * container, too.
   * @param key Property of the surface, e.g. its border.
   * @param surfaceValue New value of the property.
   */
  function setSurface<TKey extends keyof Surface>(
    key: TKey,
    surfaceValue: Surface[TKey],
  ): void {
    onChange(key, surfaceValue as ObjectContainer[TKey])
  }
  return (
    <>
      <Group title="Position">
        <PositionControls
          box={box}
          label="Container"
          value={value.layout}
          onChange={(layout) => onChange('layout', layout)}
        />
      </Group>
      <Group title="Layout">
        <LayoutControls
          box={box}
          label="Container"
          value={value.layout}
          onChange={(layout) => onChange('layout', layout)}
        />
      </Group>
      <SurfaceControls label="Container" value={value} onChange={setSurface} />
    </>
  )
}

export default ContainerElement
