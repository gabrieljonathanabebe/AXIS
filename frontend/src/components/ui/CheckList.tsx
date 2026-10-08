import { Check } from 'lucide-react'

import Button from './Button'

// ===== TYPES =================================================================
export type CheckListOption = {
  detail?: string
  label: string
  value: string
}

type CheckListProps = {
  label: string
  options: CheckListOption[]
  values: string[]
  onValuesChange: (values: string[]) => void
}

// ===== COMPONENT =============================================================
function CheckList({ label, options, values, onValuesChange }: CheckListProps) {
  function toggleValue(value: string): void {
    onValuesChange(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    )
  }
  return (
    <div className="check-list stack" role="group" aria-label={label}>
      {options.map((option) => {
        const isChecked = values.includes(option.value)
        return (
          <Button
            className="check-list-item cluster"
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
  )
}

export default CheckList
