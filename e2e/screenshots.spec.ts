import { test } from '@playwright/test'
import { open } from './helpers'

/**
 * Review screenshots (desktop 1366 and phone 390, light and dark) into SCREENSHOTS_DIR (default
 * .screenshots/). `bun run screenshots`. Not part of the test run.
 */
const DIR = process.env.SCREENSHOTS_DIR ?? '.screenshots'

for (const theme of ['light', 'dark'] as const) {
  for (const [label, viewport, mobile] of [
    ['desktop', { width: 1366, height: 900 }, false],
    ['phone', { width: 390, height: 844 }, true],
  ] as const) {
    test(`@screenshots shell ${label} ${theme}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 2 })
      const page = await context.newPage()
      await open(page, theme)
      await page.screenshot({ path: `${DIR}/shell-${label}-${theme}.png` })
      if (!mobile) {
        await page.getByRole('button', { name: 'Collapse the menu to icons' }).click()
        await page.screenshot({ path: `${DIR}/shell-${label}-${theme}-rail.png` })
      }
      await context.close()
    })
  }
}
