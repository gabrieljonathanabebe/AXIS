import { useState } from 'react'

import Button from './Button'
import ColorPicker from './ColorPicker'
import { getChoiceKey, getSwatchColor } from './colorPresets'
import Popover from './Popover'

import type { CSSProperties } from 'react'
import type { ColorValue } from '../colorValue'
import type { ColorPreset } from './colorPresets'

// ===== TYPES =================================================================
type ColorSwatchProps<TPreset extends string = never> = {
  label: string
  presets: ColorPreset<TPreset>[]
  value: ColorValue | NoInfer<TPreset>
  onChange: (value: ColorValue | NoInfer<TPreset>) => void
}

// ===== COMPONENT =============================================================
/**
 * Swatch of one color that opens the color picker with the presets of its
 * place, e.g. the end of a gradient or the color of a stop. Fields put
 * it next to their own value, e.g. `ColorField` next to the hex input. A
 * named preset that is no color shows its fill.
 * @param props Name, swatches, color and its handler.
 */
function ColorSwatch<TPreset extends string = never>({
  label,
  presets,
  value,
  onChange,
}: ColorSwatchProps<TPreset>) {
  const [isOpen, setIsOpen] = useState(false)
  const valueKey = getChoiceKey(value)
  const selectedPreset = presets.find((preset) => {
    return getChoiceKey(preset.value) === valueKey
  })

  return (
    <div className="color-swatch">
      <Popover
        label={`${label} color`}
        open={isOpen}
        className="color-swatch-popover glass glass-thick"
        onOpenChange={setIsOpen}
        renderTrigger={(triggerProps) => (
          <Button
            {...triggerProps}
            className={`color-swatch-swatch ${selectedPreset?.fill ? 'has-fill' : ''}`}
            type="button"
            aria-label={label}
            title={label}
            style={
              {
                '--swatch-color': getSwatchColor(value),
                '--swatch-fill': selectedPreset?.fill,
              } as CSSProperties
            }
            onClick={() => setIsOpen((current) => !current)}
          />
        )}
      >
        <ColorPicker
          label={label}
          presets={presets}
          value={value}
          onChange={onChange}
        />
      </Popover>
    </div>
  )
}

export default ColorSwatch
