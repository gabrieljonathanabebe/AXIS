import {
  addBarChart,
  addCard,
  dragFieldOver,
  expect,
  expectScreen,
  test,
} from './fixtures.ts'

test('select menu', async ({ app }) => {
  await addBarChart(app)
  await app.getByRole('button', { name: 'Category field' }).click()
  await expectScreen(app, 'select-menu')
})

test('options menu with icons', async ({ app }) => {
  await addBarChart(app)
  await app.getByRole('button', { name: 'Value aggregation' }).click()
  await expectScreen(app, 'options-menu')
})

test('paint editor', async ({ app }) => {
  await addBarChart(app)
  await app.getByRole('button', { name: 'Edit container fill 1' }).click()
  await expectScreen(app, 'paint-editor')
})

test('effect details', async ({ app }) => {
  await addCard(app)
  await app.getByRole('button', { name: 'Add effects' }).click()
  await app.getByRole('button', { name: 'Edit container effect 1' }).click()
  await expectScreen(app, 'effect-details')
})

test('hover on an icon button', async ({ app }) => {
  await addBarChart(app)
  await app.getByRole('button', { name: 'Undo' }).hover()
  await expect(app).toHaveScreenshot('icon-button-hover.png')
})

test('field dragged over a drop slot', async ({ app }) => {
  await addBarChart(app)
  await dragFieldOver(app, 'profit', 'Value')
  await expect(app).toHaveScreenshot('drag-over-slot.png')
})
