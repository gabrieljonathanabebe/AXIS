import type { FormatVisibility } from './Group'

/**
 * Eye of a part that keeps its own `visible`, e.g. a stroke or the title
 * of an axis: it shows the visibility of the part and saves the part with
 * the other one, so its values stay.
 * @param part Part with its visibility, e.g. the labels of a color scale.
 * @param onChange Saves the changed part.
 * @returns Visibility for the eye of a group or a panel.
 */
export function getVisibility<TPart extends { visible: boolean }>(
  part: TPart,
  onChange: (part: TPart) => void,
): FormatVisibility {
  return {
    visible: part.visible,
    onChange: (visible) => onChange({ ...part, visible }),
  }
}
