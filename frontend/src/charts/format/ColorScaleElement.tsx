import { getSideOrientation } from '@/shared/layout'
import { getVisibility } from '@/shared/ui/groups/getVisibility'
import Group from '@/shared/ui/groups/Group'
import LayoutGroup from '@/shared/ui/groups/LayoutGroup'
import PositionGroup from '@/shared/ui/groups/PositionGroup'
import StrokeGroup from '@/shared/ui/groups/StrokeGroup'
import SurfaceControls from '@/shared/ui/groups/SurfaceControls'
import AxisLabelsGroup from './AxisLabelsGroup'
import AxisTitleGroup from './AxisTitleGroup'

import type { ColorScaleAppearance } from '@/charts/types'
import type { LayoutBox } from '@/shared/ui/rows/BoxRow'

type ContinuousColorScale = ColorScaleAppearance['continuous']

type ColorScaleElementProps = {
  defaultTitle: string
  value: ContinuousColorScale
  onChange: (value: ContinuousColorScale) => void
}

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
  const isVertical = getSideOrientation(scale.position.side) === 'vertical'
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
 * Groups of the continuous color scale: where it sits, its size, the
 * corners and border of its bar, then title, labels and ticks with the
 * groups of an axis. Its direction follows from the position, and its
 * colors and range are part of the data color of the marks. Whether it
 * shows is the eye in the popover header.
 */
function ColorScaleElement({
  defaultTitle,
  value,
  onChange,
}: ColorScaleElementProps) {
  /** Saves the changed labels of the scale, e.g. their visibility. */
  function setLabels(labels: ContinuousColorScale['labels']): void {
    onChange({ ...value, labels })
  }
  return (
    <>
      <Group title="Position">
        <PositionGroup
          label="Color scale"
          value={value.position}
          onChange={(position) => onChange({ ...value, position })}
        />
      </Group>
      <LayoutGroup box={createSizeBox(value, onChange)} label="Color scale" />
      <SurfaceControls
        label="Color scale"
        value={value.bar}
        onChange={(key, property) => {
          onChange({ ...value, bar: { ...value.bar, [key]: property } })
        }}
      />
      <AxisTitleGroup
        defaultTitle={defaultTitle}
        group="colorScaleTitle"
        label="Color scale"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
      />
      <AxisLabelsGroup
        group="colorScaleLabels"
        label="Color scale"
        value={value.labels}
        visibility={getVisibility(value.labels, setLabels)}
        onChange={setLabels}
      />
      <StrokeGroup
        label="Color scale ticks"
        maxWidth={4}
        title="Ticks"
        value={value.ticks}
        onChange={(ticks) => onChange({ ...value, ticks })}
      />
    </>
  )
}

export default ColorScaleElement
