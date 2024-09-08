import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5175/';

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);
  //get the sign in button
  await page.click('a:has-text("Sign in")');
  await expect(page.locator('h1:has-text("Sign in")')).toBeVisible();
  await page.fill('[name=email]', '1@11.com');
  await page.fill('[name=password]', 'password123');

  await page.click('button:has-text("Login")');
  await expect(page.locator('body:has-text("Welcome to the app!")')).toBeVisible();
  await expect(page.locator('a:has-text("My Bookings")')).toBeVisible();
  await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();

});

