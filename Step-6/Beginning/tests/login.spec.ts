import { test, expect } from '@playwright/test';
import { LoginPage } from "@pages/LoginPage";
import { HomePage } from "@pages/HomePage";

[
  { username: 'standard_user', password: 'secret_sauce' },
  { username: 'problem_user', password: 'secret_sauce' },
  { username: 'performance_glitch_user', password: 'secret_sauce' },
].forEach(({username, password}) => {
  test(`can log in ${username}`, async ({ page }) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goTo();
    await expect(loginPage.loginButton).toBeVisible();

    await loginPage.enterUsername(username); // this is the parameter from the forEach loop
    await loginPage.enterPassword(password); // this is the parameter from the forEach loop
    await loginPage.clickLogin();

    await homePage.openMenu();
    await expect(homePage.logoutButton).toBeVisible();
  });
});

[
  { username: 'locked_out_user', password: 'secret_sauce', error: 'Sorry, this user has been locked out.' },
  { username: '', password: 'secret_sauce', error: 'Username is required' },
  { username: 'locked_out_user', password: '', error: 'Password is required' },
  { username: 'wrong_username', password: 'secret_sauce', error: 'Username and password do not match any user in this service' },
  { username: 'standard_user', password: 'wrong_password', error: 'Username and password do not match any user in this service' },
].forEach(({username, password, error}) => {
  test(`unable to log in with username ${username} and error ${error}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goTo();
    await expect(loginPage.loginButton).toBeVisible();

    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
    await loginPage.clickLogin();

    await expect(loginPage.loginError).toContainText(error); // Ensure the error message matches the inputs
    await expect(loginPage.loginButton).toBeVisible(); // Ensure we are still in the login page
  })
});


