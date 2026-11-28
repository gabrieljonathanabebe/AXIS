import { SquareRoundCorner } from 'lucide-react'

import { isSurfaceEffect } from '@/shared/effect'
import { SURFACE_CAPABILITIES } from '@/shared/surface'
import NumberControl from '../controls/NumberControl'
import Row from '../rows/Row'
import BackgroundGroup from './BackgroundGroup'
import EffectsGroup from './EffectsGroup'
import { getVisibility } from './getVisibility'
import Group from './Group'
import StrokeGroup from './StrokeGroup'

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

// ===== CONSTANTS =============================================================
/** Widest blur of a surface effect; deep shadows need more than marks. */
const MAX_SURFACE_BLUR = 64

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
            <NumberControl
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
        <BackgroundGroup
          label={label}
          value={background}
          onChange={(nextFills) => onChange('background', nextFills)}
        />
      )}
      {border === undefined ? null : (
        <StrokeGroup
          label={`${label} border`}
          paintTypes={borderGradient ? undefined : ['solid']}
          title="Border"
          value={border.stroke}
          visibility={getVisibility(border, (nextBorder) => {
            onChange('border', nextBorder)
          })}
          onChange={(stroke) => onChange('border', { ...border, stroke })}
        />
      )}
      {effects === undefined ? null : (
        <EffectsGroup
          kinds={effectKinds}
          label={label}
          maxBlur={MAX_SURFACE_BLUR}
          title="Effects"
          value={effects}
          onChange={(nextEffects) => {
            onChange('effects', nextEffects.filter(isSurfaceEffect))
          }}
        />
      )}
    </>
  )
}

export default SurfaceControls
