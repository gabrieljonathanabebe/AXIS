import { Mouse, PanelBottom } from 'lucide-react'

import Button from '../../shared/ui/Button'
import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'

import type { ChartInteractionSpec } from '../types'

type ZoomWidgetProps = {
  value: ChartInteractionSpec['zoom']
  onChange: (value: ChartInteractionSpec['zoom']) => void
}

/**
 * Zoom group of the X axis: zoom by scrolling inside the plot and by a
 * slider below it, as toggles with icon and word, since both are behavior
 * and no visible part. With both off, the chart has no zoom.
 */
function ZoomWidget({ value, onChange }: ZoomWidgetProps) {
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
    <FormatWidget title="Zoom">
      <ControlRow>
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
      </ControlRow>
    </FormatWidget>
  )
}

export default ZoomWidget
