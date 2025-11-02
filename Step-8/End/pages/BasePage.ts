import { type Locator, type Page} from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  readonly navigationBar: Locator;
  readonly checkoutCart: Locator;

  protected constructor(page: Page) {
    this.page = page;
    this.navigationBar = this.page.locator('[data-test="primary-header"]');
    this.checkoutCart = this.page.locator('[data-test="shopping-cart-link"]');
  }

  async clickCheckout() {
    await this.checkoutCart.click();
  }
}