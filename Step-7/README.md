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