import { test, expect } from '@playwright/test';
import { LoginPage } from "@pages/LoginPage";
import { HomePage } from "@pages/HomePage";

test('can log in as standard user', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goTo();
    await expect(loginPage.loginButton).toBeVisible();

    await loginPage.enterUsername('standard_user');
    await loginPage.enterPassword('secret_sauce');
    await loginPage.clickLogin();

    await homePage.openMenu();
    await expect(homePage.logoutButton).toBeVisible();
});
