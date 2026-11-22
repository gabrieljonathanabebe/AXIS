import { describe, expect, it, vi } from 'vitest'

import { getVisibility } from './getVisibility'

describe('getVisibility', () => {
  it('shows the visibility of the part', () => {
    expect(getVisibility({ visible: false }, () => {}).visible).toBe(false)
  })

  it('saves the part with the other visibility and keeps its values', () => {
    const onChange = vi.fn()
    getVisibility({ text: 'Revenue', visible: true }, onChange).onChange(false)
    expect(onChange).toHaveBeenCalledWith({ text: 'Revenue', visible: false })
  })
})
