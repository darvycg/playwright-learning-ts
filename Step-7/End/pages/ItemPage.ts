import {type Locator, type Page} from '@playwright/test';

export class ItemPage {
  readonly page: Page;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = this.page.getByRole('button', { name: 'ADD TO CART' });
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }
}