import { SquareRoundCorner } from 'lucide-react'

import { createSurfaceEffect } from '../effect'
import { addFill } from '../fill'
import { SURFACE_CAPABILITIES } from '../surface'
import ControlRow from './ControlRow'
import FillListControls from './FillListControls'
import FormatWidget from './FormatWidget'
import ScrubbableNumber from './ScrubbableNumber'
import StrokeWidget from './StrokeWidget'
import SurfaceEffectsControls from './SurfaceEffectsControls'

import type { ReactNode } from 'react'
import type { Surface, SurfaceRenderer } from '../surface'

// ===== TYPES =================================================================
type SurfaceControlsProps = {
  /** Groups between Shape and Background, e.g. the text of a legend. */
  children?: ReactNode
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
 * corner radius, background, border and effects. A box with text puts its
 * Text group between Shape and Fill, as the fixed order has it. What the
 * renderer draws comes from `SURFACE_CAPABILITIES`: the border offers a
 * gradient only where it can be drawn, the effects only its kinds.
 * @param props Groups after Shape, name, renderer, surface and a handler
 *   for one property.
 */
function SurfaceControls({
  children,
  label,
  renderer = 'html',
  value,
  onChange,
}: SurfaceControlsProps) {
  const { borderGradient, effects } = SURFACE_CAPABILITIES[renderer]
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
      {children}
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
      <StrokeWidget
        label={`${label} border`}
        paintTypes={borderGradient ? undefined : ['solid']}
        title="Border"
        value={value.border}
        onChange={(border) => onChange('border', border)}
      />
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
