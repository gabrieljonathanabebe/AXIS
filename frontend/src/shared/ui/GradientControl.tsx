import type { CSSProperties } from 'react'

import ColorControl from './ColorControl'

type GradientControlProps = {
  label: string
  startColor: string
  endColor: string
  onChange: (colors: { startColor: string; endColor: string }) => void
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
    '--gradient-start': startColor,
    '--gradient-end': endColor,
  }
  // ===== JSX RETURN ==========================================================
  return (
    <div className="gradient-control" aria-label={label} style={style}>
      <ColorControl
        label={`${label} low color`}
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
