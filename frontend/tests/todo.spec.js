const { test, expect } = require('@playwright/test');

test.describe('Todo Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should display login page initially', async ({ page }) => {
    await expect(page.locator('[data-testid="login-header"]')).toHaveText('Todo Application');
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.route('http://localhost:5000/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' }),
      });
    });

    await page.locator('[data-testid="username-input"]').fill('wrong');
    await page.locator('[data-testid="password-input"]').fill('wrong');
    await page.locator('[data-testid="login-button"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toHaveText('Invalid credentials');
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.route('http://localhost:5000/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'fake-token' }),
      });
    });

    await page.route('http://localhost:5000/todos', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, title: 'First todo', completed: false },
          { id: 2, title: 'Second todo', completed: true }
        ]),
      });
    });

    await page.locator('[data-testid="username-input"]').fill('admin');
    await page.locator('[data-testid="password-input"]').fill('admin');
    await page.locator('[data-testid="login-button"]').click();
    await expect(page.locator('[data-testid="todo-header"]')).toHaveText('Todo List');
  });

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('http://localhost:5000/login', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ token: 'fake-token' }),
        });
      });

      await page.route('http://localhost:5000/todos', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, title: 'First todo', completed: false }, 
            { id: 2, title: 'Second todo', completed: true }
          ]),
        });
      });

      await page.locator('[data-testid="username-input"]').fill('admin');
      await page.locator('[data-testid="password-input"]').fill('admin');
      await page.locator('[data-testid="login-button"]').click();
      await expect(page.locator('[data-testid="todo-header"]')).toHaveText('Todo List');
      
      await page.waitForSelector('[data-testid="todo-item"]');
    });

    test('should display existing todos', async ({ page }) => {
      await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(2);
    });

    test('should add a new todo', async ({ page }) => {
      await page.route('http://localhost:5000/todos', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, title: 'First todo', completed: false },
            { id: 2, title: 'Second todo', completed: true },
            { id: 3, title: 'New test todo', completed: false }
          ]),
        });
      });

      await page.locator('[data-testid="todo-input"]').fill('New test todo');
      await Promise.all([
        page.waitForResponse('http://localhost:5000/todos'),
        page.locator('[data-testid="add-button"]').click()
      ]);
      await expect(page.locator('[data-testid="todo-item"] >> text="New test todo"')).toBeVisible();
    });

    test('should toggle todo completion', async ({ page }) => {
      let toggleRequestCount = 0;

      const checkbox = page.locator('[data-testid="checkbox-1"]');
      await expect(checkbox).not.toBeChecked();
      
      await page.route('http://localhost:5000/todos/1', async route => {
        toggleRequestCount++;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, title: 'First todo', completed: true }),
        });
      });

      await page.route('http://localhost:5000/todos', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, title: 'First todo', completed: true },
            { id: 2, title: 'Second todo', completed: true }
          ]),
        });
      });

      await Promise.all([
        page.waitForResponse('http://localhost:5000/todos/1'),
        checkbox.click()
      ]);
      
      expect(toggleRequestCount).toBe(1);
      await expect(checkbox).toBeChecked();
    });

    test('should delete a todo', async ({ page }) => {
      const initialCount = await page.locator('[data-testid="todo-item"]').count();
      
      await page.route('http://localhost:5000/todos/1', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({}),
        });
      });

      await page.route('http://localhost:5000/todos', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 2, title: 'Second todo', completed: true }
          ]),
        });
      });

      const deleteButton = page.locator('[data-testid="delete-1"]');
      await Promise.all([
        page.waitForResponse('http://localhost:5000/todos/1'),
        page.waitForResponse('http://localhost:5000/todos'),
        deleteButton.click()
      ]);

      await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(initialCount - 1);
    });

    test('should logout', async ({ page }) => {
      await page.locator('[data-testid="logout-button"]').click();
      await expect(page.locator('[data-testid="login-header"]')).toHaveText('Todo Application');
    });
  });
});