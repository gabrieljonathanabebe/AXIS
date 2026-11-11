import { useEffect, useRef, useState } from 'react'

// ===== TYPES =================================================================
type FormatFocus = {
  hoveredFormatGroup: string | null
  isFormatPulsing: boolean
  isOverFormatPanel: boolean
  pulseFormatFocus: () => void
}

// ===== CONSTANTS =============================================================
/** How long a chosen element lights up on its object, in milliseconds. */
const FOCUS_PULSE_DURATION = 1000

// ===== FUNCTION ==============================================================
/**
 * Tells what of the format panel lights up on its object: while the pointer
 * is over the panel, the group under it, e.g. the data labels, else the
 * element of the panel; for a moment after an element was chosen, that
 * element. Otherwise nothing is dimmed, so analyzing stays undisturbed.
 * @returns The hover over the panel, the pulse and a way to start it.
 */
export function useFormatFocus(): FormatFocus {
  const [isOverPanel, setIsOverPanel] = useState(false)
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const [isPulsing, setIsPulsing] = useState(false)
  const pulseTimeout = useRef<number | null>(null)

  useEffect(() => {
    /**
     * Follows the pointer over the format panel and its groups, also when
     * the panel under it is replaced, e.g. from chart to card.
     */
    function handlePointerOver(event: PointerEvent): void {
      const target = event.target instanceof Element ? event.target : null
      setIsOverPanel(Boolean(target?.closest('.format-panel')))
      setHoveredGroup(
        target
          ?.closest('.format-panel [data-format-group]')
          ?.getAttribute('data-format-group') ?? null,
      )
    }

    /** Ends the hover when the pointer leaves the window. */
    function handlePointerOut(event: PointerEvent): void {
      if (event.relatedTarget === null) {
        setIsOverPanel(false)
        setHoveredGroup(null)
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

  return {
    hoveredFormatGroup: hoveredGroup,
    isFormatPulsing: isPulsing,
    isOverFormatPanel: isOverPanel,
    pulseFormatFocus,
  }
}
