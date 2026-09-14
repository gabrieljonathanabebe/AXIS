import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import OptionsMenu from './OptionsMenu'
import type { OptionItem } from './OptionsMenu'

type DropdownFieldProps<TValue extends string> = {
  label: string
  options: OptionItem<TValue>[]
  value: TValue
  placeholder?: string
  onChange: (value: TValue) => void
}

function DropdownField<TValue extends string>({
  label,
  options,
  value,
  placeholder,
  onChange,
}: DropdownFieldProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((option) => option.value === value)
  const fieldRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!fieldRef.current?.contains(event.target as Node)) {
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
    <div className="dropdown-field" ref={fieldRef}>
      <span className="dropdown-field-label">{label}</span>
      <div className="dropdown-field-control">
        <Button
          className="dropdown-field-button spread"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span>{selectedOption?.label ?? placeholder ?? value}</span>
          <ChevronDown size={16} />
        </Button>
        {isOpen ? (
          <OptionsMenu
            options={options}
            value={value}
            onChange={handleChange}
          />
        ) : null}
      </div>
    </div>
  )
}

export default DropdownField