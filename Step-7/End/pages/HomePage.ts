import {type Locator, type Page} from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly menu: Locator;
  readonly logoutButton: Locator;
  readonly allItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menu = this.page.getByRole('button', { name: 'Open Menu' });
    this.logoutButton = this.page.getByRole('link', { name: 'Logout' });
    this.allItems = this.page.locator('.inventory_item');
  }

  async openMenu() {
    await this.menu.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async clickOnSpecificItem(itemName: string) {
    const allItems = await this.allItems.all();
    await allItems.find(item => item.getByText(itemName)).click();
  }
}