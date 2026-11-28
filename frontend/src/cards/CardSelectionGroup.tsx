import { getVisibility } from '@/shared/ui/groups/getVisibility'
import TextGroup from '@/shared/ui/groups/TextGroup'

import type { CardSelectionLabelAppearance } from './types'

// ===== TYPES =================================================================
type CardSelectionGroupProps = {
  value: CardSelectionLabelAppearance
  onChange: (value: CardSelectionLabelAppearance) => void
}

// ===== COMPONENT =============================================================
/**
 * Group of the label below the card value that names its selection: its
 * text style, with an eye that hides the label.
 * @param props Label and handler.
 */
function CardSelectionGroup({ value, onChange }: CardSelectionGroupProps) {
  return (
    <TextGroup
      group="selectionLabel"
      label="Selection"
      title="Selection"
      value={value.textStyle}
      visibility={getVisibility(value, onChange)}
      onChange={(textStyle) => onChange({ ...value, textStyle })}
    />
  )
}

export default CardSelectionGroup
