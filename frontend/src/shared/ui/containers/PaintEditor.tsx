import { ArrowLeftToLine, ArrowRightToLine, Radius } from 'lucide-react'

import {
  addGradientStop,
  changePaintType,
  changeSeriesPaintType,
  getPaintType,
  hasOwnColor,
  PAINT_TYPE_LABELS,
} from '@/shared/paint'
import NumberControl from '../controls/NumberControl'
import RotationDial from '../controls/RotationDial'
import SegmentedControl from '../controls/SegmentedControl'
import Group from '../groups/Group'
import GradientStopRow from '../rows/GradientStopRow'
import Row from '../rows/Row'
import ColorEditor from './ColorEditor'

import type { ReactNode } from 'react'
import type { Paint, PaintType, SeriesPaint } from '@/shared/paint'
import type { ColorPreset } from '../controls/colorPresets'

// ===== TYPES =================================================================
type PaintEditorProps = {
  label: string
  paintTypes: PaintType[]
  presets: ColorPreset[]
  value: Paint | SeriesPaint
  onChange: (value: Paint | SeriesPaint) => void
}

// ===== CONSTANTS =============================================================
/** Widest turn of a gradient in either direction, a half turn. */
const MAX_GRADIENT_ANGLE = 180

/** Reach of a radial center in percent; it may lie outside its area. */
const RADIAL_CENTER_RANGE = { max: 150, min: -50 }

/** Largest radius of a radial gradient in percent of its area. */
const MAX_RADIAL_RADIUS = 200

/** Fewest stops a gradient keeps: its start and its end. */
const MIN_GRADIENT_STOPS = 2

// ===== COMPONENT =============================================================
/**
 * Editor of a paint behind its swatch or gear: the type buttons, then the
 * color of an own solid paint, the angle of a linear or center and radius
 * of a radial gradient and its stops with a plus that adds one, or the
 * start and end opacity of a fade. Renders nothing when there is nothing
 * to pick, e.g. a solid paint with a single type (`hasPaintEditor`).
 * @param props Name, offered types, swatches, paint and handler.
 */
function PaintEditor({
  label,
  paintTypes,
  presets,
  value: paint,
  onChange: setPaint,
}: PaintEditorProps) {
  // ===== LOCAL CONSTANTS =====================================================
  const typeOptions = paintTypes.map((type) => {
    return { label: PAINT_TYPE_LABELS[type], value: type }
  })
  const typeRow = getTypeRow()

  // ===== FUNCTIONS ===========================================================
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
      <Row layout="wide">
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
      </Row>
    )
  }

  // ===== JSX RETURN ==========================================================
  if (paint.kind === 'solid') {
    if (!typeRow || !hasOwnColor(paint)) {
      return typeRow
    }
    return (
      <>
        {typeRow}
        <Group title="Color">
          <ColorEditor
            label={label}
            presets={presets}
            value={paint.color}
            onChange={(color) => setPaint({ ...paint, color })}
          />
        </Group>
      </>
    )
  }
  if (paint.kind === 'fade') {
    return (
      <>
        {typeRow}
        <Row>
          <NumberControl
            icon={<ArrowLeftToLine size={14} />}
            label={`${label} start opacity`}
            max={100}
            min={0}
            unit="%"
            value={Math.round(paint.startOpacity * 100)}
            onValueChange={(percent) => {
              setPaint({ ...paint, startOpacity: percent / 100 })
            }}
          />
          <NumberControl
            icon={<ArrowRightToLine size={14} />}
            label={`${label} end opacity`}
            max={100}
            min={0}
            unit="%"
            value={Math.round(paint.endOpacity * 100)}
            onValueChange={(percent) => {
              setPaint({ ...paint, endOpacity: percent / 100 })
            }}
          />
        </Row>
      </>
    )
  }
  return (
    <>
      {typeRow}
      {paint.type === 'linear' ? (
        <Group title="Angle">
          <Row>
            <RotationDial
              label={`${label} angle`}
              max={MAX_GRADIENT_ANGLE}
              min={-MAX_GRADIENT_ANGLE}
              value={paint.angle}
              onValueChange={(angle) => setPaint({ ...paint, angle })}
            />
          </Row>
        </Group>
      ) : (
        <Group title="Shape">
          <Row>
            <NumberControl
              icon="X"
              label={`${label} center x`}
              max={RADIAL_CENTER_RANGE.max}
              min={RADIAL_CENTER_RANGE.min}
              unit="%"
              value={Math.round(paint.centerX * 100)}
              onValueChange={(percent) => {
                setPaint({ ...paint, centerX: percent / 100 })
              }}
            />
            <NumberControl
              icon="Y"
              label={`${label} center y`}
              max={RADIAL_CENTER_RANGE.max}
              min={RADIAL_CENTER_RANGE.min}
              unit="%"
              value={Math.round(paint.centerY * 100)}
              onValueChange={(percent) => {
                setPaint({ ...paint, centerY: percent / 100 })
              }}
            />
          </Row>
          <Row>
            <NumberControl
              icon={<Radius size={14} />}
              label={`${label} radius`}
              max={MAX_RADIAL_RADIUS}
              min={1}
              unit="%"
              value={Math.round(paint.radius * 100)}
              onValueChange={(percent) => {
                setPaint({ ...paint, radius: percent / 100 })
              }}
            />
          </Row>
        </Group>
      )}
      <Group
        title="Stops"
        onAdd={() => {
          setPaint({ ...paint, stops: addGradientStop(paint.stops) })
        }}
      >
        {paint.stops.map((stop, index) => (
          <GradientStopRow
            // Stops carry no id; rows keep the order the stops were added
            // in, so a row does not jump while its position is scrubbed.
            key={index}
            isRemovable={paint.stops.length > MIN_GRADIENT_STOPS}
            label={`${label} stop ${index + 1}`}
            presets={presets}
            value={stop}
            onChange={(nextStop) => {
              setPaint({ ...paint, stops: paint.stops.with(index, nextStop) })
            }}
            onRemove={() => {
              setPaint({ ...paint, stops: paint.stops.toSpliced(index, 1) })
            }}
          />
        ))}
      </Group>
    </>
  )
}

export default PaintEditor
