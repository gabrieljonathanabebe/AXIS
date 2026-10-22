import type { CSSProperties } from 'react'

import ColorControl from './ColorControl'
import { DATA_COLOR_PRESETS } from './colorPresets'
import { getColorCss } from '../colorValue'

import type { ColorValue } from '../colorValue'

type GradientControlProps = {
  label: string
  startColor: ColorValue
  endColor: ColorValue
  onChange: (colors: { startColor: ColorValue; endColor: ColorValue }) => void
}

type GradientStyle = CSSProperties & {
  '--gradient-start': string
  '--gradient-end': string
}

function GradientControl({
  label,
  startColor,
  endColor,
  onChange,
}: GradientControlProps) {
  // ===== LOCAL CONSTANTS =====================================================
  const style: GradientStyle = {
    '--gradient-start': getColorCss(startColor),
    '--gradient-end': getColorCss(endColor),
  }
  // ===== JSX RETURN ==========================================================
  return (
    <div className="gradient-control" aria-label={label} style={style}>
      <ColorControl
        label={`${label} low color`}
        presets={DATA_COLOR_PRESETS}
        value={startColor}
        variant="compact"
        onChange={(nextStartColor) => {
          onChange({
            startColor: nextStartColor,
            endColor,
          })
        }}
      />
      <div className="gradient-control-preview" aria-hidden="true" />
      <ColorControl
        label={`${label} high color`}
        presets={DATA_COLOR_PRESETS}
        value={endColor}
        variant="compact"
        onChange={(nextEndColor) => {
          onChange({
            startColor,
            endColor: nextEndColor,
          })
        }}
      />
    </div>
  )
}

export default GradientControl
