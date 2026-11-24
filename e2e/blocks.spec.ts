import { expect, test } from '@playwright/test'
import { expectAccessible, expectFitsScreen, open } from './helpers'

for (const theme of ['light', 'dark'] as const) {
  for (const state of ['', '?state=loading', '?state=empty']) {
    test(`the overview's blocks are accessible and fit (${theme}${state ? `, ${state.slice(7)}` : ''})`, async ({ page }) => {
      await open(page, theme, `${state}#overview`)
      await expectAccessible(page)
      await expectFitsScreen(page)
    })
  }
}

test('the hero: the period switch changes the number and the chart, with a table for screen readers', async ({ page }) => {
  await open(page, 'light')
  const hero = page.locator('.ja-hero')
  await expect(hero.getByRole('img', { name: 'Visits per day this week' })).toBeVisible()
  await expect(hero.getByRole('table', { name: 'Visits per day this week' }).getByRole('row')).toHaveCount(7)
  await hero.getByRole('button', { name: 'Month' }).click()
  await expect(hero.getByRole('button', { name: 'Month' })).toHaveAttribute('aria-pressed', 'true')
  await expect(hero.locator('.ja-number')).toHaveText('157,220')
  await expect(hero.getByRole('img', { name: 'Visits per week this month' })).toBeVisible()
})

test('the users table: filters, search with its empty state, and pages', async ({ page }) => {
  await open(page, 'light', '#users')
  const table = page.getByRole('table', { name: 'Users' })
  const rows = table.locator('tbody tr')
  await expect(rows).toHaveCount(6)
  await page.getByRole('button', { name: 'Suspended' }).click()
  await expect(rows).toHaveCount(1)
  await expect(table.getByRole('button', { name: 'Restore Leo Martin' })).toBeVisible()
  await page.getByRole('button', { name: 'All' }).click()
  await page.getByRole('navigation', { name: 'User pages' }).getByRole('button', { name: 'Page 2' }).click()
  await expect(page.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
  await expect(rows).toHaveCount(2)
  await page.getByRole('searchbox', { name: 'Search by name or email' }).fill('zebra')
  await expect(page.getByText('No people match “zebra”.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear the search' }).click()
  await expect(page.getByRole('table', { name: 'Users' })).toBeVisible()
})

test('phone: tiles stack in two columns and table rows become cards', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phones only')
  await open(page, 'light')
  const hero = await page.locator('.ja-hero').boundingBox()
  const reports = await page.locator('.ja-tile[data-tone="sun"]').boundingBox()
  expect(hero!.width).toBeGreaterThan(330)
  expect(reports!.width).toBeLessThan(200)
  await expect(page.getByRole('table', { name: 'Users' }).locator('thead')).toBeHidden()
  const row = page.getByRole('table', { name: 'Users' }).locator('tbody tr').first()
  const status = await row.getByText('Active', { exact: true }).boundingBox()
  const person = await row.getByText('Priya Nair', { exact: true }).boundingBox()
  // Status sits on the person's line, to the right.
  expect(Math.abs(status!.y - person!.y)).toBeLessThan(24)
  expect(status!.x).toBeGreaterThan(person!.x)
})
