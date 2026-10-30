import { ArrowLeftToLine, ArrowRightToLine, Blend, Radius } from 'lucide-react'

import {
  addGradientStop,
  changePaintType,
  changeSeriesPaintType,
  getPaintType,
  hasOwnColor,
} from '../paint'
import ColorPicker from './ColorPicker'
import ControlRow from './ControlRow'
import DetailsPopover from './DetailsPopover'
import FormatWidget from './FormatWidget'
import FormatWidgetAction from './FormatWidgetAction'
import GradientStopsControl from './GradientStopsControl'
import PaintField from './PaintField'
import RotationDial from './RotationDial'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'

import type { ReactNode } from 'react'
import type { Fill } from '../fill'
import type { Paint, PaintType, SeriesPaint } from '../paint'
import type { ColorPreset } from './colorPresets'

// ===== TYPES =================================================================
type PaintControlProps<TValue extends Fill<Paint | SeriesPaint>> = {
  actions?: ReactNode
  details?: ReactNode
  label: string
  open?: boolean
  paintTypes?: PaintType[]
  presets?: ColorPreset[]
  seriesColor?: ReactNode
  value: TValue
  onChange: (value: TValue) => void
  onOpenChange?: (open: boolean) => void
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

/** Reach of a radial center in percent; it may lie outside its area. */
const RADIAL_CENTER_RANGE = { max: 150, min: -50 }

/** Largest radius of a radial gradient in percent of its area. */
const MAX_RADIAL_RADIUS = 200

// ===== COMPONENT =============================================================
/**
 * Row of the paint of a fill or stroke: its field and the opacity of the
 * whole paint. An own color shows a `PaintField` whose swatch opens the
 * editor: type with the angle of a linear gradient, then the color, or
 * center and radius of a radial gradient and its stops. A paint in the
 * series color shows `seriesColor`, the field of the data color, and its
 * editor, type and the ends of a fade, behind a gear in the header of
 * the format widget; given `details` take that gear. With only one of
 * `paintTypes` there is no type to pick. `actions` end the row, e.g. a
 * minus in a list; `open` and `onOpenChange` let a list open the editor
 * of an own color, e.g. right after adding the fill.
 * @param props Fill or stroke, swatches, types, series color, actions,
 *   open state and handlers.
 */
function PaintControl<TValue extends Fill<Paint | SeriesPaint>>({
  actions,
  details,
  label,
  open,
  paintTypes = ALL_PAINT_TYPES,
  presets = [],
  seriesColor,
  value,
  onChange,
  onOpenChange,
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
   * Type buttons with icon and label, the first row of the editor across
   * its whole width; nothing when the place offers a single type.
   * @returns The type row or nothing.
   */
  function getTypeRow(): ReactNode {
    if (typeOptions.length < 2) {
      return null
    }
    return (
      <ControlRow>
        <SegmentedControl
          label={`${label} paint type`}
          options={typeOptions}
          renderOption={(option) => (
            <span className="option-content">
              <span
                aria-hidden="true"
                className={`paint-type-preview is-${option.value}`}
              />
              <span className="option-content-label">{option.label}</span>
            </span>
          )}
          value={getPaintType(paint)}
          onValueChange={setPaintType}
        />
      </ControlRow>
    )
  }

  /**
   * Editor of the paint: the type row, then the color of an own solid
   * paint, the angle of a linear or center and radius of a radial
   * gradient and its stops with a plus that adds one, or the start and
   * end opacity of a fade.
   * @returns The rows of the editor, or nothing when there is nothing to
   *   pick, e.g. a solid paint with a single type.
   */
  function getEditor(): ReactNode {
    const typeRow = getTypeRow()
    if (paint.kind === 'solid') {
      if (!typeRow || !hasOwnColor(paint)) {
        return typeRow
      }
      return (
        <>
          {typeRow}
          <FormatWidget title="Color">
            <ColorPicker
              label={label}
              presets={presets}
              value={paint.color}
              onChange={(color) => setPaint({ ...paint, color })}
            />
          </FormatWidget>
        </>
      )
    }
    if (paint.kind === 'fade') {
      return (
        <>
          {typeRow}
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
        </>
      )
    }
    return (
      <>
        {typeRow}
        {paint.type === 'linear' ? (
          <FormatWidget title="Angle">
            <ControlRow>
              <RotationDial
                label={`${label} angle`}
                max={MAX_GRADIENT_ANGLE}
                min={-MAX_GRADIENT_ANGLE}
                value={paint.angle}
                onValueChange={(angle) => setPaint({ ...paint, angle })}
              />
            </ControlRow>
          </FormatWidget>
        ) : (
          <FormatWidget title="Shape">
            <ControlRow>
              <ScrubbableNumber
                icon="X"
                label={`${label} center x`}
                max={RADIAL_CENTER_RANGE.max}
                min={RADIAL_CENTER_RANGE.min}
                step={1}
                unit="%"
                value={Math.round(paint.centerX * 100)}
                onValueChange={(percent) => {
                  setPaint({ ...paint, centerX: percent / 100 })
                }}
              />
              <ScrubbableNumber
                icon="Y"
                label={`${label} center y`}
                max={RADIAL_CENTER_RANGE.max}
                min={RADIAL_CENTER_RANGE.min}
                step={1}
                unit="%"
                value={Math.round(paint.centerY * 100)}
                onValueChange={(percent) => {
                  setPaint({ ...paint, centerY: percent / 100 })
                }}
              />
            </ControlRow>
            <ControlRow>
              <ScrubbableNumber
                icon={<Radius size={14} />}
                label={`${label} radius`}
                max={MAX_RADIAL_RADIUS}
                min={1}
                step={1}
                unit="%"
                value={Math.round(paint.radius * 100)}
                onValueChange={(percent) => {
                  setPaint({ ...paint, radius: percent / 100 })
                }}
              />
            </ControlRow>
          </FormatWidget>
        )}
        <FormatWidget
          title="Stops"
          onAdd={() => {
            setPaint({ ...paint, stops: addGradientStop(paint.stops) })
          }}
        >
          <GradientStopsControl
            label={label}
            presets={presets}
            stops={paint.stops}
            onChange={(stops) => setPaint({ ...paint, stops })}
          />
        </FormatWidget>
      </>
    )
  }

  /**
   * Field left of the opacity: for an own color a paint field with the
   * editor behind its swatch, else the field of the series color.
   * @returns The field of the paint.
   */
  function getField(): ReactNode {
    if (!hasOwnColor(paint)) {
      return seriesColor
    }
    return (
      <PaintField
        label={label}
        open={open}
        presets={presets}
        value={paint}
        onChange={setPaint}
        onOpenChange={onOpenChange}
      >
        {getEditor()}
      </PaintField>
    )
  }

  /**
   * Gear for the header of the format widget: the given details, else the
   * editor of a paint in the series color, whose field cannot open it.
   * @returns The gear with its popover, or nothing for an own color.
   */
  function getDetails(): ReactNode {
    if (details || hasOwnColor(paint)) {
      return details
    }
    const editor = getEditor()
    return editor ? (
      <DetailsPopover label="Color" size="xs">
        {editor}
      </DetailsPopover>
    ) : null
  }

  // ===== JSX RETURN ==========================================================
  return (
    <ControlRow actions={actions}>
      {getField()}
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
  )
}

export default PaintControl
