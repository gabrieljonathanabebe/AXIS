import { useRef } from 'react'

import { boundNumber } from '../primitives/inputDraft'

import type { PointerEvent } from 'react'
import type { NumberBounds } from '../primitives/inputDraft'

// ===== TYPES =================================================================
type ScrubOptions = {
  bounds: NumberBounds
  pixelsPerStep: number
  startValue: number
  onValueChange: (value: number) => void
}

type DragState = {
  lastValue: number
  pointerId: number
  startValue: number
  startX: number
}

// ===== FUNCTIONS =============================================================
/**
 * Value at a drag distance: one step per `pixelsPerStep`, rounded and
 * bounded, e.g. 13px to the right with 6px per step → two steps more.
 * @param startValue Value the drag started from.
 * @param distance Sideways distance in pixels, negative to the left.
 * @param pixelsPerStep Distance of one step.
 * @param bounds Limits and step of the value.
 * @returns The value at that distance.
 */
export function getScrubValue(
  startValue: number,
  distance: number,
  pixelsPerStep: number,
  bounds: NumberBounds,
): number {
  const steps = Math.round(distance / pixelsPerStep)
  return boundNumber(startValue + steps * (bounds.step ?? 1), bounds)
}

/**
 * Pointer handlers that change a number by dragging sideways, e.g. the
 * grip of a number control; a new value waits for the next frame, so a
 * fast drag updates panel and charts once per frame.
 * @param options Start value, bounds, pixels per step and handler.
 * @returns Handlers to spread on the drag handle.
 */
export function useScrub({
  bounds,
  pixelsPerStep,
  startValue,
  onValueChange,
}: ScrubOptions) {
  const dragState = useRef<DragState | null>(null)
  const pendingValue = useRef<number | null>(null)
  const frameRequest = useRef<number | null>(null)

  /** Hands on the value a drag left for this frame, if there is one. */
  function flushPendingValue(): void {
    frameRequest.current = null
    const nextValue = pendingValue.current
    pendingValue.current = null
    if (nextValue !== null) {
      onValueChange(nextValue)
    }
  }

  /**
   * Starts a drag with the main button and keeps the pointer.
   * @param event Pointer down on the handle.
   */
  function handlePointerDown(event: PointerEvent<HTMLButtonElement>): void {
    if (event.button !== 0) {
      return
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    dragState.current = {
      lastValue: startValue,
      pointerId: event.pointerId,
      startValue,
      startX: event.clientX,
    }
  }

  /**
   * Turns the distance into a value; an unchanged value is skipped.
   * @param event Pointer move while dragging.
   */
  function handlePointerMove(event: PointerEvent<HTMLButtonElement>): void {
    const drag = dragState.current
    if (!drag || drag.pointerId !== event.pointerId) {
      return
    }
    const nextValue = getScrubValue(
      drag.startValue,
      event.clientX - drag.startX,
      pixelsPerStep,
      bounds,
    )
    if (nextValue === drag.lastValue) {
      return
    }
    drag.lastValue = nextValue
    pendingValue.current = nextValue
    if (frameRequest.current === null) {
      frameRequest.current = requestAnimationFrame(flushPendingValue)
    }
  }

  /** Ends a drag and hands on a value still waiting for its frame. */
  function stopDragging(): void {
    dragState.current = null
    if (frameRequest.current !== null) {
      cancelAnimationFrame(frameRequest.current)
      flushPendingValue()
    }
  }

  return {
    onPointerCancel: stopDragging,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: stopDragging,
  }
}
