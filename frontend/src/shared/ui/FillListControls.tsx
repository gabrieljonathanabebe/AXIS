import { Minus } from 'lucide-react'
import { useState } from 'react'

import IconButton from './IconButton'
import PaintControl from './PaintControl'

import type { Fill } from '../fill'

// ===== TYPES =================================================================
type FillListControlsProps = {
  label: string
  value: Fill[]
  onChange: (value: Fill[]) => void
}

// ===== HELPERS ===============================================================
/**
 * Tells whether a list grew by one new fill on top while the others kept
 * their place, as the plus adds it; a style that writes new fills does not.
 * @param previous Fills before the change.
 * @param next Fills after the change.
 * @returns True when the only change is a new first fill.
 */
function isFillAddedOnTop(previous: Fill[], next: Fill[]): boolean {
  return (
    next.length === previous.length + 1 &&
    previous.every((fill, index) => fill === next[index + 1])
  )
}

// ===== COMPONENT =============================================================
/**
 * Rows of the fills of an area, e.g. the canvas or a container, the top
 * layer first like in Figma: per fill its paint field, opacity and a
 * around it; since a new fill lands on top, the list opens the editor of
 * the first row when the plus adds one, and closes any editor when the
 * rows change otherwise, e.g. by a minus or an applied style.
 * the rows below move up.
 * @param props Name of the area, its fills and handler.
 */
function FillListControls({ label, value, onChange }: FillListControlsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [knownFills, setKnownFills] = useState(value)
  if (value !== knownFills) {
    setKnownFills(value)
    if (value.length !== knownFills.length) {
      setOpenIndex(isFillAddedOnTop(knownFills, value) ? 0 : null)
    }
  }

  return value.map((fill, index) => (
    <PaintControl
      // Fills carry no id; rows keep their place in the list.
      key={index}
      actions={
        <IconButton
          label={`Remove ${label.toLowerCase()} fill ${index + 1}`}
          size="xs"
          variant="ghost"
          onClick={() => onChange(value.toSpliced(index, 1))}
        >
          <Minus size={14} />
        </IconButton>
      }
      label={`${label} fill ${index + 1}`}
      open={openIndex === index}
      value={fill}
      onChange={(nextFill) => onChange(value.with(index, nextFill))}
      onOpenChange={(open) => setOpenIndex(open ? index : null)}
    />
  ))
}

export default FillListControls
