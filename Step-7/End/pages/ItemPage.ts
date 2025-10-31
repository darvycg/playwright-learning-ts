import {type Locator, type Page} from '@playwright/test';

export class ItemPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly itemTitle: Locator;
  readonly itemPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = this.page.getByRole('button', { name: 'ADD TO CART' });
    this.itemTitle = this.page.locator('.inventory_details_name');
    this.itemPrice = this.page.locator('.inventory_details_price');
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }
}