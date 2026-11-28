import LayoutGroup from '@/shared/ui/groups/LayoutGroup'
import PositionGroup from '@/shared/ui/groups/PositionGroup'
import SurfaceControls from '@/shared/ui/groups/SurfaceControls'
import TextGroup from '@/shared/ui/groups/TextGroup'

import type { LegendAppearance } from '@/charts/types'

type LegendElementProps = {
  value: LegendAppearance
  onChange: (value: LegendAppearance) => void
}

/**
 * Groups of the chart legend: where it sits, the gap between its entries,
 * its surface and how its text looks. Whether it shows is the eye in the
 * popover header.
 */
function LegendElement({ value, onChange }: LegendElementProps) {
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
      <SurfaceControls
        label="Legend"
        value={value.surface}
        onChange={(key, property) => {
          onChange({ ...value, surface: { ...value.surface, [key]: property } })
        }}
      >
        <TextGroup
          label="Legend text"
          value={value.textStyle}
          onChange={(textStyle) => onChange({ ...value, textStyle })}
        />
      </SurfaceControls>
    </>
  )
}

export default LegendElement
