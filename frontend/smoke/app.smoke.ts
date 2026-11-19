import { expectScreen, openApp, test } from './fixtures.ts'

test('start with the demo data', async ({ page, theme }) => {
  await openApp(page, theme)
  await expectScreen(page, 'start')
})
