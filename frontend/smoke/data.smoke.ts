import { expectScreen, test } from './fixtures.ts'

test('profile of the demo data', async ({ app }) => {
  await app
    .getByRole('navigation', { name: 'Workspaces' })
    .getByRole('button', { name: 'Data' })
    .click()
  await expectScreen(app, 'profile')
})

test('table of the demo data', async ({ app }) => {
  await app
    .getByRole('navigation', { name: 'Workspaces' })
    .getByRole('button', { name: 'Data' })
    .click()
  const response = app.waitForResponse(
    (candidate) => candidate.request().method() === 'POST',
  )
  await app.getByRole('button', { name: 'Table' }).click()
  await response
  await expectScreen(app, 'table')
})
