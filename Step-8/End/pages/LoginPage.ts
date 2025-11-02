import {type Locator, type Page} from '@playwright/test'; // Import what you need for the page

export class LoginPage {

  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', {name: 'Username'});
    this.passwordInput = page.getByRole('textbox', {name: 'Password'});
    this.loginButton = page.getByRole('button', {name: 'LOGIN'});
    this.loginError = page.locator('[data-test="error"]');
  }

  async goTo() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}