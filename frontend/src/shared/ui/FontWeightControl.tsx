import { FONT_WEIGHT_VALUES } from '../textStyle'
import SegmentedControl from './SegmentedControl'

import type { FontWeight } from '../textStyle'

type FontWeightControlProps = {
  label: string
  value: FontWeight
  onValueChange: (value: FontWeight) => void
}

const fontWeightOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Bold', value: 'bold' },
] satisfies { label: string; value: FontWeight }[]

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
