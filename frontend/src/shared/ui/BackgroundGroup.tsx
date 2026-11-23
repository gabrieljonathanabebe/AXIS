import { useState } from 'react'

import { addFill } from '@/shared/fill'
import Group from './Group'
import PaintRow from './PaintRow'

import type { Fill } from '@/shared/fill'

// ===== TYPES =================================================================
type BackgroundGroupProps = {
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
 * Background group of an area, e.g. the canvas or a container: one row per
 * fill, the top layer first like in Figma, with its paint control, opacity
 * and a minus. The plus adds a fill on top and opens its editor; any other
 * change of the rows, e.g. a minus or an applied style, closes an open
 * editor.
 * @param props Name of the area, its fills and handler.
 */
function BackgroundGroup({ label, value, onChange }: BackgroundGroupProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [knownFills, setKnownFills] = useState(value)
  if (value !== knownFills) {
    setKnownFills(value)
    if (value.length !== knownFills.length) {
      setOpenIndex(isFillAddedOnTop(knownFills, value) ? 0 : null)
    }
  }

  return (
    <Group title="Background" onAdd={() => onChange(addFill(value))}>
      {value.map((fill, index) => (
        <PaintRow
          // Fills carry no id; rows keep their place in the list.
          key={index}
          remove={{
            label: `Remove ${label.toLowerCase()} fill ${index + 1}`,
            onRemove: () => onChange(value.toSpliced(index, 1)),
          }}
          label={`${label} fill ${index + 1}`}
          open={openIndex === index}
          value={fill}
          onChange={(nextFill) => onChange(value.with(index, nextFill))}
          onOpenChange={(open) => setOpenIndex(open ? index : null)}
        />
      ))}
    </Group>
  )
}

export default BackgroundGroup
