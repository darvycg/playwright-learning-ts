# Quick Note
I ran into some performance issues with the test site we are using so from here on out, I changed the website from `https://www.saucedemo.com/v1/` to `https://www.saucedemo.com` within the `LoginPage.ts` page object. All elements remain the same so no further changes needed.
# Base Pages
Most of the time, there will be shared components across pages. Things like navigation, footers, some links, etc. will exist across different pages in our web applications. Instead of creating those components over and over again as you need them in multiple page objects, you can instead create an abstract base page class that we can extend in our respective page objects. 

Why not an interface? Because an interface helps provide the structure but not the methods themselves. We would still have to implement the methods in each page. Using abstract, we can create the implementation in the base page and override them in our page object, as needed. As a bonus, we also cannot instantiate an abstract class which mimics our base page. We would never have just a header page, or just a footer page but it is a part of other page objects.

## Creating the Base Page
Under `pages/`, create a new typescript class called `BasePage.ts`. The layout will be incredibly familiar to a regular page:
```ts
import { type Locator, type Page} from "@playwright/test"; // Import playwright

export abstract class BasePage { // Declare the class as abstract
  
  // Locators of shared components
  readonly page: Page; // This is always required for page objects
  readonly navigationBar: Locator;
  readonly checkoutCart: Locator;

  // Constructor of shared components
  protected constructor(page: Page) {
    this.page = page;
    this.navigationBar = this.page.locator('[data-test="primary-header"]'); // Set locators
    this.checkoutCart = this.page.locator('[data-test="shopping-cart-link"]'); // Set locators
  }

  // Be able to click on checkout at any time!
  async clickCheckout() {
    await this.checkoutCart.click();
  }
}
```
We may not use the navigation bar right now, but we can create it just in case! We do know that the checkout cart will be in the header, and we will need that at least on the `HomePage.ts` and the `ItemPage.ts`. This navigation bar is not available in the `LoginPage.ts` so we will leave it off of that one.
## Extending Base Page
Let's extend in the `HomePage.ts` and then you can try adding it to `ItemPage.ts`! Open `HomePage.ts` import `BasePage`, and add `extends BasePage` to the class declaration
```ts
...
import {BasePage} from "@pages/BasePage";

export class HomePage extends BasePage {
  ...
}
```
We no longer need to declare a page within this object as its already set in the `BasePage` and we will need to call `super(page)`. This will make the connection for you! When you create a `HomePage`, it will automatically create the `BasePage` as part of your `HomePage` (because remember, you cannot instantiate an abstract class by itself!).
```ts
// readonly page: Page <-- no longer needed
readonly menu: Locator;
readonly logoutButton: Locator;
readonly links: Locator;

constructor(page: Page) {
  super(page); // This is new code!
  this.menu = this.page.getByRole('button', { name: 'Open Menu' });
  this.logoutButton = this.page.getByRole('link', { name: 'Logout' });
  this.links = this.page.getByRole('link');
}
```
That's it! Try doing the same thing with `ItemPage.ts`, and check your work by looking [here](./End/pages/ItemPage.ts). All tests should be passing.
## Finishing the cart test
By looking in the `cart.spec.ts`, we can see that we added an item to the cart, and now we want to navigate to the checkout page and verify the item is visible along with the appropriate price.

Since we are already on the `itemPage`, let use that to navigate to the checkout page by adding
```ts
await itemPage.clickCheckout();
```
As the next step in our test. Now we should be in the checkout page, but we haven't created that yet! Try creating the barebones of the checkout page. Remember to extend `BasePage` since it will contain the same navigation component. Create `CheckoutPage.ts` under `pages/`
```ts
import { BasePage } from "@pages/BasePage";
import { type Locator, type Page } from "@playwright/test";

export class CheckoutPage extends BasePage {
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = this.page.locator('.cart-item');
  }
}
```
Now, we need to create a fixture for the checkout page, so create a new fixture under `fixtures/` called `CheckoutFixture.ts`
```ts
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
```
And within `cart.spec.ts`, import and merge into our fixtures
```ts
import { expect, mergeTests} from '@playwright/test';
import { test as loginFixture } from '@fixtures/LoginFixture';
import { test as homeFixture} from '@fixtures/HomeFixture';
import { test as itemFixture } from '@fixtures/ItemFixture';
import { test as checkoutFixture } from '@fixtures/CheckoutFixture'; // Added!

const test = mergeTests(loginFixture, homeFixture, itemFixture, checkoutFixture); // Added checkout fixture!
```
Now we can add `checkoutPage` to our test itself and we can start using it:
```ts
test.describe('Add to cart and cart related tests', () => {
  test('add item to cart after clicking on item', async ({
      login,
      homePage,
      itemPage,
      checkoutPage}) => { // Added this fixture!
    const itemName = 'Sauce Labs Backpack';
    await homePage.clickOnSpecificLink(itemName);
    await expect(itemPage.itemTitle).toContainText(itemName);
    await itemPage.clickAddToCart();
    await itemPage.clickCheckout();
  });
});
```
We can now use `checkoutPage` in our test, so let's add the checks to see if the item exists on the checkout page and the price is correct and call this test complete!
```ts
...
await expect(checkoutPage.cartItems).toContainText(itemName);
await expect(checkoutPage.cartItems).toContainText('29.99');
...
```
Careful! If there are more items available, then this may not work. We are not currently guaranteeing that the same item name we have in the checkout is the price expected. Since we know we only have 1 item, we can get away with this for now.

If you want to see the solution that makes sure that we only grab the element we want, remove the element we want, etc. Check the [`cart.spec.ts`](./End/tests/cart.spec.ts) and [`CheckoutPage.ts`](./End/pages/CheckoutPage.ts).

Try adding one more test to remove the item you just added to the checkout. When you are done, check the added locator in the `CheckoutPage.ts` and the added test steps in `cart.spec.ts`. 

#### Now that we have a few tests, let's [abstract some data in to an environment file](../Step-9/README.md)!