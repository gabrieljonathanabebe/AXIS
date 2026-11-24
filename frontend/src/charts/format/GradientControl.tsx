import { getGradientStopsCss, getSortedStops } from '@/shared/paint'
import ColorEditor from '@/shared/ui/containers/ColorEditor'
import {
  getPresetFill,
  getSwatchColor,
} from '@/shared/ui/controls/colorPresets'
import Popover from '@/shared/ui/primitives/Popover'
import SwatchButton from '@/shared/ui/primitives/SwatchButton'

import type { CSSProperties, ReactNode } from 'react'
import type { ColorValue } from '@/shared/colorValue'
import type { GradientStop } from '@/shared/paint'
import type { ColorPreset } from '@/shared/ui/controls/colorPresets'

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
 * Control of a gradient: the colors of its first and last stop with the
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

  /**
   * Swatch of one end; it opens the color picker for its stop.
   * @param stop First or last stop of the gradient.
   * @param end Name of the end in the labels, e.g. "start".
   * @returns Popover with the swatch as trigger.
   */
  function renderSwatch(stop: GradientStop, end: string): ReactNode {
    const swatchLabel = `${label} ${end} color`
    return (
      <Popover
        label={`${swatchLabel} color`}
        renderTrigger={(triggerProps) => (
          <SwatchButton
            {...triggerProps}
            color={getSwatchColor(stop.color)}
            fill={getPresetFill(stop.color, presets)}
            label={swatchLabel}
          />
        )}
        variant="editor"
      >
        <ColorEditor
          label={swatchLabel}
          presets={presets}
          value={stop.color}
          onChange={(color) => setStopColor(stop, color)}
        />
      </Popover>
    )
  }

  // ===== JSX RETURN ==========================================================
  return (
    <div
      className="control-frame gradient-control"
      aria-label={label}
      style={style}
    >
      {renderSwatch(firstStop, 'start')}
      <div className="gradient-control-preview" aria-hidden="true" />
      {renderSwatch(lastStop, 'end')}
    </div>
  )
}

export default GradientControl
