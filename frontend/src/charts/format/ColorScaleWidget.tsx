import FormatWidget from '../../shared/ui/FormatWidget'
import LayoutControls from '../../shared/ui/LayoutControls'

import type { ColorScaleAppearance } from '../types'

type ContinuousColorScale = ColorScaleAppearance['continuous']

type ColorScaleWidgetProps = {
  value: ContinuousColorScale
  onChange: (value: ContinuousColorScale) => void
}

const positionOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
] satisfies {
  label: string
  value: ContinuousColorScale['layout']['position']
}[]

/**
 * Groups of the continuous color scale: where it sits and its labels; its
 * colors and range are part of the data color of the marks. Whether it
 * shows is the element toggle in the popover header.
 */
function ColorScaleWidget({ value, onChange }: ColorScaleWidgetProps) {
  return (
    <>
      <FormatWidget title="Layout">
        <LayoutControls
          label="Color scale"
          positions={positionOptions}
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </FormatWidget>
      <FormatWidget
        title="Labels"
        visibility={{
          visible: value.labels,
          onChange: (labels) => onChange({ ...value, labels }),
        }}
      />
    </>
  )
}

export default ColorScaleWidget
