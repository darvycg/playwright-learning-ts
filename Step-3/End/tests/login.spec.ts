import { test, expect } from '@playwright/test'; // Import playwright library into the test

/**
 * Title of the test along with the page fixture (more on this later).
 * This essentially calls the test to run!
 */
test('has login button', async ({ page }) => {
    // In order to maintain thread safety and avoid race conditions,
    // we use await to ensure that the steps don't run out of order!
    await page.goto('https://www.saucedemo.com/v1/'); // go to the webpage

    // expect helps test that elements are visible, contain specific text, etc.
    // The getByRole is what we use to find the elements on the page.
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();
});
