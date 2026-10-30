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

// ===== COMPONENT =============================================================
/**
 * Rows of the fills of an area, e.g. the canvas or a container, the top
 * layer first like in Figma: per fill its paint field, opacity and a
 * minus. The plus that adds a fill sits in the header of the format widget
 * around it; since a new fill lands on top, the list opens the editor of
 * the first row when it grows, and closes any editor when it shrinks, as
 * the rows below move up.
 * @param props Name of the area, its fills and handler.
 */
function FillListControls({ label, value, onChange }: FillListControlsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [knownCount, setKnownCount] = useState(value.length)
  if (value.length !== knownCount) {
    setKnownCount(value.length)
    setOpenIndex(value.length > knownCount ? 0 : null)
  }

  return value.map((fill, index) => (
    <PaintControl
      // Fills carry no id; the list only changes by its own rows.
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
