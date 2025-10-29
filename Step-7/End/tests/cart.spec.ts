import { expect, mergeTests} from '@playwright/test';
import { test as loginFixture } from '@fixtures/LoginFixture';
import { test as homeFixture} from '@fixtures/HomeFixture';
import { test as itemFixture } from '@fixtures/ItemFixture';

const test = mergeTests(loginFixture, homeFixture, itemFixture);

test.describe('Add to cart and cart related tests', () => {
  test('add item to cart after clicking on item', async ({ login, homePage, itemPage}) => {
    await homePage.clickOnSpecificItem('Sauce Labs Backpack');
    await itemPage.clickAddToCart();
  });
});