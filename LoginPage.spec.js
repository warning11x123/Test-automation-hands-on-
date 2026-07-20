const { test, expect } = require('@playwright/test');

test.describe('SauceDemo Login Page - Positive & Negative Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    // Every login test starts directly on the base URL
    await page.goto('https://www.saucedemo.com/');
  });

  // ==========================================
  // POSITIVE TEST CASES
  // ==========================================

  test('Positive: Successful login redirects to inventory page', async ({ page }) => {
    // Fill correct credentials
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Assert URL change and that products header exists
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  // ==========================================
  // NEGATIVE TEST CASES
  // ==========================================

  test('Negative: Rejected access for a locked-out user profile', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Assert error message context and red styling container visibility
    const errorAlert = page.locator('[data-test="error"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Epic sadface: Sorry, this user has been locked out.');
    
    // Ensure we remained stuck on the login landing page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Negative: Missing username password inputs show localized field validation errors', async ({ page }) => {
    const loginButton = page.locator('[data-test="login-button"]');
    const errorAlert = page.locator('[data-test="error"]');

    // Scenario A: Completely empty submission
    await loginButton.click();
    await expect(errorAlert).toContainText('Epic sadface: Username is required');

    // Scenario B: Fill username but clear out password field completely
    await page.locator('[data-test="username"]').fill('standard_user');
    await loginButton.click();
    await expect(errorAlert).toContainText('Epic sadface: Password is required');
  });

  test('Negative: Arbitrary invalid inputs fail auth check', async ({ page }) => {
    // Insert random credential details
    await page.locator('[data-test="username"]').fill('not_a_real_user');
    await page.locator('[data-test="password"]').fill('wrong_password_123');
    await page.locator('[data-test="login-button"]').click();

    // Verify system gives general security fallback error rather than crashing
    const errorAlert = page.locator('[data-test="error"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Epic sadface: Username and password do not match any user in this service');
  });
});