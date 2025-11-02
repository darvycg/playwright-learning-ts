import { test as base } from "@playwright/test"
import { CheckoutPage } from "@pages/CheckoutPage";

type checkoutFixtures = {
  checkoutPage: CheckoutPage;
};

export const test = base.extend<checkoutFixtures>({
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  }
});