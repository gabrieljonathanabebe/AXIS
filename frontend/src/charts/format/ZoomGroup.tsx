import { Mouse, PanelBottom } from 'lucide-react'

import Group from '@/shared/ui/groups/Group'
import Button from '@/shared/ui/primitives/Button'
import Row from '@/shared/ui/rows/Row'

import type { ChartInteractionSpec } from '@/charts/types'

type ZoomGroupProps = {
  value: ChartInteractionSpec['zoom']
  onChange: (value: ChartInteractionSpec['zoom']) => void
}

/**
 * Zoom group of the X axis: zoom by scrolling inside the plot and by a
 * slider below it, as toggles with icon and word, since both are behavior
 * and no visible part. With both off, the chart has no zoom.
 */
function ZoomGroup({ value, onChange }: ZoomGroupProps) {
  const inside = value.enabled && value.inside
  const slider = value.enabled && value.slider
  /**
   * Saves which ways of zooming are on; the zoom is on while one of them is.
   * @param nextInside Zoom by mouse wheel or trackpad inside the plot.
   * @param nextSlider Zoom by a slider below the plot.
   */
  function changeZoom(nextInside: boolean, nextSlider: boolean): void {
    onChange({
      enabled: nextInside || nextSlider,
      inside: nextInside,
      slider: nextSlider,
    })
  }
  return (
    <Group title="Zoom">
      <Row>
        <Button
          aria-pressed={inside}
          isActive={inside}
          size="sm"
          title="Zoom with mouse wheel or trackpad, drag to pan"
          onClick={() => changeZoom(!inside, slider)}
        >
          <Mouse size={14} />
          Scroll
        </Button>
        <Button
          aria-pressed={slider}
          isActive={slider}
          size="sm"
          title="Show a zoom slider below the chart"
          onClick={() => changeZoom(inside, !slider)}
        >
          <PanelBottom size={14} />
          Slider
        </Button>
      </Row>
    </Group>
  )
}

export default ZoomGroup
