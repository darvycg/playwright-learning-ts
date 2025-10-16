# Page Object Model (POM)
## `tsconfig.json` Update
To help improve the imports, and understand how pathing works, add the following to your `tsconfig.json`
```json
{
  ...
  "paths": {
    "@pages/*": [
      "pages/*"
    ]
  }
}
```
This makes it so when we import the pages into our tests, we won't have to add relative paths. This will make more sense in a bit.
## Login Page
Page object models generally follow the URL and routing built. Meaning if your URL changes due to actions performed, that requires a new page object model.

For example: If I start on the login page and the URL is `https://testingexample.com/login`, then that is a page object. After you log in and the url now changes to something like `https://testingexample.com/home`, then that is now a new page object, and so on.

There are generally 3 sections to a page object model: variable declaration, constructor, methods.

Create a new folder called `pages` at the root of the project, and create a file called `LoginPage.ts`.

The basics of a page object model look like this:

```ts
import {type Locator, type Page} from '@playwright/test'; // Import what you need for the page

// class or model declaration
export class LoginPage {

    // Variable Delcaration
    readonly page: Page; // This is required from Playwright to be able to find elements
    // Locators where we perform actions. We will never override these so they are set to `readonly`
    readonly usernameInput: Locator; // login input text box of type Locator
    readonly passwordInput: Locator; // password input text box of type Locator
    readonly loginButton: Locator; // login button of type Locator

    // Constructor. When we create the page object, it sets all these values and makes them accesible
    constructor(page: Page) {
        this.page = page;
        // Grab these from the login.spec.ts file to set them!
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'LOGIN' });
    }
    
    // Methods or actions you can perform on this particular page
    async goTo() {
        await this.page.goto('https://www.saucedemo.com/v1/');
    }
    
    // Make sure that when you write method names, that they are descriptive
    // the value in paranthesis is a parameter, 
    // meaning we can call this with any value we want and it will set it here for us
    async enterUsername(username: string) { 
        await this.usernameInput.fill(username);
    }
    
    async enterPassword(password: string) {
        await this.passwordInput.fill(passwordInput);
    }
    
    // This method doesn't have a parameter because it no matter what we pass it, 
    // it will always click login
    async clickLogin() {
        await this.loginButton.click();
    }
}
```
### Variable Declaration
To cover in a little more detail, the variable declaration should include elements that we will be acting with within this particular page. For the page object model above, this means it is this section
```ts
...
// Variable Delcaration
readonly page: Page; // This is required from Playwright to be able to find elements
// Locators where we perform actions. We will never override these so they are set to `readonly`
readonly loginInput: Locator; // login input text box of type Locator
readonly passwordInput: Locator; // password input text box of type Locator
readonly loginButton: Locator; // login button of type Locator
...
```

The names should include something related to what it does and the type of the element, i.e. is it input, a button, a dropdown, etc. 
### Constructor
This is crucial for page objects. When we create a new page object, or we instantiate it, we create a specific instance of that object. Think of it as car building. We have defined what a car has and how its connected but we haven't actually built it yet. We have effectively created the directions but this is what will get the car built!

Once it is instantiated, the car will contains wheels, windows, doors, steering, breaks, etc. but only once the car has been built. The constructor handles that for us.

In this example, the page object, when instantiated, will ensure that we have the elements we need *and* the functions to use it.
```ts
...
constructor(page: Page) {
    this.page = page;
    // Grab these from the login.spec.ts file to set them!
    this.loginInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'LOGIN' });
}
...
```
### Methods
Any actions that can and will be performed. Sometimes, the actions are simple, like the ones in this page right now, but other times they can be more complex. For example, if you wanted to simply say `login` as one method, you could! It will contain multiple lines and will be slightly more involved. 

Basically, it's to make sure that we understand what this page is responsible for. We wouldn't add checkout instructions to the `LoginPage` and this enforces that!

Now that we have the page object, lets use it in our test!
## Using Page Objects
Let's reopen up `login.spec.ts` in the `tests/` directory and use our new, and shiny, page object.

First and foremost, add the `LoginPage` to the import list as
```ts
import { LoginPage } from "@pages/LoginPage";
```
This ensures the code can see where the page object lives and its methods.

Next, we will instantiate our `LoginPage` in the test prior to any actions.
```ts
const loginPage = new LoginPage(page);
```
Then, we can start using it! We added a `goto()` method in the `LoginPage` so right after we instantiate it, let's call the method to navigate to the login page.
```ts
await loginPage.goto();
```
This will call the same step that we had before
```ts
await page.goto('https://www.saucedemo.com/v1/');
```
But we no longer need the latter.

Next, we can check that the login button exists so we can replace the piece `page.getByRole('button', { name: 'LOGIN' })` from
```ts
await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();
```
to
```ts
await expect(loginPage.loginButton).toBeVisible();
```
Now we can fill out the username and password by replacing the next lines we had with:
```ts
await loginPage.enterUsername('standard_user'); // Enter username via our method
await loginPage.enterPassword('secret_sauce'); // Enter password via our method
```
Notice that we are passing the username and password through the method as a parameter. This is because there are multiple user types we can log in as, and we also want to check if its empty so hard coding in the page object makes little sense.

Finally, let's click login via our method we defined in `LoginPage`.
```ts
await loginPage.clickLogin(); // Click login through our method
```
The remaining steps cannot be changed just yet because after we log in, the page changes! We will need to create another page object to handle that piece.

See if you can create a new page object on your own using the `LoginPage` as an example! Call it `HomePage.ts` and place it under the `pages/` directory.

Once you have achieved that, take a look at the `End/` folder for a potential solution.

Here is what we would expect to see in the `login.spec.ts` file after adding the `LoginPage` functionality (I renamed the test since it is doing more than checking if it has a button):
```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from "@pages/LoginPage";

test('has login button', async ({ page }) => {

    const loginPage = new LoginPage(page); // Instantiate the page!

    await loginPage.goTo(); // Use page navigation
    await expect(loginPage.loginButton).toBeVisible(); // Check login button exists

    await loginPage.enterUsername('standard_user'); // Enter username via our method
    await loginPage.enterPassword('secret_sauce'); // Enter password via our method
    await loginPage.clickLogin(); // Click login through our method

    // No longer in the login page so LoginPage is no longer available here
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
});
```
After you have completed the home page object implementation, check `End/` solution and then move on to [expanding login tests](../Step-5/README.md).