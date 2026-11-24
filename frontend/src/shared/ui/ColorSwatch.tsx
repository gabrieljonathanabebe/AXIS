import ColorEditor from './containers/ColorEditor'
import { getChoiceKey, getSwatchColor } from './controls/colorPresets'
import Button from './primitives/Button'
import Popover from './primitives/Popover'

import type { CSSProperties } from 'react'
import type { ColorValue } from '@/shared/colorValue'
import type { ColorPreset } from './controls/colorPresets'

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
 * it next to their own value, e.g. `ColorControl` next to the hex input. A
 * named preset that is no color shows its fill.
 * @param props Name, swatches, color and its handler.
 */
function ColorSwatch<TPreset extends string = never>({
  label,
  presets,
  value,
  onChange,
}: ColorSwatchProps<TPreset>) {
  const valueKey = getChoiceKey(value)
  const selectedPreset = presets.find((preset) => {
    return getChoiceKey(preset.value) === valueKey
  })

  return (
    <div className="color-swatch">
      <Popover
        label={`${label} color`}
        renderTrigger={(triggerProps) => (
          <Button
            {...triggerProps}
            className={`color-swatch-swatch ${selectedPreset?.fill ? 'has-fill' : ''}`}
            aria-label={label}
            title={label}
            style={
              {
                '--swatch-color': getSwatchColor(value),
                '--swatch-fill': selectedPreset?.fill,
              } as CSSProperties
            }
          />
        )}
        variant="editor"
      >
        <ColorEditor
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
