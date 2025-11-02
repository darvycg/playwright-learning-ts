import { BasePage } from "@pages/BasePage";
import { type Locator, type Page } from "@playwright/test";

export class CheckoutPage extends BasePage {
  readonly cartItems: Locator;
  readonly removeFromCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = this.page.locator('[data-test="inventory-item"]');
    this.removeFromCartButton = this.page.getByRole("button", { name: 'Remove'});
  }

  getSpecificItem(itemTitle : string) {
    const child = this.page.getByText(itemTitle); // Set the child first
    return this.page.locator('[data-test="inventory-item"]').filter({has: child}); // Get the locator that has said child
  }

  async removeItemFromCart(itemTitle : string) {
    await this.getSpecificItem(itemTitle).getByRole("button", {name: 'Remove'}).click();
  }
}