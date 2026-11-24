import { Blend } from 'lucide-react'

import { hasOwnColor, hasPaintEditor, PAINT_TYPES } from '@/shared/paint'
import PaintEditor from '../containers/PaintEditor'
import PaintControl from '../controls/PaintControl'
import ScrubbableNumber from '../controls/ScrubbableNumber'
import Row from './Row'

import type { ReactNode } from 'react'
import type { Fill } from '@/shared/fill'
import type { Paint, PaintType, SeriesPaint } from '@/shared/paint'
import type { ColorPreset } from '../controls/colorPresets'
import type { RowDetails, RowRemove } from './Row'

// ===== TYPES =================================================================
type PaintRowProps<TValue extends Fill<Paint | SeriesPaint>> = {
  details?: RowDetails
  label: string
  open?: boolean
  paintTypes?: PaintType[]
  presets?: ColorPreset[]
  remove?: RowRemove
  seriesColor?: ReactNode
  value: TValue
  onChange: (value: TValue) => void
  onOpenChange?: (open: boolean) => void
}

// ===== COMPONENT =============================================================
/**
 * Row of the paint of a fill or stroke: its field and the opacity of the
 * whole paint. An own color shows a `PaintControl` whose swatch opens the
 * `PaintEditor`; a paint in the series color shows `seriesColor`, the
 * control of the data color, and its editor behind a gear in the icon
 * column of the row; given `details` take that gear. With only one of
 * `paintTypes` there is no type to pick. `remove` puts a minus in the
 * icon column instead, e.g. in a list; `open` and `onOpenChange` let a
 * list open the editor of an own color, e.g. right after adding the fill.
 * @param props Fill or stroke, swatches, types, series color, minus,
 *   open state and handlers.
 */
function PaintRow<TValue extends Fill<Paint | SeriesPaint>>({
  details,
  label,
  open,
  paintTypes = PAINT_TYPES,
  presets = [],
  remove,
  seriesColor,
  value,
  onChange,
  onOpenChange,
}: PaintRowProps<TValue>) {
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
   * Control left of the opacity: for an own color a paint control with the
   * editor behind its swatch, else the control of the series color.
   * @returns The control of the paint.
   */
  function getControl(): ReactNode {
    if (!hasOwnColor(paint)) {
      return seriesColor
    }
    return (
      <PaintControl
        label={label}
        open={open}
        presets={presets}
        value={paint}
        onChange={setPaint}
        onOpenChange={onOpenChange}
      >
        {editor}
      </PaintControl>
    )
  }

  /**
   * Details behind the gear of the row: the given details, else the
   * editor of a paint in the series color, whose control cannot open it.
   * @returns The details, or none for an own color.
   */
  function getDetails(): RowDetails | undefined {
    if (details || hasOwnColor(paint)) {
      return details
    }
    return editor ? { content: editor, label: 'Color' } : undefined
  }

  // ===== JSX RETURN ==========================================================
  return (
    <Row details={getDetails()} remove={remove}>
      {getControl()}
      <ScrubbableNumber
        icon={<Blend size={14} />}
        label={`${label} opacity`}
        max={100}
        min={5}
        unit="%"
        value={Math.round(value.opacity * 100)}
        onValueChange={(percent) => {
          onChange({ ...value, opacity: percent / 100 })
        }}
      />
    </Row>
  )
}

export default PaintRow
