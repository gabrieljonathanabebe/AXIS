import { SquareRoundCorner } from 'lucide-react'

import { createSurfaceEffect } from '../effect'
import { addFill } from '../fill'
import { SURFACE_CAPABILITIES } from '../surface'
import ControlRow from './ControlRow'
import FillListControls from './FillListControls'
import FormatWidget from './FormatWidget'
import ScrubbableNumber from './ScrubbableNumber'
import StrokeStyleControls from './StrokeStyleControls'
import SurfaceEffectsControls from './SurfaceEffectsControls'

import type { Surface, SurfaceRenderer } from '../surface'

// ===== TYPES =================================================================
type SurfaceControlsProps = {
  label: string
  renderer?: SurfaceRenderer
  value: Surface
  onChange: <TKey extends keyof Surface>(
    key: TKey,
    value: Surface[TKey],
  ) => void
}

// ===== COMPONENT =============================================================
/**
 * Groups of a surface in the fixed order Shape → Fill → Stroke → Effects:
 * corner radius, background, border and effects. What the renderer draws
 * comes from `SURFACE_CAPABILITIES`; the effects offer only its kinds.
 * @param props Name, renderer, surface and a handler for one property.
 */
function SurfaceControls({
  label,
  renderer = 'html',
  value,
  onChange,
}: SurfaceControlsProps) {
  const { effects } = SURFACE_CAPABILITIES[renderer]
  return (
    <>
      <FormatWidget title="Shape">
        <ControlRow>
          <ScrubbableNumber
            icon={<SquareRoundCorner size={14} />}
            label={`${label} radius`}
            max={32}
            min={0}
            step={2}
            unit="px"
            value={value.borderRadius}
            onValueChange={(borderRadius) => {
              onChange('borderRadius', borderRadius)
            }}
          />
        </ControlRow>
      </FormatWidget>
      <FormatWidget
        title="Background"
        onAdd={() => onChange('background', addFill(value.background))}
      >
        <FillListControls
          label={label}
          value={value.background}
          onChange={(background) => onChange('background', background)}
        />
      </FormatWidget>
      <FormatWidget title="Border">
        <StrokeStyleControls
          label={`${label} border`}
          value={value.border}
          onChange={(border) => onChange('border', border)}
        />
      </FormatWidget>
      <FormatWidget
        title="Effects"
        onAdd={() => {
          onChange('effects', [...value.effects, createSurfaceEffect('shadow')])
        }}
      >
        {value.effects.length > 0 ? (
          <SurfaceEffectsControls
            kinds={effects}
            label={label}
            value={value.effects}
            onChange={(effects) => onChange('effects', effects)}
          />
        ) : null}
      </FormatWidget>
    </>
  )
}

export default SurfaceControls
