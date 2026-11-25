import EffectEditor from '../containers/EffectEditor'
import DetailsControl from '../controls/DetailsControl'
import { EFFECT_KIND_OPTIONS } from './effectKindOptions'
import Row from './Row'

import type { AnyEffect } from '@/shared/effect'
import type { OptionItem } from '../primitives/SelectMenu'

// ===== TYPES =================================================================
type EffectRowProps = {
  kinds: OptionItem<AnyEffect['kind']>[]
  label: string
  maxBlur: number
  value: AnyEffect
  onChange: (value: AnyEffect) => void
  onRemove: () => void
}

// ===== COMPONENT =============================================================
/**
 * Row of one effect, built like a paint: a control with icon and name of
 * its kind opens the editor of the effect, and a minus removes it.
 * @param props Offered kinds, name of the effect, e.g. "Bar effect",
 *   widest blur of the place, effect and handlers.
 */
function EffectRow({
  kinds,
  label,
  maxBlur,
  value,
  onChange,
  onRemove,
}: EffectRowProps) {
  const kind = EFFECT_KIND_OPTIONS.find((option) => {
    return option.value === value.kind
  })
  return (
    <Row
      layout="wide"
      remove={{ label: `Remove ${label.toLowerCase()}`, onRemove }}
    >
      <DetailsControl
        icon={kind ? <kind.icon size={14} /> : null}
        label={label}
        text={kind?.label ?? ''}
      >
        <EffectEditor
          kinds={kinds}
          label={label}
          maxBlur={maxBlur}
          value={value}
          onChange={onChange}
        />
      </DetailsControl>
    </Row>
  )
}

export default EffectRow
