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

/** Reach of a radial center as a share of its area; it may lie outside. */
const RADIAL_CENTER_RANGE = { max: 1.5, min: -0.5 }

/** Largest radius of a radial gradient as a share of its area. */
const MAX_RADIAL_RADIUS = 2

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
            <span className="option-label">
              <span
                aria-hidden="true"
                className={`paint-type-preview is-${option.value}`}
              />
              <span className="option-label-text">{option.label}</span>
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
            unit="fraction"
            value={paint.startOpacity}
            onValueChange={(startOpacity) => {
              setPaint({ ...paint, startOpacity })
            }}
          />
          <NumberControl
            icon={<ArrowRightToLine size={14} />}
            label={`${label} end opacity`}
            unit="fraction"
            value={paint.endOpacity}
            onValueChange={(endOpacity) => {
              setPaint({ ...paint, endOpacity })
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
            <NumberControl
              label={`${label} angle`}
              max={MAX_GRADIENT_ANGLE}
              min={-MAX_GRADIENT_ANGLE}
              unit="degree"
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
              unit="fraction"
              value={paint.centerX}
              onValueChange={(centerX) => {
                setPaint({ ...paint, centerX })
              }}
            />
            <NumberControl
              icon="Y"
              label={`${label} center y`}
              max={RADIAL_CENTER_RANGE.max}
              min={RADIAL_CENTER_RANGE.min}
              unit="fraction"
              value={paint.centerY}
              onValueChange={(centerY) => {
                setPaint({ ...paint, centerY })
              }}
            />
          </Row>
          <Row>
            <NumberControl
              icon={<Radius size={14} />}
              label={`${label} radius`}
              max={MAX_RADIAL_RADIUS}
              min={0.01}
              unit="fraction"
              value={paint.radius}
              onValueChange={(radius) => {
                setPaint({ ...paint, radius })
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
