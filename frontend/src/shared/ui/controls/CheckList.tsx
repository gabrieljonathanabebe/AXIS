import { Check, Search } from 'lucide-react'

import Button from '@/shared/ui/primitives/Button'
import TextInput from '@/shared/ui/primitives/TextInput'

// ===== TYPES =================================================================
export type CheckListOption = {
  detail?: string
  label: string
  value: string
}

/** Search above the list; the caller filters the options, e.g. on the server. */
type CheckListSearch = {
  placeholder?: string
  value: string
  onValueChange: (value: string) => void
}

type CheckListProps = {
  label: string
  options: CheckListOption[]
  search?: CheckListSearch
  values: string[]
  onValuesChange: (values: string[]) => void
}

// ===== COMPONENT =============================================================
/**
 * Several options to check, each with an optional detail, e.g. how often a
 * value occurs. `search` puts a search field above the list that reports
 * its text; finding the matching options stays with the caller, e.g. the
 * values of a field from the server. The list scrolls on its own.
 * @param props Options, checked values, optional search and handler.
 */
function CheckList({
  label,
  options,
  search,
  values,
  onValuesChange,
}: CheckListProps) {
  /**
   * Checks an unchecked value or unchecks a checked one.
   * @param value Value of the pressed option.
   */
  function toggleValue(value: string): void {
    onValuesChange(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    )
  }

  return (
    <div className="check-list stack">
      {search ? (
        <TextInput
          icon={<Search size={14} />}
          label={`Search ${label}`}
          placeholder={search.placeholder ?? 'Search'}
          value={search.value}
          onValueChange={search.onValueChange}
        />
      ) : null}
      <div className="check-list-options stack" role="group" aria-label={label}>
        {options.map((option) => {
          const isChecked = values.includes(option.value)
          return (
            <Button
              className="check-list-item cluster"
              variant="ghost"
              role="checkbox"
              aria-checked={isChecked}
              isActive={isChecked}
              title={option.label}
              key={option.value}
              onClick={() => {
                toggleValue(option.value)
              }}
            >
              <span className="check-list-box center" aria-hidden="true">
                {isChecked ? <Check size={11} strokeWidth={3} /> : null}
              </span>
              <span className="check-list-label">{option.label}</span>
              {option.detail ? (
                <span className="check-list-count">{option.detail}</span>
              ) : null}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default CheckList
