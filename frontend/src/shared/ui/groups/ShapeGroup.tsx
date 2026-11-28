import { SquareRoundCorner } from 'lucide-react'

import NumberControl from '../controls/NumberControl'
import Row from '../rows/Row'
import Group from './Group'

import type { GroupHeadProps } from './Group'

// ===== TYPES =================================================================
type ShapeGroupProps = GroupHeadProps & {
  label: string
  value: number
  onChange: (value: number) => void
}

// ===== COMPONENT =============================================================
/**
 * Shape group of a box: its corner radius, e.g. of a legend or the bar of
 * a color scale. Marks have shapes of their own, e.g. the symbol of a
 * point.
 * @param props Heading, name, radius and handler.
 */
function ShapeGroup({
  group,
  label,
  title = 'Shape',
  value,
  visibility,
  onChange,
}: ShapeGroupProps) {
  return (
    <Group group={group} title={title} visibility={visibility}>
      <Row>
        <NumberControl
          icon={<SquareRoundCorner size={14} />}
          label={`${label} radius`}
          max={32}
          min={0}
          step={2}
          unit="px"
          value={value}
          onValueChange={onChange}
        />
      </Row>
    </Group>
  )
}

export default ShapeGroup
