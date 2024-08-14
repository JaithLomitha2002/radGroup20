import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5174/";

test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);
  console.log('Navigated to UI_URL');

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();
  console.log('Clicked Sign In link');

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible({ timeout: 10000 });
  console.log('Sign In heading is visible');

  await page.locator("[name=email]").fill("2@2gmail.com");
  await page.locator("[name=password]").fill("newnew");
  console.log('Filled email and password');

  await page.getByRole("button", { name: "Login" }).click();
  console.log('Clicked Login button');

  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  console.log('Waited for network to be idle');

  await expect(page.getByText("Sign in Successful!")).toBeVisible({ timeout: 10000 });
  console.log('Sign in Successful message is visible');

  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible({ timeout: 10000 });
  console.log('All expected elements are visible');
});

// Uncomment and update the registration test as needed
// test("should allow user to register", async ({ page }) => {
//   const testEmail = `test_register_${
//     Math.floor(Math.random() * 90000) + 10000
//   }@test.com`;
//   await page.goto(UI_URL);

//   await page.getByRole("link", { name: "Sign In" }).click();
//   await page.getByRole("link", { name: "Create an account here" }).click();
//   await expect(
//     page.getByRole("heading", { name: "Create an Account" })
//   ).toBeVisible({ timeout: 10000 });

//   await page.locator("[name=firstName]").fill("test_firstName");
//   await page.locator("[name=lastName]").fill("test_lastName");
//   await page.locator("[name=email]").fill(testEmail);
//   await page.locator("[name=password]").fill("password123");
//   await page.locator("[name=confirmPassword]").fill("password123");

//   await page.getByRole("button", { name: "Create Account" }).click();

//   await expect(page.getByText("Registration Success!")).toBeVisible({ timeout: 10000 });
//   await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible({ timeout: 10000 });
//   await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible({ timeout: 10000 });
//   await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible({ timeout: 10000 });
// });
