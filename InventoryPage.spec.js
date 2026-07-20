import { test, expect } from '@playwright/test';

test.describe('SauceDemo Inventory Page - Positive & Negative Scenarios', () => {

  // ==========================================
  // POSITIVE TEST CASES
  // ==========================================

  test.describe('Authenticated Actions', () => {
    test.beforeEach(async ({ page }) => {
      // Standard login sequence required for positive cases
      await page.goto('https://www.saucedemo.com/');
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('Positive: Verify product sorting works from high to low price', async ({ page }) => {
      // Select the "Price (high to low)" option from the dropdown
      await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

      // Grab all price elements text content
      const priceElements = page.locator('[data-test="inventory-item-price"]');
      const pricesText = await priceElements.allTextContents();

      // Convert "$29.99" string arrays to raw floating numbers
      const prices = pricesText.map(p => parseFloat(p.replace('$', '')));

      // Assert the array matches a cleanly sorted high-to-low copy of itself
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sortedPrices);
    });

    test('Positive: Add-to-cart dynamically transforms button UI state to "Remove"', async ({ page }) => {
      const backpackBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
      const badge = page.locator('[data-test="shopping-cart-badge"]');

      // Click to add
      await backpackBtn.click();

      // UI Check: The exact selector matches should change to point to a remove element
      const removeBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
      await expect(removeBtn).toHaveText('Remove');
      await expect(badge).toHaveText('1');

      // Clean up state directly from inventory view
      await removeBtn.click();
      await expect(backpackBtn).toHaveText('Add to cart');
      await expect(badge).not.toBeVisible();
    });
  });

  // ==========================================
  // NEGATIVE & EDGE TEST CASES
  // ==========================================

  test('Negative: Direct URL routing to /inventory.html without auth should force redirect back', async ({ page }) => {
    // Attempting to bypass the login form entirely via deep-linking
    await page.goto('https://www.saucedemo.com/inventory.html');

    // System should catch the missing auth cookie/session token
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Validate an explicit security/error visual feedback flag occurs on the form
    const errorContainer = page.locator('[data-test="error"]');
    await expect(errorContainer).toBeVisible();
    // await expect(errorContainer).toContainText("You can only access '/inventory.html' after logging in");
  });

  test('Negative/Edge: Problem User profile encounters systemic inventory breakdown', async ({ page }) => {
    // SauceDemo includes a built-in account specifically to test broken functionality
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('problem_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Assert that the page structural components loaded despite profile bugs
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Negative Assertion: Attempting to click add-to-cart on specific items fails or behaves erratically
    // (e.g., The dog shirt item button is broken for problem_user)
    const fleeceBtn = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
    await fleeceBtn.click();

    // Assert that clicking it failed to update the state to "Remove" or update the count badge
    await expect(fleeceBtn).toHaveText('Add to cart'); 
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
  });
});