import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'

import SegmentedControl from './SegmentedControl'

import type { HorizontalAlignment } from '../layout'

type AlignmentControlProps = {
  label: string
  value: HorizontalAlignment
  onValueChange: (value: HorizontalAlignment) => void
}

const alignmentOptions = [
  { label: 'Start', value: 'start' },
  { label: 'Center', value: 'center' },
  { label: 'End', value: 'end' },
] satisfies { label: string; value: HorizontalAlignment }[]

const alignmentIcons = {
  start: AlignLeft,
  center: AlignCenter,
  end: AlignRight,
} satisfies Record<HorizontalAlignment, typeof AlignLeft>

/** Start, center or end as an icon group, e.g. for a title. */
function AlignmentControl({
  label,
  value,
  onValueChange,
}: AlignmentControlProps) {
  return (
    <SegmentedControl
      label={label}
      options={alignmentOptions}
      value={value}
      renderOption={(option) => {
        const AlignmentIcon = alignmentIcons[option.value]
        return <AlignmentIcon aria-hidden="true" size={14} />
      }}
      onValueChange={onValueChange}
    />
  )
}

export default AlignmentControl
