const { test, expect } = require('@playwright/test');

test.describe('SauceDemo Checkout Pages - Positive & Negative Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Log in and navigate to the cart with an item already added
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add item and go straight to checkout step one
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');
  });

  // ==========================================
  // POSITIVE TEST CASES
  // ==========================================

  test('Positive: Complete end-to-end checkout successfully', async ({ page }) => {
    // Step 1: Fill out Customer Information Form
    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // Step 2: Checkout Overview Page Verification
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    
    // Assert the financial calculations exist and match structure
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $29.99');
    await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $');

    // Step 3: Finish Order
    await page.locator('[data-test="finish"]').click();

    // Step 4: Final Confirmation Screen Assertions
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  // ==========================================
  // NEGATIVE TEST CASES
  // ==========================================

  test('Negative: Validation fails when information fields are missing', async ({ page }) => {
    const continueBtn = page.locator('[data-test="continue"]');
    const errorBanner = page.locator('[data-test="error"]');

    // Case A: Submit completely empty form
    await continueBtn.click();
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText('Error: First Name is required');

    // Case B: Fill First Name but omit Last Name
    await page.locator('[data-test="firstName"]').fill('Jane');
    await continueBtn.click();
    await expect(errorBanner).toContainText('Error: Last Name is required');

    // Case C: Fill Last Name but omit Postal Code
    await page.locator('[data-test="lastName"]').fill('Doe');
    await continueBtn.click();
    await expect(errorBanner).toContainText('Error: Postal Code is required');

    // Verify we are blocked and still stuck on step one
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  });
});