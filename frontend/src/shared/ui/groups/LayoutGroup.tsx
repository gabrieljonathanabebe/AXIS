import { Fullscreen, Space } from 'lucide-react'

import NumberControl from '../controls/NumberControl'
import BoxRow from '../rows/BoxRow'
import Row from '../rows/Row'

import type { PartialLayout } from '@/shared/layout'
import type { LayoutBox } from '../rows/BoxRow'

// ===== TYPES =================================================================
type LayoutGroupProps<TLayout extends PartialLayout> = {
  box?: LayoutBox
  label: string
  maxGap?: number
  maxPadding?: number
  value?: TLayout
  onChange?: (value: TLayout) => void
}

// ===== COMPONENT =============================================================
/**
 * Rows of the Layout group: how large an element is and how it spaces its
 * content, in a fixed order: W | H, then gap | padding. Shows only the
 * fields the layout has, e.g. only padding for a container; `box` adds
 * W | H with the unit and bounds of the element, e.g. of a color scale,
 * which has no layout of its own.
 * @param props Box, name, bounds, layout and handler.
 */
function LayoutGroup<TLayout extends PartialLayout>({
  box,
  label,
  maxGap = 48,
  maxPadding = 64,
  value,
  onChange,
}: LayoutGroupProps<TLayout>) {
  /**
   * Saves a changed part of the layout, e.g. its gap.
   * @param patch Changed fields of the layout.
   */
  function changeLayout(patch: PartialLayout): void {
    if (value && onChange) {
      onChange({ ...value, ...patch })
    }
  }

  const spacing = [
    value?.gap !== undefined ? (
      <NumberControl
        icon={<Space size={14} />}
        key="gap"
        label={`${label} gap`}
        max={maxGap}
        min={0}
        step={2}
        unit="px"
        value={value.gap}
        onValueChange={(gap) => changeLayout({ gap })}
      />
    ) : null,
    value?.padding !== undefined ? (
      <NumberControl
        icon={<Fullscreen size={14} />}
        key="padding"
        label={`${label} padding`}
        max={maxPadding}
        min={0}
        step={2}
        unit="px"
        value={value.padding}
        onValueChange={(padding) => changeLayout({ padding })}
      />
    ) : null,
  ].filter((control) => control !== null)
  return (
    <>
      {box ? (
        <BoxRow box={box} fields={['width', 'height']} label={label} />
      ) : null}
      {spacing.length > 0 ? <Row>{spacing}</Row> : null}
    </>
  )
}

export default LayoutGroup
