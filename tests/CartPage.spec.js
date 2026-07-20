import { test, expect } from '@playwright/test';

test.describe('SauceDemo Cart Page - Positive & Negative Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    // Shared setup: Login with valid credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  // ==========================================
  // POSITIVE TEST CASES
  // ==========================================

  test('Positive: Add multiple items and verify quantities and total match', async ({ page }) => {
    // Add two different items from the storefront
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Verify badge counts 2 items
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

    // Move to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Validate both specific items exist in the cart list
    const firstItem = page.locator('[data-test="item-4-title-link"]');
    const secondItem = page.locator('[data-test="item-0-title-link"]');
    await expect(firstItem).toHaveText('Sauce Labs Backpack');
    await expect(secondItem).toHaveText('Sauce Labs Bike Light');

    // Confirm individual row quantities are exactly '1'
    const quantities = page.locator('[data-test="item-quantity"]');
    await expect(quantities.nth(0)).toHaveText('1');
    await expect(quantities.nth(1)).toHaveText('1');
  });

  test('Positive: "Continue Shopping" button returns user to storefront', async ({ page }) => {
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Click continue shopping
    await page.locator('[data-test="continue-shopping"]').click();
    
    // Assert user lands back on inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  // ==========================================
  // NEGATIVE / EDGE TEST CASES
  // ==========================================

  test('Negative: Empty cart allows clicking checkout but shows failure risk down the line', async ({ page }) => {
    // Navigate straight to the cart page without adding items
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Assert cart list contains zero item rows
    const cartItems = page.locator('[data-test="inventory-item"]');
    await expect(cartItems).toHaveCount(0);

    // Business Logic Flaw / Negative Check: 
    // The application shouldn't ideally let you progress, but let's test if it handles it gracefully or fails.
    await page.locator('[data-test="checkout"]').click();
    
    // In SauceDemo, it allows navigation to step one even if empty. 
    // We catch this to flag that checkout details are now exposed unnecessarily.
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  });

  test('Negative: Verify cart state is cleanly reset when items are fully removed', async ({ page }) => {
    // Add an item and go to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Remove it
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // Negative Assertion: Verify structural elements disappear completely
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    const itemRow = page.locator('[data-test="inventory-item"]');
    
    await expect(badge).not.toBeVisible();
    await expect(itemRow).not.toBeVisible();
  });
});