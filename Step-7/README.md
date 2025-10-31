# Add To Cart Tests
In the `tests/` directory, let's add a new spec file. I am going to call it `cart.spec.ts` since I plan on adding all cart related tests there.

Let's add the barebones for the tests
```ts
import { test } from '@playwright/test'; // This will change later

test.describe('Add to cart and cart related tests', () => {
  // Tests go here
});
```
We can add the login steps here through a fixture. The default is already set for us in the login fixture so we don't have to worry about updating that right now.
```ts
import { test as loginFixture } from '@fixtures/LoginFixture'; // Need it for login fixture
import { test as homeFixture} from '@fixtures/HomeFixture'; // Need it to navigate the home page

const test = mergeTests(loginFixture, homeFixture); // Merge fixtures

test.describe('Add to cart and cart related tests', () => {
  test('add item to cart', async ({ login, homePage}) => { // Pass in fixtures that should automatically login and create the home page
    await homePage.openMenu(); // Try to open the menu. If this fails, the login fixture is not built correctly!
  });
});
```
Under the home page, we have some items we can probably start to add to the home page. Open the `HomePage.ts` under `pages/`

There are 6 items we can add to the cart so let's parametrize them! You never know when they may change so hard coding them might not be the best idea. If we parametrize them, then we can change them at any time and the test is easier to update. Plus, it would also make the test more readable later.

If we inspect the page itself, we can see that we have `<div class="inventory-item">` to get all the different items components. We can use the locator `locator('.inventory_item')` to get all the available items. Let's add this as a function to our home page class.

To add this to the `HomePage.ts`, we can add the name to the locator section
```ts
readonly page: Page;
readonly menu: Locator;
readonly logoutButton: Locator;
readonly links: Locator; // New Code!
```
Now that its declared, we can add it to the constructor
```ts
constructor(page: Page) {
  this.page = page;
  this.menu = this.page.getByRole('button', { name: 'Open Menu' });
  this.logoutButton = this.page.getByRole('link', { name: 'Logout' });
  this.links = this.page.getByRole('link'); // New Code!
}
```
We can define the function to click on the element via the text by doing the following
```ts
async clickOnSpecificLink(itemName: string) {
  await this.links.getByText(itemName).click(); // get all links, then select by text
}
```
We can now call this function in our `cart.spec.ts` test
```ts
test.describe('Add to cart and cart related tests', () => {
  test('add item to cart after clicking on item', async ({ login, homePage }) => { // Added fixtures to log in and instantiate the home page
    await homePage.clickOnSpecificLink('Sauce Labs Backpack'); // Search for the item. Make this whatever you want!
  });
});
```
Now that we have clicked on the item, it has taken us to a new page that we don't have an object for! Try creating your own under `pages/` called `ItemPage.ts`.

In the page object, remember to import playwright `locator` and `page`, create the class itself, add a section for the locators, add an `addToCartButton` locator, create the constructor, get the element for the button and set it, and try to create the function you need to click on the add to cart buton.

After you have done so, move on to see how I implemented it.
```ts
import {type Locator, type Page} from '@playwright/test'; // import playwright items

export class ItemPage { // Create class
  readonly page: Page; 
  readonly addToCartButton: Locator; // Add an add to cart button

  constructor(page: Page) { // Constructor for the page object
    this.page = page;
    this.addToCartButton = this.page.getByRole('button', { name: 'ADD TO CART' }); // Set the locator
  }

  async clickAddToCart() { // Create method to click the cart
    await this.addToCartButton.click();
  }
}
```
Now, we can create a new fixture for the Items and the item page itself so we can follow the pattern of instantiating the page objects in fixtures so Playwright can handle the dependencies.

Try this on your own following the `HomeFixture.ts` by calling the `ItemPage.ts` instead. Once you are done, take a look at the solution below!
```ts
import { test as base } from "@playwright/test" // Import test from playwright
import { ItemPage } from "@pages/ItemPage"; // Import our page object

type itemFixtures = { // declare type to include our ItemPage
  itemPage: ItemPage;
};

export const test = base.extend<itemFixtures>({ // extend playwright test and export our own
  itemPage: async ({ page }, use) => {
    await use(new ItemPage(page)); // Use new Item Page
  }
});
```
We can now call the new fixture in our `cart.spec.ts` file 
```ts
import { expect, mergeTests} from '@playwright/test';
import { test as loginFixture } from '@fixtures/LoginFixture';
import { test as homeFixture} from '@fixtures/HomeFixture';
import { test as itemFixture } from '@fixtures/ItemFixture'; // Import new fixture!
```
Just as before, we must merge the fixtures together under a new test for this specific spec file
```ts
const test = mergeTests(loginFixture, homeFixture, itemFixture); // Added itemFixture
```
Finally, we can call the add to cart by first adding the fixture to our test to let it know we want to use the item page and then we can call the function we created in `ItemPage.ts`
```ts
test.describe('Add to cart and cart related tests', () => {
  test('add item to cart after clicking on item', async ({ login, homePage, itemPage}) => { // added itemPage
    await homePage.clickOnSpecificLink('Sauce Labs Backpack');
    await itemPage.clickAddToCart(); // We can use the add to cart button
  });
});
```
We will want to verify the item was added to cart, but we have an opportunity to create a base page object because the add to cart button is on the navigation bar at the top. This component exists on all pages. Instead of recreating this component in EVERY page, we can create a base page, and extend it into our other pages so that they will automatically have the required shared elements!

Before we create the base page though, lets verify that the item page contains the same item that we clicked on in the home page, and store the price for verifying this on the cart page later.

Add a new locator to get the title of the item, and verify that it matches.

Under `ItemPage.ts`:
```ts
readonly page: Page;
readonly addToCartButton: Locator;
readonly itemTitle: Locator; // New Code!
readonly itemPrice: Locator; // New Code!
...
  this.itemTitle = this.page.locator('.inventory_details_name'); // New code in constructor
  this.itemPrice = this.page.locator('.inventory_details_price'); // New code in constructor
```
Under the `cart.spect.ts` test, we can add the following to verify the title of the item we clicked on matches the item page title
```ts
const itemName = 'Sauce Labs Backpack'; // Instead of hard coding in two places, create a variable here
await homePage.clickOnSpecificLink(itemName); // Pass the variable in to click the item
await expect(itemPage.itemTitle).toContainText(itemName); // Verify the title to contain the text of the item
await itemPage.clickAddToCart(); // Then add to cart
```
Run the tests and they should be passing!

#### Now we can move on to the [base page creation!](../Step-8/README.md)