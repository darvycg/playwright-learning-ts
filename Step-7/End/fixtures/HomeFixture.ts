import { test as base } from "@playwright/test"
import { HomePage } from "@pages/HomePage";

type loginFixtures = {
  homePage: HomePage;
};

export const test = base.extend<loginFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  }
});