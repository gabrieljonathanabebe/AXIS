import { createContext } from 'react'

/**
 * Closes the popover around it, e.g. from the close button in the header
 * of an editor. Outside a popover it does nothing.
 */
export const ClosePopover = createContext<() => void>(() => {})
