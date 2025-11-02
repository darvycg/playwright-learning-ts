import { test as base } from "@playwright/test"
import { ItemPage } from "@pages/ItemPage";

type itemFixtures = {
  itemPage: ItemPage;
};

export const test = base.extend<itemFixtures>({
  itemPage: async ({ page }, use) => {
    await use(new ItemPage(page));
  }
});