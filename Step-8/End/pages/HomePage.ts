import {type Locator, type Page} from '@playwright/test';
import {BasePage} from "@pages/BasePage";

export class HomePage extends BasePage {
  readonly menu: Locator;
  readonly logoutButton: Locator;
  readonly links: Locator;

  constructor(page: Page) {
    super(page);
    this.menu = this.page.getByRole('button', { name: 'Open Menu' });
    this.logoutButton = this.page.getByRole('link', { name: 'Logout' });
    this.links = this.page.getByRole('link');
  }

  async openMenu() {
    await this.menu.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async clickOnSpecificLink(itemName: string) {
    await this.links.getByText(itemName).click();
  }
}