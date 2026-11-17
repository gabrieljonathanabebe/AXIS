import { getSideOrientation } from '../../shared/layout'
import FormatWidget from '../../shared/ui/FormatWidget'
import LayoutControls from '../../shared/ui/LayoutControls'
import PositionControls from '../../shared/ui/PositionControls'
import StrokeWidget from '../../shared/ui/StrokeWidget'
import SurfaceControls from '../../shared/ui/SurfaceControls'
import AxisWidget from './AxisWidget'

import type { LayoutBox } from '../../shared/ui/BoxFieldsRow'
import type { ColorScaleAppearance } from '../types'

type ContinuousColorScale = ColorScaleAppearance['continuous']

type ColorScaleWidgetProps = {
  defaultTitle: string
  value: ContinuousColorScale
  onChange: (value: ContinuousColorScale) => void
}

const positionOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
] satisfies {
  label: string
  value: ContinuousColorScale['layout']['position']
}[]

/** Bounds of the bar along its side and across it, in pixels. */
const SIZE_BOUNDS = {
  length: { max: 480, min: 40 },
  thickness: { max: 48, min: 4 },
}

/**
 * W | H of the bar for the Layout group. Lying at the top or bottom, W is
 * its length; standing at the left or right, H is. The spec keeps length
 * and thickness, so a moved scale keeps its shape.
 * @param scale Continuous color scale with its position and size.
 * @param onChange Saves the changed scale.
 * @returns Box with width, height, bounds and unit of the bar.
 */
function createSizeBox(
  scale: ContinuousColorScale,
  onChange: (value: ContinuousColorScale) => void,
): LayoutBox {
  const isVertical = getSideOrientation(scale.layout.position) === 'vertical'
  const { length, thickness } = scale.size
  return {
    bounds: isVertical
      ? { height: SIZE_BOUNDS.length, width: SIZE_BOUNDS.thickness }
      : { height: SIZE_BOUNDS.thickness, width: SIZE_BOUNDS.length },
    unit: 'px',
    unitName: 'pixels',
    value: isVertical
      ? { height: length, width: thickness }
      : { height: thickness, width: length },
    onChange: ({ height, width }) => {
      const along = isVertical ? height : width
      const across = isVertical ? width : height
      onChange({
        ...scale,
        size: { length: along ?? length, thickness: across ?? thickness },
      })
    },
  }
}

/**
 * Groups of the continuous color scale: where it sits and its surface,
 * then title, labels and ticks with the groups of an axis. Its direction
 * follows from the position, and its colors and range are part of the
 * data color of the marks. Whether it shows is the eye in the popover
 * header.
 */
function ColorScaleWidget({
  defaultTitle,
  value,
  onChange,
}: ColorScaleWidgetProps) {
  return (
    <>
      <FormatWidget title="Position">
        <PositionControls
          label="Color scale"
          positions={positionOptions}
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </FormatWidget>
      <FormatWidget title="Layout">
        <LayoutControls
          box={createSizeBox(value, onChange)}
          label="Color scale"
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
        />
      </FormatWidget>
      <SurfaceControls
        label="Color scale"
        value={value.surface}
        onChange={(key, property) => {
          onChange({ ...value, surface: { ...value.surface, [key]: property } })
        }}
      />
      <AxisWidget
        defaultTitle={defaultTitle}
        label="Color scale"
        part="title"
        value={value}
        onChange={onChange}
      />
      <FormatWidget
        title="Labels"
        visibility={{
          visible: value.labels.visible,
          onChange: (visible) => {
            onChange({ ...value, labels: { ...value.labels, visible } })
          },
        }}
      >
        <AxisWidget
          label="Color scale"
          part="labels"
          value={value}
          onChange={onChange}
        />
      </FormatWidget>
      <StrokeWidget
        label="Color scale ticks"
        maxWidth={4}
        title="Ticks"
        value={value.ticks}
        onChange={(ticks) => onChange({ ...value, ticks })}
      />
    </>
  )
}

export default ColorScaleWidget
