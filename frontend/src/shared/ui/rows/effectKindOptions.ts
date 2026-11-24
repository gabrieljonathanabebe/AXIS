import { Droplet, Grip, SquareSquare, SquareStack, Sun } from 'lucide-react'

import type { AnyEffect } from '@/shared/effect'
import type { OptionItem } from '../primitives/Menu'

/**
 * Icon and name of every effect kind, in the order the kind select offers
 * them; a place shows only the kinds it draws, e.g. glow only on marks.
 */
export const EFFECT_KIND_OPTIONS = [
  { icon: Sun, label: 'Glow', value: 'glow' },
  { icon: SquareStack, label: 'Shadow', value: 'shadow' },
  { icon: SquareSquare, label: 'Inner shadow', value: 'innerShadow' },
  { icon: Droplet, label: 'Blur', value: 'backgroundBlur' },
  { icon: Grip, label: 'Noise', value: 'noise' },
] satisfies OptionItem<AnyEffect['kind']>[]
