import { CURRENCY_OPTIONS, VALUE_FORMAT_OPTIONS } from '../format/valueFormats'
import ControlRow from './ControlRow'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'
import SelectControl from './SelectControl'
import TextInput from './TextInput'
import Toggle from './Toggle'

import type { NumberFormat } from '../format/valueFormats'

// ===== TYPES =================================================================
type DecimalsMode = 'auto' | 'fixed'

type NumberFormatControlsProps = {
  label: string
  value: NumberFormat
  onChange: (value: NumberFormat) => void
}

// ===== CONSTANTS =============================================================
const decimalsModeOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Fixed', value: 'fixed' },
] satisfies { label: string; value: DecimalsMode }[]

/** Fraction digits when decimals switch to fixed; mostly to drop them. */
const DEFAULT_DECIMALS = 0

// ===== COMPONENT =============================================================
/**
 * Rows for style, currency, decimals, compact notation, prefix and suffix
 * of one number format. With auto the place that shows the value decides,
 * so only the format row shows.
 */
function NumberFormatControls({
  label,
  value,
  onChange,
}: NumberFormatControlsProps) {
  const decimalsMode: DecimalsMode = value.decimals === null ? 'auto' : 'fixed'
  return (
    <>
      <ControlRow label="Format">
        <SelectControl
          label={`${label} format`}
          options={VALUE_FORMAT_OPTIONS}
          value={value.style}
          onChange={(style) => onChange({ ...value, style })}
        />
      </ControlRow>
      {value.style !== 'auto' ? (
        <div className="format-widget-subproperties">
          {value.style === 'currency' ? (
            <ControlRow label="Currency">
              <SelectControl
                label={`${label} currency`}
                options={CURRENCY_OPTIONS}
                value={value.currency}
                onChange={(currency) => onChange({ ...value, currency })}
              />
            </ControlRow>
          ) : null}
          <ControlRow label="Decimals">
            <SegmentedControl
              label={`${label} decimals mode`}
              options={decimalsModeOptions}
              value={decimalsMode}
              onValueChange={(mode) => {
                onChange({
                  ...value,
                  decimals: mode === 'auto' ? null : DEFAULT_DECIMALS,
                })
              }}
            />
          </ControlRow>
          {value.decimals !== null ? (
            <ControlRow label="Places">
              <ScrubbableNumber
                label={`${label} decimal places`}
                max={6}
                min={0}
                step={1}
                value={value.decimals}
                onValueChange={(decimals) => onChange({ ...value, decimals })}
              />
            </ControlRow>
          ) : null}
          <ControlRow label="Compact">
            <Toggle
              checked={value.compact}
              label={`${label} compact notation`}
              onCheckedChange={(compact) => onChange({ ...value, compact })}
            />
          </ControlRow>
          <ControlRow label="Prefix">
            <TextInput
              label={`${label} prefix`}
              placeholder="None"
              value={value.prefix}
              onValueChange={(prefix) => onChange({ ...value, prefix })}
            />
          </ControlRow>
          <ControlRow label="Suffix">
            <TextInput
              label={`${label} suffix`}
              placeholder="None"
              value={value.suffix}
              onValueChange={(suffix) => onChange({ ...value, suffix })}
            />
          </ControlRow>
        </div>
      ) : null}
    </>
  )
}

export default NumberFormatControls
