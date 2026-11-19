import { test as base, expect } from '@playwright/test'

import type { Page } from '@playwright/test'

// ===== TYPES =================================================================
/** Options a Playwright project sets for all its smoke tests. */
export type SmokeOptions = {
  theme: 'dark' | 'light'
}

/** Fixtures a smoke test can ask for besides Playwright's own. */
type SmokeFixtures = {
  app: Page
}

// ===== HELPERS ===============================================================
/**
 * Opens the app with the demo data in the theme of the project.
 * @param page Page of the test.
 * @param theme Theme the project shows.
 */
export async function openApp(
  page: Page,
  theme: SmokeOptions['theme'],
): Promise<void> {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'revenue' })).toBeVisible()
  if (theme === 'light') {
    await page.getByRole('button', { name: 'Switch to light theme' }).click()
  }
}

/**
 * Picks an option in a select menu.
 * @param page Page of the test.
 * @param control Accessible name of the select button, e.g. "Chart type".
 * @param option Visible name of the option.
 */
export async function pickOption(
  page: Page,
  control: string,
  option: string,
): Promise<void> {
  await page.getByRole('button', { name: control }).click()
  await page.getByRole('option', { exact: true, name: option }).click()
}

/**
 * Picks a field for an encoding and waits for the query it starts.
 * @param page Page of the test.
 * @param encoding Label of the encoding, e.g. "Category".
 * @param field Name of the field.
 */
export async function pickField(
  page: Page,
  encoding: string,
  field: string,
): Promise<void> {
  const response = page.waitForResponse(
    (candidate) => candidate.request().method() === 'POST',
  )
  await pickOption(page, `${encoding} field`, field)
  await response
}
/**
 * Drags a field from the Build panel over a drop target and holds it
 * there, so a test can look at the drag before the drop.
 * @param page Page of the test.
 * @param field Name of the field.
 * @param target Label of the encoding the target sets, e.g. "Value".
 */
export async function dragFieldOver(
  page: Page,
  field: string,
  target: string,
): Promise<void> {
  const source = page.getByRole('button', { exact: true, name: field })
  await source.hover()
  await page.mouse.down()
  await source.hover({ position: { x: 24, y: 8 } })
  await page.getByLabel(`Drop ${field} to set ${target}`).hover()
}

/**
 * Drops a field from the Build panel on a drop target and waits for the
 * query it starts.
 * @param page Page of the test.
 * @param field Name of the field.
 * @param target Label of the encoding the target sets, e.g. "Value".
 */
export async function dropField(
  page: Page,
  field: string,
  target: string,
): Promise<void> {
  await dragFieldOver(page, field, target)
  const response = page.waitForResponse(
    (candidate) => candidate.request().method() === 'POST',
  )
  await page.mouse.up()
  await response
}

/**
 * Adds a bar chart of revenue by country, split by category, so it
 * shows a legend.
 * @param page Page of the test.
 */
export async function addBarChart(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Add Bar chart' }).click()
  await pickField(page, 'Category', 'country')
  await pickField(page, 'Value', 'revenue')
  await pickField(page, 'Series', 'category')
}

/**
 * Adds a scatter chart of profit against revenue, colored by customers,
 * so it shows a color scale.
 * @param page Page of the test.
 */
export async function addScatterChart(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Add Scatter chart' }).click()
  await pickOption(page, 'X Axis field', 'revenue')
  await pickField(page, 'Y Axis', 'profit')
  await pickField(page, 'Color', 'customers')
}

/**
 * Adds a card that shows the sum of revenue.
 * @param page Page of the test.
 */
export async function addCard(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Add card' }).click()
  await dropField(page, 'revenue', 'Value')
}

/**
 * Compares the whole window with its reference image, with the pointer
 * outside the app so nothing shows a hover state.
 * @param page Page of the test.
 * @param name Name of the reference image without theme and extension.
 */
export async function expectScreen(page: Page, name: string): Promise<void> {
  await page.mouse.move(0, 0)
  await expect(page).toHaveScreenshot(`${name}.png`)
}

// ===== FIXTURES ==============================================================
export const test = base.extend<SmokeOptions & SmokeFixtures>({
  app: async ({ page, theme }, provide) => {
    await openApp(page, theme)
    await page.getByRole('button', { name: 'Remove animation' }).click()
    await provide(page)
  },
  theme: ['dark', { option: true }],
})

export { expect }
