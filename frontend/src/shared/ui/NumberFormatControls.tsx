import { DecimalsArrowRight } from 'lucide-react'

import { formatCompactNumber, formatNumber } from '../format/formatNumber'
import { CURRENCY_OPTIONS } from '../format/valueFormats'
import ControlRow from './ControlRow'
import DetailsPopover from './DetailsPopover'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'
import SelectControl from './SelectControl'
import TextInput from './TextInput'

import type {
  CurrencyCode,
  NumberFormat,
  ValueFormat,
} from '../format/valueFormats'

// ===== TYPES =================================================================
/** Choice of the format select: a style, or currency with its code. */
type FormatChoice = Exclude<ValueFormat, 'currency'> | CurrencyCode

/** How long numbers are written, as in Intl.NumberFormat. */
type Notation = 'compact' | 'standard'

type NumberFormatControlsProps = {
  isDate?: boolean
  label: string
  value: NumberFormat
  onChange: (value: NumberFormat) => void
  onDate?: () => void
}

// ===== CONSTANTS =============================================================
/** Styles of the format select, then one option per currency. */
const formatChoiceOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Number', value: 'number' },
  { label: 'Percent', value: 'percent' },
  ...CURRENCY_OPTIONS,
] satisfies { label: string; value: FormatChoice }[]

/** Format choices plus Date, e.g. for the labels of an axis. */
const formatOrDateOptions = [
  ...formatChoiceOptions,
  { label: 'Date', value: 'date' },
] satisfies { label: string; value: FormatChoice | 'date' }[]

/** Value the notation options show, e.g. as 1,234,567 and 1.2M. */
const NOTATION_EXAMPLE = 1234567

const notationOptions = [
  { label: formatNumber(NOTATION_EXAMPLE), value: 'standard' },
  { label: formatCompactNumber(NOTATION_EXAMPLE), value: 'compact' },
] satisfies { label: string; value: Notation }[]

// ===== HELPERS ===============================================================
/** Tells a currency code from a style in the format select. */
function isCurrencyCode(choice: FormatChoice): choice is CurrencyCode {
  return CURRENCY_OPTIONS.some((option) => option.value === choice)
}

/**
 * Choice of the format select for a number format.
 * @param value Number format of the element.
 * @returns The currency code for currency, else the style.
 */
function getFormatChoice(value: NumberFormat): FormatChoice {
  return value.style === 'currency' ? value.currency : value.style
}

/**
 * Applies a choice of the format select; a currency sets style and code.
 * @param value Number format of the element.
 * @param choice Chosen style or currency code.
 * @returns The number format with the chosen style.
 */
function applyFormatChoice(
  value: NumberFormat,
  choice: FormatChoice,
): NumberFormat {
  return isCurrencyCode(choice)
    ? { ...value, currency: choice, style: 'currency' }
    : { ...value, style: choice }
}

// ===== COMPONENT =============================================================
/**
 * Row of one number format: format with currency, decimal places and a gear
 * for notation, prefix and suffix. With auto the place that shows the value
 * decides, so only the format select shows. With `onDate` the select also
 * offers Date, e.g. for axis labels; `isDate` marks it as chosen and hides
 * the rest of the row.
 */
function NumberFormatControls({
  isDate = false,
  label,
  value,
  onChange,
  onDate,
}: NumberFormatControlsProps) {
  return (
    <ControlRow>
      <SelectControl
        label={`${label} format`}
        options={onDate ? formatOrDateOptions : formatChoiceOptions}
        value={isDate ? 'date' : getFormatChoice(value)}
        onChange={(choice) => {
          if (choice === 'date') {
            onDate?.()
            return
          }
          onChange(applyFormatChoice(value, choice))
        }}
      />
      {!isDate && value.style !== 'auto' ? (
        <>
          <ScrubbableNumber
            icon={<DecimalsArrowRight size={14} />}
            label={`${label} decimal places`}
            max={6}
            min={0}
            step={1}
            value={value.decimals}
            onAuto={() => onChange({ ...value, decimals: null })}
            onValueChange={(decimals) => onChange({ ...value, decimals })}
          />
          <DetailsPopover label="Number format">
            <SegmentedControl
              label={`${label} notation`}
              options={notationOptions}
              value={value.compact ? 'compact' : 'standard'}
              onValueChange={(notation) => {
                onChange({ ...value, compact: notation === 'compact' })
              }}
            />
            <ControlRow>
              <TextInput
                label={`${label} prefix`}
                placeholder="Prefix"
                value={value.prefix}
                onValueChange={(prefix) => onChange({ ...value, prefix })}
              />
              <TextInput
                label={`${label} suffix`}
                placeholder="Suffix"
                value={value.suffix}
                onValueChange={(suffix) => onChange({ ...value, suffix })}
              />
            </ControlRow>
          </DetailsPopover>
        </>
      ) : null}
    </ControlRow>
  )
}

export default NumberFormatControls
