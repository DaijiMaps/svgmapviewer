import { expect, test } from '@playwright/test'

test('title', async ({ page }) => {
  await page.goto('http://localhost:3000')

  await expect(page).toHaveTitle(/Floor Map Test/)

  page.getByText(/1F/)
  page.getByText(/2F/)
})
