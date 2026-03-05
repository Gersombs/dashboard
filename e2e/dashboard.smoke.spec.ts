import { expect, test } from '@playwright/test';

test('estructura del dashboard accesible e interactiva', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('link', { name: /ir al contenido principal/i })
  ).toBeAttached();

  await expect(
    page.getByRole('heading', { name: /dashboard cripto/i })
  ).toBeVisible();
  await expect(
    page.getByRole('toolbar', { name: /filtros del dashboard/i })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /actualizar datos del dashboard/i })
  ).toBeVisible();

  await expect(page.getByLabel('Grafica de historial de precio')).toBeVisible();
  await expect(page.getByLabel('Comparacion de capitalizacion de mercado')).toBeVisible();
  await expect(page.getByLabel('Distribucion de volumen de trading')).toBeVisible();
});
