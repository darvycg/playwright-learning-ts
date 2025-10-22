import { test as base } from "@playwright/test"
import { LoginPage } from "@pages/LoginPage";

type loginFixtures = {
  user: {
    username: string,
    password: string
  }
  loginPage: LoginPage
  login: void
};

export const test = base.extend<loginFixtures>({
  user: [{username: 'standard_user', password: 'secret_sauce'}, {option: true}],
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await use(loginPage);
  },
  login: async({loginPage, user}, use) => {
    await loginPage.enterUsername(user.username);
    await loginPage.enterPassword(user.password);
    await loginPage.clickLogin();
    await use();
  }
});