import {type Locator, type Page} from '@playwright/test';
import {BasePage} from "@pages/BasePage";

export class ItemPage extends BasePage {
  readonly addToCartButton: Locator;
  readonly itemTitle: Locator;
  readonly itemPrice: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = this.page.getByRole('button', { name: 'ADD TO CART' });
    this.itemTitle = this.page.locator('.inventory_details_name');
    this.itemPrice = this.page.locator('.inventory_details_price');
    this.backToProductsButton = this.page.getByRole('button', { name: 'Back to products' });
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }

  async clickBackToProducts() {
    await this.backToProductsButton.click();
  }
}