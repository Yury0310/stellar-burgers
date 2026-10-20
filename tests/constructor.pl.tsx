import { test, expect } from '@playwright/test';

const bunId = '6acd6b8163765e371c0bd9eb';
const bunName = 'Краторная булка N-200i';

const mainId = '6acd6b8163765e9acf0bd9ef';
const mainName = 'Говяжий метеорит (отбивная)';

test.describe('Тесты конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
     update: false,
    });

   await page.goto('/');
await expect(page.getByTestId(`ingredient-${bunId}`)).toBeVisible();
  });

  test('Добавление булки в конструктор', async ({ page }) => {
    await page.getByTestId(`ingredient-${bunId}`)
      .getByRole('button', { name: 'Добавить' }).click();

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${bunName} (низ)`)).toBeVisible();
  });

  test('Добавление начинки в конструктор', async ({ page }) => {
    await page.getByTestId(`ingredient-${mainId}`)
      .getByRole('button', { name: 'Добавить' }).click();

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText(mainName)).toBeVisible();
  });
});

test.describe('Тесты модальных окон', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');
    await expect(page.getByTestId(`ingredient-${bunId}`)).toBeVisible();
  });

  test('Открытие модального окна ингредиента', async ({ page }) => {
    await page.getByTestId(`ingredient-${bunId}`).getByRole('link').click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(bunName)).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Закрыть' })).toBeVisible();
  });

  test('Закрытие модального окна по крестику', async ({ page }) => {
    await page.getByTestId(`ingredient-${bunId}`).getByRole('link').click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(bunName)).toBeVisible();
    await modal.getByRole('button', { name: 'Закрыть' }).locator('svg').click();
    await expect(modal.getByText(bunName)).toHaveCount(0);
  });

  test('Закрытие модального окна по оверлею', async ({ page }) => {
    await page.getByTestId(`ingredient-${bunId}`).getByRole('link').click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(bunName)).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(modal.getByText(bunName)).toHaveCount(0);
  });
});

test.describe('Тест создания заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.routeFromHAR('tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');
    await expect(page.getByTestId(`ingredient-${bunId}`)).toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
    // Добавляем булку и начинку
    await page.getByTestId(`ingredient-${bunId}`)
      .getByRole('button', { name: 'Добавить' }).click();

    await page.getByTestId(`ingredient-${mainId}`)
      .getByRole('button', { name: 'Добавить' }).click();

    const constructor = page.getByTestId('constructor');

    await expect(constructor.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(constructor.getByText(mainName)).toBeVisible();

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Проверяем номер заказа
    const modal = page.locator('#modals');
    await expect(modal.getByTestId('order-number')).toHaveText(/^\d+$/);
  });
});