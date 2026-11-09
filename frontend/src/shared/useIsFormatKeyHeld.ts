import { useEffect, useState } from 'react'

import { isFormatClick } from './platform'

// ===== FUNCTION ==============================================================
/**
 * Tells whether the format key is held: ⌘ on a Mac, Ctrl elsewhere. While
 * it is held, a click formats any region, so bars and the legend show
 * their hover label, too.
 * @returns True while the key is down.
 */
export function useIsFormatKeyHeld(): boolean {
  const [isHeld, setIsHeld] = useState(false)

  useEffect(() => {
    /** Reads the key from every key event, pressed or released. */
    function handleKey(event: KeyboardEvent): void {
      setIsHeld(isFormatClick(event))
    }

    /** Lets go of the key when the window loses focus, e.g. after ⌘Tab. */
    function release(): void {
      setIsHeld(false)
    }

    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKey)
    window.addEventListener('blur', release)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('keyup', handleKey)
      window.removeEventListener('blur', release)
    }
  }, [])

  return isHeld
}
