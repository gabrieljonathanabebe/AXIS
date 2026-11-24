import { getVisibility } from '@/shared/ui/groups/getVisibility'
import Group from '@/shared/ui/groups/Group'
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
    <Group
      group="selectionLabel"
      title="Selection"
      visibility={getVisibility(value, onChange)}
    >
      <TextGroup
        label="Selection"
        value={value.textStyle}
        onChange={(textStyle) => onChange({ ...value, textStyle })}
      />
    </Group>
  )
}

export default CardSelectionGroup
