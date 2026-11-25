import OptionLabel from '../display/OptionLabel'
import Button from '../primitives/Button'

import type { CSSProperties, ReactNode } from 'react'
import type { OptionItem } from '@/shared/optionItem'

type SegmentedControlProps<TValue extends string> = {
  className?: string
  columns?: number
  iconOnly?: boolean
  label: string
  options: (OptionItem<TValue> | null)[]
  value: TValue
  renderOption?: (option: OptionItem<TValue>) => ReactNode
  onValueChange: (value: TValue) => void
}

type SegmentedControlStyle = CSSProperties & {
  '--segmented-columns': number
}

/**
 * Group of exclusive options; each shows its icon and label, with
 * `iconOnly` only its icon, e.g. an alignment, or what `renderOption`
 * returns. When `renderOption` returns null, the option keeps its default.
 * The label stays the name for screen readers and the tooltip. `columns`
 * lays the options out as a grid of square cells, e.g. places around a
 * plot; null leaves a cell empty.
 * @param props Options, selected value, display, layout and handler.
 */
function SegmentedControl<TValue extends string>({
  className = '',
  columns,
  iconOnly = false,
  label,
  options,
  value,
  renderOption,
  onValueChange,
}: SegmentedControlProps<TValue>) {
  const style: SegmentedControlStyle | undefined = columns
    ? { '--segmented-columns': columns }
    : undefined
  return (
    <div
      className={[
        'segmented-control',
        iconOnly ? 'is-icon-only' : '',
        columns ? 'is-grid' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="group"
      style={style}
      aria-label={label}
    >
      {options.map((option, index) =>
        option ? (
          <Button
            className="segmented-control-option"
            variant="ghost"
            pressed={option.value === value}
            aria-label={option.label}
            title={option.label}
            onClick={() => onValueChange(option.value)}
            key={option.value}
          >
            {renderOption?.(option) ?? (
              <OptionLabel iconOnly={iconOnly} option={option} />
            )}
          </Button>
        ) : (
          <span
            aria-hidden="true"
            className="segmented-control-gap"
            key={`gap-${index}`}
          />
        ),
      )}
    </div>
  )
}

export default SegmentedControl
