import { Blend } from 'lucide-react'

import { hasOwnColor, hasPaintEditor, PAINT_TYPES } from '@/shared/paint'
import DetailsPopover from './DetailsPopover'
import PaintEditor from './PaintEditor'
import PaintField from './PaintField'
import Row from './Row'
import ScrubbableNumber from './ScrubbableNumber'

import type { ReactNode } from 'react'
import type { Fill } from '@/shared/fill'
import type { Paint, PaintType, SeriesPaint } from '@/shared/paint'
import type { ColorPreset } from './colorPresets'

// ===== TYPES =================================================================
type PaintControlProps<TValue extends Fill<Paint | SeriesPaint>> = {
  action?: ReactNode
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

// ===== COMPONENT =============================================================
/**
 * Row of the paint of a fill or stroke: its field and the opacity of the
 * whole paint. An own color shows a `PaintField` whose swatch opens the
 * `PaintEditor`; a paint in the series color shows `seriesColor`, the
 * field of the data color, and its editor behind a gear in the icon
 * column of the row; given `details` take that gear. With only one of
 * `paintTypes` there is no type to pick. `action` takes the icon column
 * instead, e.g. a minus in a list; `open` and `onOpenChange` let a list
 * open the editor of an own color, e.g. right after adding the fill.
 * @param props Fill or stroke, swatches, types, series color, action,
 *   open state and handlers.
 */
function PaintControl<TValue extends Fill<Paint | SeriesPaint>>({
  action,
  details,
  label,
  open,
  paintTypes = PAINT_TYPES,
  presets = [],
  seriesColor,
  value,
  onChange,
  onOpenChange,
}: PaintControlProps<TValue>) {
  // ===== LOCAL CONSTANTS =====================================================
  const { paint } = value
  const editor = hasPaintEditor(paint, paintTypes) ? (
    <PaintEditor
      label={label}
      paintTypes={paintTypes}
      presets={presets}
      value={paint}
      onChange={setPaint}
    />
  ) : null

  // ===== FUNCTIONS ===========================================================
  /**
   * Saves a changed paint; the opacity and the other fields stay.
   * @param nextPaint Paint of the same kind, own or in the series color.
   */
  function setPaint(nextPaint: Paint | SeriesPaint): void {
    onChange({ ...value, paint: nextPaint })
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
        {editor}
      </PaintField>
    )
  }

  /**
   * Gear for the icon column of the row: the given details, else the
   * editor of a paint in the series color, whose field cannot open it.
   * @returns The gear with its popover, or nothing for an own color.
   */
  function getDetails(): ReactNode {
    if (details || hasOwnColor(paint)) {
      return details
    }
    return editor ? (
      <DetailsPopover label="Color" size="xs">
        {editor}
      </DetailsPopover>
    ) : null
  }

  // ===== JSX RETURN ==========================================================
  return (
    <Row action={action ?? getDetails()}>
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
    </Row>
  )
}

export default PaintControl
