import { createContext } from 'react'

/**
 * Tells a group whether it stands inside another group, which makes it a
 * subgroup with a quieter heading. An editor sets it back to false, since
 * its groups start at the top level again, although the context reaches
 * through the portal of its popover.
 */
export const InsideGroup = createContext(false)
