import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import Button from './Button'
import OptionsMenu from './OptionsMenu'
import type { OptionItem } from './OptionsMenu'

type SelectControlProps<TValue extends string> = {
  label: string
  options: OptionItem<TValue>[]
  value: TValue
  placeholder?: string
  onChange: (value: TValue) => void
}

function SelectControl<TValue extends string>({
  label,
  options,
  value,
  placeholder,
  onChange,
}: SelectControlProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false)
  const controlRef = useRef<HTMLDivElement | null>(null)
  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!controlRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  function handleChange(nextValue: TValue) {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div className="select-control" ref={controlRef}>
      <Button
        className="select-control-button spread"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="select-control-value">
          {selectedOption?.label ?? placeholder ?? value}
        </span>
        <ChevronDown size={16} />
      </Button>

      {isOpen ? (
        <OptionsMenu options={options} value={value} onChange={handleChange} />
      ) : null}
    </div>
  )
}

export default SelectControl
