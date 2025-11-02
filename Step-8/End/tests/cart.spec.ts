import { expect, mergeTests} from '@playwright/test';
import { test as loginFixture } from '@fixtures/LoginFixture';
import { test as homeFixture} from '@fixtures/HomeFixture';
import { test as itemFixture } from '@fixtures/ItemFixture';
import { test as checkoutFixture } from '@fixtures/CheckoutFixture';

const test = mergeTests(loginFixture, homeFixture, itemFixture, checkoutFixture);

test.describe('Add to cart and cart related tests', () => {
  test('add item to cart after clicking on item', async ({
     login,
     homePage,
     itemPage,
     checkoutPage}) => {
    const itemName = 'Sauce Labs Backpack';
    await homePage.clickOnSpecificLink(itemName);
    await expect(itemPage.itemTitle).toContainText(itemName);
    await itemPage.clickAddToCart();
    await itemPage.clickCheckout();

    await expect(checkoutPage.cartItems).toContainText(itemName);
    await expect(checkoutPage.cartItems).toContainText('29.99');
  });
  test('add item to cart and remove shortly after', async ({
     login,
     homePage,
     itemPage,
     checkoutPage}) => {
    const itemName = 'Sauce Labs Backpack';
    await homePage.clickOnSpecificLink(itemName);
    await expect(itemPage.itemTitle).toContainText(itemName);
    await itemPage.clickAddToCart();
    await itemPage.clickCheckout();
    await checkoutPage.getSpecificItem(itemName).click();

    await expect(checkoutPage.getSpecificItem(itemName)).toBeVisible();
    await expect(checkoutPage.getSpecificItem(itemName)).toContainText('29.99');
    await checkoutPage.removeItemFromCart(itemName);
    await expect(checkoutPage.getSpecificItem(itemName)).toBeAttached( {attached: false} );
  });
});