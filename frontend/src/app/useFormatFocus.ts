import { useEffect, useRef, useState } from 'react'

// ===== TYPES =================================================================
type FormatFocus = {
  isFormatFocused: boolean
  pulseFormatFocus: () => void
}

// ===== CONSTANTS =============================================================
/** How long a chosen element lights up on its object, in milliseconds. */
const FOCUS_PULSE_DURATION = 1000

// ===== FUNCTION ==============================================================
/**
 * Tells when the element of the format panel lights up on its object: while
 * the pointer is over the format panel, and for a moment after an element
 * was chosen. Otherwise nothing is dimmed, so analyzing stays undisturbed.
 * @returns Whether the focus shows, and a pulse for a newly chosen element.
 */
export function useFormatFocus(): FormatFocus {
  const [isOverPanel, setIsOverPanel] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const pulseTimeout = useRef<number | null>(null)

  useEffect(() => {
    /**
     * Follows the pointer into and out of the format panel, also when the
     * panel under it is replaced, e.g. from chart to card.
     */
    function handlePointerOver(event: PointerEvent): void {
      const target = event.target
      setIsOverPanel(
        target instanceof Element && target.closest('.format-panel') !== null,
      )
    }

    /** Ends the hover when the pointer leaves the window. */
    function handlePointerOut(event: PointerEvent): void {
      if (event.relatedTarget === null) {
        setIsOverPanel(false)
      }
    }

    document.addEventListener('pointerover', handlePointerOver)
    document.addEventListener('pointerout', handlePointerOut)
    return () => {
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
    }
  }, [])

  /** Lights up the chosen element for a moment; a new pulse starts over. */
  function pulseFormatFocus(): void {
    if (pulseTimeout.current !== null) {
      window.clearTimeout(pulseTimeout.current)
    }
    setIsPulsing(true)
    pulseTimeout.current = window.setTimeout(() => {
      pulseTimeout.current = null
      setIsPulsing(false)
    }, FOCUS_PULSE_DURATION)
  }

  return { isFormatFocused: isOverPanel || isPulsing, pulseFormatFocus }
}
