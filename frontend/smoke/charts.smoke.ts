import {
  addBarChart,
  addCard,
  addScatterChart,
  expect,
  expectScreen,
  pickField,
  test,
} from './fixtures.ts'

test('picker offers exactly the chart types tested here', async ({ app }) => {
  await expect(app.getByRole('button', { name: /^Add \w+ chart$/ })).toHaveText(
    ['Scatter', 'Line', 'Bar', 'Pie', 'Donut'],
  )
})

test('scatter chart with color scale', async ({ app }) => {
  await addScatterChart(app)
  await expectScreen(app, 'scatter')
})

test('line chart with legend', async ({ app }) => {
  await app.getByRole('button', { name: 'Add Line chart' }).click()
  await pickField(app, 'X Axis', 'date')
  await pickField(app, 'Y Axis', 'revenue')
  await pickField(app, 'Series', 'category')
  await expectScreen(app, 'line')
})

test('bar chart with legend', async ({ app }) => {
  await addBarChart(app)
  await expectScreen(app, 'bar')
})

test('pie chart', async ({ app }) => {
  await app.getByRole('button', { name: 'Add Pie chart' }).click()
  await pickField(app, 'Category', 'category')
  await pickField(app, 'Value', 'revenue')
  await expectScreen(app, 'pie')
})

test('donut chart', async ({ app }) => {
  await app.getByRole('button', { name: 'Add Donut chart' }).click()
  await pickField(app, 'Category', 'country')
  await pickField(app, 'Value', 'profit')
  await expectScreen(app, 'donut')
})

test('card with a field', async ({ app }) => {
  await addCard(app)
  await expectScreen(app, 'card')
})
