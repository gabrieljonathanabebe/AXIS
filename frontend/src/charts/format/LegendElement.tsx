import BackgroundGroup from '@/shared/ui/groups/BackgroundGroup'
import BorderGroup from '@/shared/ui/groups/BorderGroup'
import EffectsGroup from '@/shared/ui/groups/EffectsGroup'
import LayoutGroup from '@/shared/ui/groups/LayoutGroup'
import PositionGroup from '@/shared/ui/groups/PositionGroup'
import ShapeGroup from '@/shared/ui/groups/ShapeGroup'
import TextGroup from '@/shared/ui/groups/TextGroup'

import type { LegendAppearance } from '@/charts/types'
import type { Surface } from '@/shared/surface'

type LegendElementProps = {
  value: LegendAppearance
  onChange: (value: LegendAppearance) => void
}

/**
 * Groups of the chart legend in the fixed order: where it sits, the gap
 * between its entries, its corners, how its text looks, then its
 * background, border and effects. Whether it shows is the eye in the
 * popover header.
 */
function LegendElement({ value, onChange }: LegendElementProps) {
  const { surface } = value

  /** Saves changed parts of the surface, e.g. its border. */
  function setSurface(patch: Partial<Surface>): void {
    onChange({ ...value, surface: { ...surface, ...patch } })
  }

  return (
    <>
      <PositionGroup
        label="Legend"
        value={value.position}
        onChange={(position) => onChange({ ...value, position })}
      />
      <LayoutGroup
        label="Legend"
        maxGap={40}
        value={value.layout}
        onChange={(layout) => onChange({ ...value, layout })}
      />
      <ShapeGroup
        label="Legend"
        value={surface.borderRadius}
        onChange={(borderRadius) => setSurface({ borderRadius })}
      />
      <TextGroup
        label="Legend text"
        value={value.textStyle}
        onChange={(textStyle) => onChange({ ...value, textStyle })}
      />
      <BackgroundGroup
        label="Legend"
        value={surface.background}
        onChange={(background) => setSurface({ background })}
      />
      <BorderGroup
        label="Legend"
        value={surface.border}
        onChange={(border) => setSurface({ border })}
      />
      <EffectsGroup
        label="Legend"
        value={surface.effects}
        onChange={(effects) => setSurface({ effects })}
      />
    </>
  )
}

export default LegendElement
