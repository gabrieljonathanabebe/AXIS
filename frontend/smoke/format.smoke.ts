import {
  addBarChart,
  addCard,
  addScatterChart,
  expectScreen,
  pickOption,
  test,
} from './fixtures.ts'

test('chart title', async ({ app }) => {
  await addBarChart(app)
  await pickOption(app, 'Format element', 'Title')
  await expectScreen(app, 'chart-title')
})

test('marks with the labels subgroup', async ({ app }) => {
  await addBarChart(app)
  await pickOption(app, 'Format element', 'Marks')
  await app.getByRole('button', { name: 'Show labels' }).click()
  await app
    .getByRole('button', { name: 'Label format' })
    .scrollIntoViewIfNeeded()
  await expectScreen(app, 'marks-labels')
})

test('marks with the tooltip subgroup', async ({ app }) => {
  await addBarChart(app)
  await pickOption(app, 'Format element', 'Marks')
  await app
    .getByRole('group', { name: 'Tooltip trigger' })
    .scrollIntoViewIfNeeded()
  await expectScreen(app, 'marks-tooltip')
})

test('x axis with title and labels subgroups', async ({ app }) => {
  await addBarChart(app)
  await pickOption(app, 'Format element', 'X Axis')
  await expectScreen(app, 'x-axis')
})

test('x axis with line and gridlines subgroups', async ({ app }) => {
  await addBarChart(app)
  await pickOption(app, 'Format element', 'X Axis')
  await app.getByRole('button', { name: 'Slider' }).scrollIntoViewIfNeeded()
  await expectScreen(app, 'x-axis-lines')
})

test('y axis', async ({ app }) => {
  await addBarChart(app)
  await pickOption(app, 'Format element', 'Y Axis')
  await expectScreen(app, 'y-axis')
})

test('legend', async ({ app }) => {
  await addBarChart(app)
  await pickOption(app, 'Format element', 'Legend')
  await expectScreen(app, 'legend')
})

test('color scale', async ({ app }) => {
  await addScatterChart(app)
  await pickOption(app, 'Format element', 'Color Scale')
  await expectScreen(app, 'color-scale')
})

test('card value', async ({ app }) => {
  await addCard(app)
  await pickOption(app, 'Format element', 'Value')
  await expectScreen(app, 'card-value')
})
