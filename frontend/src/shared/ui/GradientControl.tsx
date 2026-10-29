import { getGradientStopsCss, getSortedStops } from '../paint'
import ColorControl from './ColorControl'
import { DATA_COLOR_PRESETS } from './colorPresets'

import type { CSSProperties } from 'react'
import type { ColorValue } from '../colorValue'
import type { GradientStop } from '../paint'
import type { ColorPreset } from './ColorControl'

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
  presets = DATA_COLOR_PRESETS,
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
      <ColorControl
        label={`${label} start color`}
        presets={presets}
        value={firstStop.color}
        variant="compact"
        onChange={(color) => setStopColor(firstStop, color)}
      />
      <div className="gradient-control-preview" aria-hidden="true" />
      <ColorControl
        label={`${label} end color`}
        presets={presets}
        value={lastStop.color}
        variant="compact"
        onChange={(color) => setStopColor(lastStop, color)}
      />
    </div>
  )
}

export default GradientControl
