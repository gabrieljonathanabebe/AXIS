import FormatWidget from '@/shared/ui/FormatWidget'
import LayoutControls from '@/shared/ui/LayoutControls'
import PositionControls from '@/shared/ui/PositionControls'
import SurfaceControls from '@/shared/ui/SurfaceControls'
import TextStyleControls from '@/shared/ui/TextStyleControls'

import type { LegendAppearance } from '@/charts/types'

type LegendWidgetProps = {
  value: LegendAppearance
  onChange: (value: LegendAppearance) => void
}

/**
 * Groups of the chart legend: where it sits, the gap between its entries,
 * its surface and how its text looks. Whether it shows is the eye in the
 * popover header.
 */
function LegendWidget({ value, onChange }: LegendWidgetProps) {
  return (
    <>
      <FormatWidget title="Position">
        <PositionControls
          label="Legend"
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </FormatWidget>
      <FormatWidget title="Layout">
        <LayoutControls
          label="Legend"
          maxGap={40}
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </FormatWidget>
      <SurfaceControls
        label="Legend"
        value={value.surface}
        onChange={(key, property) => {
          onChange({ ...value, surface: { ...value.surface, [key]: property } })
        }}
      >
        <FormatWidget title="Text">
          <TextStyleControls
            label="Legend text"
            value={value.textStyle}
            onChange={(textStyle) => onChange({ ...value, textStyle })}
          />
        </FormatWidget>
      </SurfaceControls>
    </>
  )
}

export default LegendWidget
