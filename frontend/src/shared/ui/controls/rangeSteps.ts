// ===== FUNCTIONS =============================================================
/**
 * Thumb position of one side; an open side, or a step the list no longer
 * has, puts the thumb at its end of the track.
 * @param steps Steps of the track.
 * @param step Step of this side, or null when the side is open.
 * @param fallback Position of the open side, e.g. 0 for the start.
 * @returns Index of the step on the track.
 */
function getStepIndex<TStep>(
  steps: TStep[],
  step: TStep | null,
  fallback: number,
): number {
  const index = step === null ? -1 : steps.indexOf(step)
  return index === -1 ? fallback : index
}

/**
 * Thumb positions of a range over steps, e.g. no start and the third of
 * four steps → [0, 2].
 * @param steps Steps of the track, e.g. the days of a date field.
 * @param start First step of the range, or null when open.
 * @param end Last step of the range, or null when open.
 * @returns Indices of both thumbs.
 */
export function toStepIndices<TStep>(
  steps: TStep[],
  start: TStep | null,
  end: TStep | null,
): [number, number] {
  return [
    getStepIndex(steps, start, 0),
    getStepIndex(steps, end, steps.length - 1),
  ]
}

/**
 * Range of two thumb positions; a thumb at the first or last step leaves
 * that side open, so the full range is no filter, e.g. [0, 2] of four
 * steps → [null, third step].
 * @param steps Steps of the track.
 * @param indices Indices of both thumbs.
 * @returns First and last step, null for an open side.
 */
export function toStepRange<TStep>(
  steps: TStep[],
  [startIndex, endIndex]: [number, number],
): [TStep | null, TStep | null] {
  const lastIndex = steps.length - 1
  return [
    startIndex > 0 ? steps[startIndex] : null,
    endIndex < lastIndex ? steps[endIndex] : null,
  ]
}
