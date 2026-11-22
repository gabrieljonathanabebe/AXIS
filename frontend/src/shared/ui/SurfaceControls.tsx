import { SquareRoundCorner } from 'lucide-react'

import { createSurfaceEffect } from '@/shared/effect'
import { addFill } from '@/shared/fill'
import { SURFACE_CAPABILITIES } from '@/shared/surface'
import FillListControls from './FillListControls'
import Group from './Group'
import Row from './Row'
import ScrubbableNumber from './ScrubbableNumber'
import StrokeWidget from './StrokeWidget'
import SurfaceEffectsControls from './SurfaceEffectsControls'

import type { ReactNode } from 'react'
import type { Surface, SurfaceRenderer } from '@/shared/surface'

// ===== TYPES =================================================================
type SurfaceControlsProps = {
  /** Groups between Shape and Background, e.g. the text of a legend. */
  children?: ReactNode
  label: string
  renderer?: SurfaceRenderer
  /** Fields of the surface the box has, e.g. only radius and border. */
  value: Partial<Surface>
  onChange: <TKey extends keyof Surface>(
    key: TKey,
    value: Surface[TKey],
  ) => void
}

// ===== COMPONENT =============================================================
/**
 * Groups of a surface in the fixed order Shape → Fill → Stroke → Effects:
 * corner radius, background, border and effects. Shows only the groups
 * whose fields the surface has, e.g. Shape and Border for the bar of a
 * color scale, whose fill is the data color. A box with text puts its
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
  const { borderGradient, effects: effectKinds } =
    SURFACE_CAPABILITIES[renderer]
  const { background, border, borderRadius, effects } = value
  return (
    <>
      {borderRadius === undefined ? null : (
        <Group title="Shape">
          <Row>
            <ScrubbableNumber
              icon={<SquareRoundCorner size={14} />}
              label={`${label} radius`}
              max={32}
              min={0}
              step={2}
              unit="px"
              value={borderRadius}
              onValueChange={(nextRadius) => {
                onChange('borderRadius', nextRadius)
              }}
            />
          </Row>
        </Group>
      )}
      {children}
      {background === undefined ? null : (
        <Group
          title="Background"
          onAdd={() => onChange('background', addFill(background))}
        >
          <FillListControls
            label={label}
            value={background}
            onChange={(nextFills) => onChange('background', nextFills)}
          />
        </Group>
      )}
      {border === undefined ? null : (
        <StrokeWidget
          label={`${label} border`}
          paintTypes={borderGradient ? undefined : ['solid']}
          title="Border"
          value={border}
          onChange={(nextBorder) => onChange('border', nextBorder)}
        />
      )}
      {effects === undefined ? null : (
        <Group
          title="Effects"
          onAdd={() => {
            onChange('effects', [...effects, createSurfaceEffect('shadow')])
          }}
        >
          {effects.length > 0 ? (
            <SurfaceEffectsControls
              kinds={effectKinds}
              label={label}
              value={effects}
              onChange={(nextEffects) => onChange('effects', nextEffects)}
            />
          ) : null}
        </Group>
      )}
    </>
  )
}

export default SurfaceControls
