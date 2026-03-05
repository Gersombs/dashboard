import { test } from '@playwright/test';

test('captura estados en desktop', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: 'docs/screenshots/01-initial-state.png',
    fullPage: true,
  });

  await page.getByRole('button', { name: /mostrar top 20 monedas/i }).click();
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: 'docs/screenshots/02-after-filters.png',
    fullPage: true,
  });
});

test('captura estado movil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: 'docs/screenshots/03-mobile.png',
    fullPage: true,
  });
});
