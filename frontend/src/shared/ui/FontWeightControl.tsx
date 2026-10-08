import { FONT_WEIGHT_VALUES } from '../../charts/fontWeights'
import SegmentedControl from './SegmentedControl'

import type { LabelFontWeight } from '../../charts/types'

type FontWeightControlProps = {
  label: string
  value: LabelFontWeight
  onValueChange: (value: LabelFontWeight) => void
}

const fontWeightOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Bold', value: 'bold' },
] satisfies { label: string; value: LabelFontWeight }[]

function FontWeightControl({
  label,
  value,
  onValueChange,
}: FontWeightControlProps) {
  return (
    <SegmentedControl
      label={label}
      options={fontWeightOptions}
      value={value}
      renderOption={(option) => (
        <span
          aria-hidden="true"
          style={{
            fontWeight: FONT_WEIGHT_VALUES[option.value],
          }}
        >
          A
        </span>
      )}
      onValueChange={onValueChange}
    />
  )
}

export default FontWeightControl
