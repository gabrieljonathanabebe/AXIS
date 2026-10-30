import { Blend, Minus, MoveHorizontal } from 'lucide-react'

import ColorSwatch from './ColorSwatch'
import IconButton from './IconButton'
import ScrubbableNumber from './ScrubbableNumber'

import type { GradientStop } from '../paint'
import type { ColorPreset } from './colorPresets'

// ===== TYPES =================================================================
type GradientStopsControlProps = {
  label: string
  presets: ColorPreset[]
  stops: GradientStop[]
  onChange: (stops: GradientStop[]) => void
}

// ===== CONSTANTS =============================================================
/** Fewest stops a gradient keeps: its start and its end. */
const MIN_GRADIENT_STOPS = 2

// ===== COMPONENT =============================================================
/**
 * Stop list of a gradient behind the gear of its paint: per stop its
 * swatch, position and opacity in percent and a minus; the plus in the
 * header of the popover adds a stop. Rows keep the order the stops were
 * added in, so a row does not jump while its position is scrubbed.
 * @param props Name of the paint, swatches, stops and their handler.
 */
function GradientStopsControl({
  label,
  presets,
  stops,
  onChange,
}: GradientStopsControlProps) {
  // ===== FUNCTIONS ===========================================================
  /**
   * Saves changed fields of one stop; the other stops stay.
   * @param index Row of the stop.
   * @param changes Changed fields, e.g. its position.
   */
  function updateStop(index: number, changes: Partial<GradientStop>): void {
    onChange(
      stops.map((stop, stopIndex) => {
        return stopIndex === index ? { ...stop, ...changes } : stop
      }),
    )
  }

  /**
   * Removes one stop; a gradient keeps at least its start and end.
   * @param index Row of the stop.
   */
  function removeStop(index: number): void {
    onChange(stops.filter((_, stopIndex) => stopIndex !== index))
  }

  // ===== JSX RETURN ==========================================================
  return (
    <div className="gradient-stops">
      {stops.map((stop, index) => {
        const stopLabel = `${label} stop ${index + 1}`
        return (
          <div className="gradient-stop" key={index}>
            <ColorSwatch
              label={`${stopLabel} color`}
              presets={presets}
              value={stop.color}
              onChange={(color) => updateStop(index, { color })}
            />
            <ScrubbableNumber
              icon={<MoveHorizontal size={14} />}
              label={`${stopLabel} position`}
              max={100}
              min={0}
              step={1}
              unit="%"
              value={Math.round(stop.position * 100)}
              onValueChange={(percent) => {
                updateStop(index, { position: percent / 100 })
              }}
            />
            <ScrubbableNumber
              icon={<Blend size={14} />}
              label={`${stopLabel} opacity`}
              max={100}
              min={0}
              step={1}
              unit="%"
              value={Math.round(stop.opacity * 100)}
              onValueChange={(percent) => {
                updateStop(index, { opacity: percent / 100 })
              }}
            />
            <IconButton
              disabled={stops.length <= MIN_GRADIENT_STOPS}
              label={`Remove ${stopLabel}`}
              size="sm"
              variant="ghost"
              onClick={() => removeStop(index)}
            >
              <Minus size={14} />
            </IconButton>
          </div>
        )
      })}
    </div>
  )
}

export default GradientStopsControl
