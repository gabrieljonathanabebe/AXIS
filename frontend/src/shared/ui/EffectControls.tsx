import { DEFAULT_GLOW_BLUR } from '../effect'
import ControlRow from './ControlRow'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'

import type { Effect } from '../effect'

// ===== TYPES =================================================================
type EffectControlsProps = {
  label: string
  value: Effect
  onChange: (value: Effect) => void
}

// ===== CONSTANTS =============================================================
const effectKindOptions = [
  { label: 'None', value: 'none' },
  { label: 'Glow', value: 'glow' },
] satisfies { label: string; value: Effect['kind'] }[]

/** Strongest glow; wider blurs wash out and cost drawing time. */
const MAX_GLOW_BLUR = 40

// ===== HELPERS ===============================================================
/**
 * Creates the effect of one kind; a glow starts with the default blur.
 * @param kind Kind chosen in the control.
 * @returns No effect, or a glow with the default blur.
 */
function createEffect(kind: Effect['kind']): Effect {
  return kind === 'glow' ? { blur: DEFAULT_GLOW_BLUR, kind } : { kind }
}

// ===== COMPONENT =============================================================
/**
 * Rows for the effect of one mark: none or a glow, and for a glow its
 * intensity as blur. Widgets place them after the fill and stroke rows;
 * the glow takes the color of the mark, so there is no color row.
 */
function EffectControls({ label, value, onChange }: EffectControlsProps) {
  return (
    <>
      <ControlRow label="Type">
        <SegmentedControl
          label={`${label} effect`}
          options={effectKindOptions}
          value={value.kind}
          onValueChange={(kind) => {
            if (kind !== value.kind) {
              onChange(createEffect(kind))
            }
          }}
        />
      </ControlRow>
      {value.kind === 'glow' ? (
        <div className="format-widget-subproperties">
          <ControlRow label="Intensity">
            <ScrubbableNumber
              label={`${label} glow intensity`}
              max={MAX_GLOW_BLUR}
              min={1}
              step={1}
              value={value.blur}
              onValueChange={(blur) => onChange({ ...value, blur })}
            />
          </ControlRow>
        </div>
      ) : null}
    </>
  )
}

export default EffectControls
