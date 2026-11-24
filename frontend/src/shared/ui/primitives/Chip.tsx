import Button from './Button'

import type { ComponentProps, ReactNode } from 'react'

type ChipProps = {
  children: ReactNode
  isActive?: boolean
} & ComponentProps<'button'>

/**
 * Pill as a button, e.g. a data field or an active filter; `isActive`
 * marks it in the accent.
 * @param props Content, state and native props, including `ref`.
 */
function Chip(props: ChipProps) {
  return <Button {...props} kind="chip" />
}

export default Chip
