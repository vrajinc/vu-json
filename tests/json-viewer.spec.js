import { test, expect } from '@playwright/test';
import path from 'path';

const fileUrl = `file://${path.resolve('json_viewer/index.html')}`;

test.describe('JSON Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fileUrl);
  });

  test('should display placeholder on initial load', async ({ page }) => {
    const placeholder = page.locator('.placeholder');
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toHaveText('Rendered JSON will appear here');
  });

  test('should render simple JSON correctly', async ({ page }) => {
    const json = JSON.stringify({ name: "John", age: 30 });
    await page.evaluate((data) => {
      window.initViewer(data, document.getElementById('json-viewer'));
    }, json);

    // Root-level structure should be rendered (object with toggle, brackets, and summary)
    await expect(page.locator('.json-node').first()).toBeVisible();
    await expect(page.locator('.json-toggle').first()).toBeVisible();
    await expect(page.locator('.json-summary')).toHaveText(/Object/);

    // Expand the root node to reveal children
    await page.click('.json-toggle');
    
    // Now children should be visible
    await expect(page.locator('.json-key').filter({ hasText: '"name"' })).toBeVisible();
    await expect(page.locator('.json-key').filter({ hasText: '"age"' })).toBeVisible();
    await expect(page.locator('.json-string', { hasText: '"John"' })).toBeVisible();
    await expect(page.locator('.json-number', { hasText: '30' })).toBeVisible();
  });

  test('should handle nested objects and expand on click', async ({ page }) => {
    const json = JSON.stringify({ user: { id: 1 } });
    await page.evaluate((data) => {
      window.initViewer(data, document.getElementById('json-viewer'));
    }, json);

    // Initially nested content should be hidden
    let contentVisible = await page.locator('.json-collapsed-content').first().isVisible();
    expect(contentVisible).toBe(false);

    // Click first toggle to expand root
    const toggles = page.locator('.json-toggle');
    await toggles.first().click();
    
    // Now user key should be visible
    await expect(page.locator('.json-key', { hasText: '"user"' })).toBeVisible();
    
    // Get all toggles and click the second one (for the nested user object)
    const toggleCount = await toggles.count();
    if (toggleCount > 1) {
      await toggles.nth(1).click();
    }
    
    // Now id should be visible
    await expect(page.locator('.json-key', { hasText: '"id"' })).toBeVisible();
    await expect(page.locator('.json-number', { hasText: '1' })).toBeVisible();
  });

  test('should show error for invalid JSON', async ({ page }) => {
    await page.evaluate((data) => {
      initViewer(data, document.getElementById('json-viewer'));
    }, '{ invalid json }');
    const error = page.locator('#json-viewer div');
    await expect(error).toContainText('Invalid JSON');
  });

  test('should handle large paste events', async ({ page }) => {
    // Generate a reasonably large JSON
    const largeObject = {};
    for (let i = 0; i < 1000; i++) {
      largeObject[`key_${i}`] = `value_${i}`;
    }
    const json = JSON.stringify(largeObject);

    await page.evaluate((data) => {
      initViewer(data, document.getElementById('json-viewer'));
    }, json);

    // Check if the viewer rendered something
    await expect(page.locator('.json-node').first()).toBeVisible();
    await expect(page.locator('.json-summary', { hasText: 'Object' })).toBeVisible();
  });
});
