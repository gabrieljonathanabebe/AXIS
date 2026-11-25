import { describe, expect, it } from 'vitest'

import {
  boundNumber,
  getArrowSteps,
  getDraftKeyAction,
  readNumberDraft,
} from './inputDraft'

describe('readNumberDraft', () => {
  it('reads a typed number', () => {
    expect(readNumberDraft('12.5', false)).toEqual({
      kind: 'number',
      value: 12.5,
    })
  })

  it('reads an empty field as auto only when allowed', () => {
    expect(readNumberDraft('', true)).toEqual({ kind: 'auto' })
    expect(readNumberDraft('', false)).toEqual({ kind: 'invalid' })
  })

  it('rejects text that is no number', () => {
    expect(readNumberDraft('abc', true)).toEqual({ kind: 'invalid' })
  })
})

describe('boundNumber', () => {
  it('rounds to the decimals of the step', () => {
    expect(boundNumber(1.26, { step: 0.1 })).toBe(1.3)
    expect(boundNumber(14.6, {})).toBe(15)
  })

  it('keeps the value within min and max', () => {
    expect(boundNumber(3, { min: 9, max: 28 })).toBe(9)
    expect(boundNumber(40, { min: 9, max: 28 })).toBe(28)
  })
})

describe('getArrowSteps', () => {
  it('steps one, or ten with Shift', () => {
    expect(getArrowSteps('ArrowUp', false)).toBe(1)
    expect(getArrowSteps('ArrowDown', true)).toBe(-10)
  })

  it('ignores other keys', () => {
    expect(getArrowSteps('ArrowLeft', false)).toBeNull()
  })
})

describe('getDraftKeyAction', () => {
  it('commits with Enter and cancels with Escape', () => {
    expect(getDraftKeyAction('Enter')).toBe('commit')
    expect(getDraftKeyAction('Escape')).toBe('cancel')
    expect(getDraftKeyAction('a')).toBeNull()
  })
})
