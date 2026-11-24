import Group from '@/shared/ui/groups/Group'
import LayoutControls from '@/shared/ui/groups/LayoutGroup'
import PositionControls from '@/shared/ui/groups/PositionGroup'
import SurfaceControls from '@/shared/ui/groups/SurfaceControls'
import TextStyleControls from '@/shared/ui/groups/TextGroup'

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
      <Group title="Position">
        <PositionControls
          label="Legend"
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </Group>
      <Group title="Layout">
        <LayoutControls
          label="Legend"
          maxGap={40}
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </Group>
      <SurfaceControls
        label="Legend"
        value={value.surface}
        onChange={(key, property) => {
          onChange({ ...value, surface: { ...value.surface, [key]: property } })
        }}
      >
        <Group title="Text">
          <TextStyleControls
            label="Legend text"
            value={value.textStyle}
            onChange={(textStyle) => onChange({ ...value, textStyle })}
          />
        </Group>
      </SurfaceControls>
    </>
  )
}

export default LegendElement
