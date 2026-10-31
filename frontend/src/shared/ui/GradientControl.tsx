import { getGradientStopsCss, getSortedStops } from '../paint'
import ColorSwatch from './ColorSwatch'

import type { CSSProperties } from 'react'
import type { ColorValue } from '../colorValue'
import type { GradientStop } from '../paint'
import type { ColorPreset } from './colorPresets'

// ===== TYPES =================================================================
type GradientControlProps = {
  label: string
  presets?: ColorPreset[]
  stops: GradientStop[]
  onChange: (stops: GradientStop[]) => void
}

type GradientStyle = CSSProperties & {
  '--gradient-stops': string
}

// ===== COMPONENT =============================================================
/**
 * Field of a gradient: the colors of its first and last stop with the
 * gradient between them, e.g. of a continuous data color or a fill. Each
 * end opens the color picker; stops in between show in the preview.
 * @param props Name, swatches, stops and their handler.
 */
function GradientControl({
  label,
  presets = [],
  stops,
  onChange,
}: GradientControlProps) {
  // ===== LOCAL CONSTANTS =====================================================
  const sortedStops = getSortedStops(stops)
  const firstStop = sortedStops[0]
  const lastStop = sortedStops[sortedStops.length - 1]
  const style: GradientStyle = {
    '--gradient-stops': getGradientStopsCss(stops),
  }

  // ===== FUNCTIONS ===========================================================
  /**
   * Changes the color of one stop; the other stops stay.
   * @param stop Stop whose color changes.
   * @param color New color of the stop.
   */
  function setStopColor(stop: GradientStop, color: ColorValue): void {
    onChange(
      stops.map((current) =>
        current === stop ? { ...current, color } : current,
      ),
    )
  }

  // ===== JSX RETURN ==========================================================
  return (
    <div className="field gradient-control" aria-label={label} style={style}>
      <ColorSwatch
        label={`${label} start color`}
        presets={presets}
        value={firstStop.color}
        onChange={(color) => setStopColor(firstStop, color)}
      />
      <div className="gradient-control-preview" aria-hidden="true" />
      <ColorSwatch
        label={`${label} end color`}
        presets={presets}
        value={lastStop.color}
        onChange={(color) => setStopColor(lastStop, color)}
      />
    </div>
  )
}

export default GradientControl
