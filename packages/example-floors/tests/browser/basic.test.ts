import { expect, test } from '@playwright/test'

test('title', async ({ page }) => {
  await page.goto('http://localhost:3000')

  await expect(page).toHaveTitle(/Floor Map Test/)

  await page.getByText(/1F/)
  await page.getByText(/2F/)
})
