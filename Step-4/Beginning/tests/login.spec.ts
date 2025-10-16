import { test, expect } from '@playwright/test';

test('has login button', async ({ page }) => {

    // From the previous module
    await page.goto('https://www.saucedemo.com/v1/');
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();

    // Log in
    await page.getByRole('textbox', { name: 'Username' }).fill("standard_user"); // Find username input and enter username
    await page.getByRole('textbox', { name: 'Password' }).fill("secret_sauce"); // Find password input and enter password
    await page.getByRole('button', { name: 'LOGIN' }).click(); // Click on Log in

    // Validate we are logged in by ensuring we see log out
    await page.getByRole('button', { name: 'Open Menu' }).click(); // Click hamburger button to open menu
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible(); //check button is visible
});
