import { ArrowLeftToLine, ArrowRightToLine, Blend, Plus } from 'lucide-react'

import {
  addGradientStop,
  changePaintType,
  changeSeriesPaintType,
  getPaintType,
  hasOwnColor,
} from '../paint'
import ColorField from './ColorField'
import ControlRow from './ControlRow'
import DetailsPopover from './DetailsPopover'
import FormatWidgetAction from './FormatWidgetAction'
import GradientControl from './GradientControl'
import GradientStopsControl from './GradientStopsControl'
import IconButton from './IconButton'
import RotationDial from './RotationDial'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'

import type { ReactNode } from 'react'
import type { Fill } from '../fill'
import type { Paint, PaintType, SeriesPaint } from '../paint'
import type { ColorPreset } from './ColorControl'

// ===== TYPES =================================================================
type PaintControlProps<TValue extends Fill<Paint | SeriesPaint>> = {
  details?: ReactNode
  label: string
  paintTypes?: PaintType[]
  presets?: ColorPreset[]
  seriesColor?: ReactNode
  value: TValue
  onChange: (value: TValue) => void
}

// ===== CONSTANTS =============================================================
const paintTypeOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Linear', value: 'linear' },
  { label: 'Radial', value: 'radial' },
] satisfies { label: string; value: PaintType }[]

/** Types a paint offers unless its place limits them. */
const ALL_PAINT_TYPES: PaintType[] = ['solid', 'linear', 'radial']

/** Widest turn of a gradient in either direction, a half turn. */
const MAX_GRADIENT_ANGLE = 180

// ===== COMPONENT =============================================================
/**
 * Rows of the paint of a fill or stroke: its type with the angle of a
 * linear gradient, then the color field and the opacity of the whole
 * paint; its gear sits in the header of the format widget. An own color
 * shows a `ColorField` or, as a gradient, a `GradientControl` with its
 * stops behind the gear; a paint in the series color shows `seriesColor`,
 * the field of the data color, if given, and behind the gear the ends of
 * its fade. Given `details` take the gear. With only one of `paintTypes`
 * the type row is hidden.
 * @param props Fill or stroke, swatches, types, series color and handler.
 */
function PaintControl<TValue extends Fill<Paint | SeriesPaint>>({
  details,
  label,
  paintTypes = ALL_PAINT_TYPES,
  presets = [],
  seriesColor,
  value,
  onChange,
}: PaintControlProps<TValue>) {
  // ===== LOCAL CONSTANTS =====================================================
  const { paint } = value
  const typeOptions = paintTypeOptions.filter((option) => {
    return paintTypes.includes(option.value)
  })

  // ===== FUNCTIONS ===========================================================
  /**
   * Saves a changed paint; the opacity and the other fields stay.
   * @param nextPaint Paint of the same kind, own or in the series color.
   */
  function setPaint(nextPaint: Paint | SeriesPaint): void {
    onChange({ ...value, paint: nextPaint })
  }

  /**
   * Switches the paint to another type; an own color stays own, a series
   * paint stays in the series color.
   * @param type Chosen type.
   */
  function setPaintType(type: PaintType): void {
    setPaint(
      hasOwnColor(paint)
        ? changePaintType(paint, type)
        : changeSeriesPaintType(paint, type),
    )
  }

  /**
   * Field left of the opacity: the own color, the ends of the gradient or
   * the field of the series color.
   * @returns The field of the paint.
   */
  function getColorField(): ReactNode {
    if (!hasOwnColor(paint)) {
      return seriesColor
    }
    if (paint.kind === 'solid') {
      return (
        <ColorField
          label={label}
          presets={presets}
          value={paint.color}
          onChange={(color) => setPaint({ ...paint, color })}
        />
      )
    }
    return (
      <GradientControl
        label={label}
        presets={presets}
        stops={paint.stops}
        onChange={(stops) => setPaint({ ...paint, stops })}
      />
    )
  }

  /**
   * Gear of the paint for the header of its format widget: the given
   * details, else the stops of a gradient with a plus that adds one, or
   * the start and end opacity of a fade.
   * @returns The gear with its popover, or nothing for a solid paint.
   */
  function getDetails(): ReactNode {
    if (details || paint.kind === 'solid') {
      return details
    }
    if (paint.kind === 'gradient') {
      return (
        <DetailsPopover
          actions={
            <IconButton
              label={`Add ${label} stop`}
              size="xs"
              variant="ghost"
              onClick={() => {
                setPaint({ ...paint, stops: addGradientStop(paint.stops) })
              }}
            >
              <Plus size={14} />
            </IconButton>
          }
          label="Gradient"
          size="xs"
        >
          <GradientStopsControl
            label={label}
            presets={presets}
            stops={paint.stops}
            onChange={(stops) => setPaint({ ...paint, stops })}
          />
        </DetailsPopover>
      )
    }
    return (
      <DetailsPopover label="Fade" size="xs">
        <ControlRow>
          <ScrubbableNumber
            icon={<ArrowLeftToLine size={14} />}
            label={`${label} start opacity`}
            max={100}
            min={0}
            step={1}
            unit="%"
            value={Math.round(paint.startOpacity * 100)}
            onValueChange={(percent) => {
              setPaint({ ...paint, startOpacity: percent / 100 })
            }}
          />
          <ScrubbableNumber
            icon={<ArrowRightToLine size={14} />}
            label={`${label} end opacity`}
            max={100}
            min={0}
            step={1}
            unit="%"
            value={Math.round(paint.endOpacity * 100)}
            onValueChange={(percent) => {
              setPaint({ ...paint, endOpacity: percent / 100 })
            }}
          />
        </ControlRow>
      </DetailsPopover>
    )
  }

  // ===== JSX RETURN ==========================================================
  return (
    <>
      {typeOptions.length > 1 ? (
        <ControlRow>
          <SegmentedControl
            label={`${label} paint type`}
            options={typeOptions}
            renderOption={(option) => (
              <span
                aria-hidden="true"
                className={`paint-type-preview is-${option.value}`}
              />
            )}
            value={getPaintType(paint)}
            onValueChange={setPaintType}
          />
          {paint.kind !== 'solid' && paint.type === 'linear' ? (
            <RotationDial
              label={`${label} angle`}
              max={MAX_GRADIENT_ANGLE}
              min={-MAX_GRADIENT_ANGLE}
              value={paint.angle}
              onValueChange={(angle) => setPaint({ ...paint, angle })}
            />
          ) : null}
        </ControlRow>
      ) : null}
      <ControlRow>
        {getColorField()}
        <ScrubbableNumber
          icon={<Blend size={14} />}
          label={`${label} opacity`}
          max={100}
          min={5}
          step={1}
          unit="%"
          value={Math.round(value.opacity * 100)}
          onValueChange={(percent) => {
            onChange({ ...value, opacity: percent / 100 })
          }}
        />
        <FormatWidgetAction>{getDetails()}</FormatWidgetAction>
      </ControlRow>
    </>
  )
}

export default PaintControl
