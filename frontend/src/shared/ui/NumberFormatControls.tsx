import { DecimalsArrowRight, TextCursorInput } from 'lucide-react'

import {
  createNumberFormatter,
  formatCompactNumber,
  formatNumber,
} from '../format/formatNumber'
import { CURRENCY_OPTIONS } from '../format/valueFormats'
import ControlRow from './ControlRow'
import DetailsField from './DetailsField'
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

/** Value the notation options show, e.g. as 1,200 and 1.2K. */
const NOTATION_EXAMPLE = 1200

/** Share the preview of a percent format shows, e.g. as 12.5%. */
const PERCENT_EXAMPLE = 0.125

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

/**
 * Text of the preview: an example value in the format, with prefix and
 * suffix, e.g. "€1,200.00 per month".
 * @param value Number format of the element.
 * @returns The example as the element would show it.
 */
function getPreview(value: NumberFormat): string {
  const example = value.style === 'percent' ? PERCENT_EXAMPLE : NOTATION_EXAMPLE
  return createNumberFormatter(value)(example)
}

// ===== COMPONENT =============================================================
/**
 * Rows of one number format: the format with currency across the row,
 * then for a fixed format the decimal places and the notation, and a
 * preview of the result whose icon opens prefix and suffix with fixed
 * names. With auto the place that shows the value decides, so only the
 * format select shows. With `onDate` the select also offers Date, e.g.
 * for axis labels; `isDate` marks it as chosen and hides the rest.
 */
function NumberFormatControls({
  isDate = false,
  label,
  value,
  onChange,
  onDate,
}: NumberFormatControlsProps) {
  const hasDetails = !isDate && value.style !== 'auto'
  return (
    <>
      <ControlRow layout="wide">
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
      </ControlRow>
      {hasDetails ? (
        <>
          <ControlRow isFull>
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
            <SegmentedControl
              label={`${label} notation`}
              options={notationOptions}
              value={value.compact ? 'compact' : 'standard'}
              onValueChange={(notation) => {
                onChange({ ...value, compact: notation === 'compact' })
              }}
            />
          </ControlRow>
          <ControlRow layout="wide">
            <DetailsField
              icon={<TextCursorInput size={14} />}
              label={`${label} prefix and suffix`}
              text={getPreview(value)}
            >
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
            </DetailsField>
          </ControlRow>
        </>
      ) : null}
    </>
  )
}

export default NumberFormatControls
