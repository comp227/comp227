---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: en
---

<div class="content">

So far we have:

- tested the backend on an API level using integration tests
- tested some frontend components using unit tests.

Next, we will look into one way to test the [system as a whole](https://en.wikipedia.org/wiki/System_testing) using **End-to-End** (E2E) tests.

To do E2E testing on a web application, we can use a browser and a testing library.
There are multiple testing libraries available.
One example is [Selenium](http://www.seleniumhq.org/),
which can be used with almost any browser.
Another browser option is a [**headless browser**](https://en.wikipedia.org/wiki/Headless_browser),
which is a browser with no graphical user interface.
For example, Chrome can be used in headless mode.

E2E tests are potentially the most useful category of tests because they test the system through the same interface as real users use.

However, E2E tests have some drawbacks too.
Configuring E2E tests is more challenging than unit or integration tests.
They also tend to be quite slow, and with a large system, their execution time can be minutes or even hours.
This is bad for development because during coding it is beneficial to be able to run tests as often as possible in case of code [regressions](https://en.wikipedia.org/wiki/Regression_testing).

Lastly, E2E tests can be [**flaky**](https://docs.cypress.io/guides/cloud/flaky-test-management).
Flaky tests are undesired because they can change from passing to failing or vice-versa simply *by running the tests again, without even changing any code*.

Perhaps the two easiest libraries for End to End testing at the moment are [Cypress](https://www.cypress.io/) and [Playwright](https://playwright.dev/).

From the statistics on [npmtrends.com](https://npmtrends.com/cypress-vs-playwright)
we can see that Playwright surpassed Cypress in download numbers during 2024, and its popularity continues to grow:

![cypress vs playwright in npm trends](../../images/5/cvsp.png)

This course has been using Cypress for years.
Now Playwright is a new addition.
You can choose whether to complete the E2E testing part of the course with Cypress or Playwright.
The operating principles of both libraries are very similar, so your choice is not very important.
However, Playwright is now the preferred E2E library for the course.

If your choice is Playwright, please proceed.
If you end up using Cypress, [visit our older documentation](/en/part5/end_to_end_testing_cypress).

### Playwright

So [Playwright](https://playwright.dev/) is a newcomer to the End to End tests, which started to explode in popularity towards the end of 2023.
Playwright is roughly on a par with Cypress in terms of ease of use.
The libraries are slightly different in terms of how they work.
Cypress is radically different from most libraries suitable for E2E testing, as Cypress tests are run entirely within the browser.
Playwright's tests, on the other hand, are executed in the Node process, which is connected to the browser via programming interfaces.

Many blogs have been written about library comparisons, e.g. [this](https://www.lambdatest.com/blog/cypress-vs-playwright/) and [this](https://www.browserstack.com/guide/playwright-vs-cypress).

It is difficult to say which library is better.
One advantage of Playwright is its browser support; Playwright supports Chrome, Firefox and Webkit-based browsers like Safari.
Currently, Cypress includes support for all these browsers, although Webkit support is experimental and does not support all of Cypress features.

Now let's explore Playwright.

### Initializing tests

Unlike the backend tests or unit tests done on the React front-end, End to End tests do not need to be located in the same npm project where the code is.
Let's make a completely separate project for the E2E tests with the `npm init` command.
Then install Playwright by running in the new project directory the command:

```js
npm init playwright@latest
```

The installation script will ask a few questions, answer them as follows:

![answer: javascript, tests, false, true](../../images/5/play0.png)

Notice that when installing Playwright your operating system may not support all of the browsers Playwright offers and you may see an error message like below:

```bash
Webkit 18.0 (playwright build v2070) downloaded to /home/user/.cache/ms-playwright/webkit-2070
Playwright Host validation warning: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libicudata.so.66                                 ║
║     libicui18n.so.66                                 ║
║     libicuuc.so.66                                   ║
║     libjpeg.so.8                                     ║
║     libwebp.so.6                                     ║
║     libpcre.so.3                                     ║
║     libffi.so.7                                      ║
╚══════════════════════════════════════════════════════╝
```

If this is the case you can either specify specific browsers to test with `--project=` in your *package.json*:

```json
    "test": "playwright test --project=chromium --project=firefox",
```

or remove the entry for any problematic browsers from your *playwright.config.js* file:

```json
  projects: [
    // ...
    //{
    //  name: "webkit",
    //  use: { ...devices["Desktop Safari"] },
    //},
    // ...
  ]
```

Let's define an npm script for running tests and test reports in *package.json*:

```json
{
  // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
}
```

During installation, the following is printed to the console:

```text
And check out the following files:
  - ./tests/example.spec.js - Example end-to-end test
  - ./tests-examples/demo-todo-app.spec.js - Demo Todo App end-to-end tests
  - ./playwright.config.js - Playwright Test configuration
```

that is, the location of a few example tests for the project that the installation has created.

Let's run the tests:

```bash
$ npm test

> tasks-e2e@1.0.0 test
> playwright test


Running 6 tests using 5 workers
  6 passed (3.9s)

To open last HTML report run:

  npx playwright show-report
```

The tests pass.
A more detailed test report can be opened either with the command suggested by the output, or with the npm script we just defined:

```bash
npm run test:report
```

Tests can also be run via the graphical UI with the command:

```bash
npm run test -- --ui
```

Sample tests in the file tests/example.spec.js look like this:

```js
// @ts-check
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/"); // highlight-line

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole("heading", { name: "Installation" })).toBeVisible();
});
```

The first line of the test functions says that the tests are testing the page at <https://playwright.dev/>.

### Testing our own code

Now let's remove the sample tests and start testing our own application.

Playwright tests assume that the system under test is running when the tests are executed.
Unlike, for example, backend integration tests, Playwright tests **do not start** the system under test during testing.

Let's make an npm script for the *backend*, which will enable it to be started in testing mode,
i.e. so that `NODE_ENV` gets the value `test`.

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development node --watch index.js",
    "test": "cross-env NODE_ENV=test node --test",
    "lint": "eslint .",
    // ...
    "start:test": "cross-env NODE_ENV=test node --watch index.js" // highlight-line
  },
  // ...
}
```

Let's start the frontend and backend, and create the first test file for the application *tests/task_app.spec.js*:

```js
const { test, expect } = require("@playwright/test");

test("front page can be opened", async ({ page }) => {
  await page.goto("http://localhost:5173");

  const locator = page.getByText("Tasks");
  await expect(locator).toBeVisible();
  await expect(page.getByText("Task app, Department of Computer Science, University of the Pacific 2025")).toBeVisible();
});
```

First, the test opens the application with the [method `page.goto`](https://playwright.dev/docs/writing-tests#navigation).
After this, it uses [`page.getByText`](https://playwright.dev/docs/api/class-page#page-get-by-text)
to get a [*`locator`*](https://playwright.dev/docs/locators) that corresponds to the element where the text *`Tasks`* is found.

The [method `toBeVisible`](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-visible)
ensures that the element corresponding to the locator is visible at the page.

The second check is done without using the auxiliary variable.

The test fails because an old year ended up in the test.
Playwright opens the test report in the browser and it becomes clear that Playwright has actually performed the tests with three different browsers:
Chrome, Firefox and Webkit, i.e. the browser engine used by Safari:

![test report showing the test failing in three different browsers](../../images/5/play2.png)

By clicking on the report of one of the browsers, we can see a more detailed error message:

![test error message](../../images/5/play3a.png)

In the big picture, it is of course a very good thing that the testing takes place with all three commonly used browser engines,
but this is slow, and when developing the tests it is probably best to carry them out mainly with only one browser.
You can define the browser engine to be used with the command line parameter:

```bash
npm test -- --project chromium
```

Now let's fix the test with the correct year and let's add a `describe` block to the tests:

```js
const { test, describe, expect } = require("@playwright/test");

describe("Task app", () => {  // highlight-line
  test("front page can be opened", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const locator = page.getByText("Tasks");
    await expect(locator).toBeVisible();
    await expect(page.getByText("Task app, Department of Computer Science, University of the Pacific 2025")).toBeVisible();
  });
});
```

Before we move on, let's break the tests one more time.
We notice that the execution of the tests is quite fast when they pass, but much slower if the they do not pass.
The reason for this is that Playwright's policy is to wait for searched elements until [they are rendered and ready for action](https://playwright.dev/docs/actionability).
If the element is not found, a `TimeoutError` is raised and the test fails.
Playwright waits for elements by default for 5 or 30 seconds [depending on the functions used in testing](https://playwright.dev/docs/test-timeouts#introduction).

When developing tests, it may be wiser to reduce the waiting time to a few seconds.
According to the [documentation](https://playwright.dev/docs/test-timeouts), this can be done by changing the file *playwright.config.js* as follows:

```js
export default defineConfig({
  // ...
  timeout: 3000, // highlight-line
  fullyParallel: false, // highlight-line
  workers: 1, // highlight-line
  // ...
});
```

We also made two other changes to the file, specifying that all tests [be executed one at a time](https://playwright.dev/docs/test-parallel).
With the default configuration, the execution happens in parallel, and since our tests use a database, parallel execution causes problems.

### Writing on the form

Let's write a new test that tries to log into the application.
Let's assume that a user is stored in the database, with username `powercat` and password `tigers`.

Let's start by opening the login form.

```js
describe("Task app", () => {
  // ...

  test("user can log in", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "login" }).click();
  });
});
```

The test first uses the [method `page.getByRole`](https://playwright.dev/docs/api/class-page#page-get-by-role) to retrieve the button based on its text.
The method returns the [`Locator`](https://playwright.dev/docs/api/class-locator) corresponding to the `Button` element.
Pressing the button is performed using the Locator [method `click`](https://playwright.dev/docs/api/class-locator#locator-click).

When developing tests, you could use Playwright's [UI mode](https://playwright.dev/docs/test-ui-mode), i.e. the user interface version.
Let's start the tests in UI mode as follows:

```bash
npm test -- --ui
```

We now see that the test finds the button

![playwright UI rendering the tasks app while testing it](../../images/5/play4.png)

After clicking, the form will appear

![playwright UI rendering the login form of the tasks app](../../images/5/play5.png)

When the form is opened, the test should look for the text fields and enter the username and password in them.
Let's make the first attempt using the [method `page.getByRole`](https://playwright.dev/docs/api/class-page#page-get-by-role):

```js
describe("Task app", () => {
  // ...

  test("user can log in", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "login" }).click();
    await page.getByRole("textbox").fill("powercat");  // highlight-line
  });
});
```

This results in an error:

```bash
Error: locator.fill: Error: strict mode violation: getByRole("textbox") resolved to 2 elements:
  1) <input value=""/> aka locator("div").filter({ hasText: /^username$/ }).getByRole("textbox")
  2) <input value="" type="password"/> aka locator("input[type="password"]")
```

The problem now is that `getByRole` finds two text fields, and calling the [`fill` method](https://playwright.dev/docs/api/class-locator#locator-fill) fails,
because it assumes that there is only one text field found.
One way around the problem is to use the methods [`first`](https://playwright.dev/docs/api/class-locator#locator-first) and [`last`](https://playwright.dev/docs/api/class-locator#locator-last):

```js
describe("Task app", () => {
  // ...

  test("user can log in", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "login" }).click();
    // highlight-start
    await page.getByRole("textbox").first().fill("powercat");
    await page.getByRole("textbox").last().fill("tigers");
    await page.getByRole("button", { name: "login" }).click();
  
    await expect(page.getByText("Powercat logged in")).toBeVisible();
    // highlight-end
  });
});
```

After writing in the text fields, the test presses the `login` button and checks that the application renders the logged-in user's information on the screen.

If there were more than two text fields, using the methods `first` and `last` would not be enough.
One possibility would be to use the [`all` method](https://playwright.dev/docs/api/class-locator#locator-all), which turns the found locators into an array that can be indexed:

```js
describe("Task app", () => {
  // ...
  test("user can log in", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "login" }).click();
    // highlight-start
    const textboxes = await page.getByRole("textbox").all();

    await textboxes[0].fill("test");
    await textboxes[1].fill("pacific");
    // highlight-end

    await page.getByRole("button", { name: "login" }).click();
  
    await expect(page.getByText("Pacific Tests logged in")).toBeVisible();
  });  
});
```

Both this and the previous version of the test work.
However, both are problematic to the extent that if the registration form is changed, the tests may break, as they rely on the fields to be on the page in a certain order.

If an element is difficult to locate in tests, you can assign it a separate `test-id` attribute and find the element in tests using the [`getByTestId` method](https://playwright.dev/docs/api/class-page#page-get-by-test-id).

Let's now take advantage of the existing elements of the login form.
The input fields of the login form have been assigned unique *labels*:

```js
// ...
<form onSubmit={handleSubmit}>
  <div>
    <label> // highlight-line
      username // highlight-line
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
      />
    </label> // highlight-line
  </div>
  <div>
    <label> // highlight-line
      password // highlight-line
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
    </label> // highlight-line
  </div>
  <button type="submit">login</button>
</form>
// ...
```

Input fields can and should be located in tests using *labels* with the [`getByLabel` method](https://playwright.dev/docs/api/class-page#page-get-by-label):

```js
describe("Task app", () => {
  // ...

  test("user can log in", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "login" }).click();
    await page.getByLabel("username").fill("root"); // highlight-line
    await page.getByLabel("password").fill("tigers");  // highlight-line
  
    await page.getByRole("button", { name: "login" }).click(); 
  
    await expect(page.getByText("Superuser logged in")).toBeVisible();
  });
});
```

When locating elements, it makes sense to aim to utilize the content visible to the user in the interface,
as this best simulates how a user would actually find the desired input field while navigating the application.

Notice that passing the test at this stage requires that there is a user in the *test* database of the backend with username *`root`* and password *`tigers`*.
Create a user if needed!

### Test Initialization

Since both tests start in the same way, i.e. by opening the page <http://localhost:5173>,
it is recommended to isolate the common part in the `beforeEach` block that is executed before each test:

```js
const { test, describe, expect, beforeEach } = require("@playwright/test")

describe("Task app", () => {
  // highlight-start
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });
  // highlight-end

  test("front page can be opened", async ({ page }) => {
    const locator = page.getByText("Tasks");
    await expect(locator).toBeVisible();
    await expect(page.getByText("Task app, Department of Computer Science, University of the Pacific 2025")).toBeVisible();
  });

  test("user can log in", async ({ page }) => {
    await page.getByRole("button", { name: "login" }).click();
    await page.getByLabel("username").fill("root");
    await page.getByLabel("password").fill("tigers");
    await page.getByRole("button", { name: "login" }).click();
    await expect(page.getByText("Superuser logged in")).toBeVisible();
  });
});
```

### Testing task creation

Next, let's create a test that adds a new task to the application:

```js
const { test, describe, expect, beforeEach } = require("@playwright/test");

describe("Task app", () => {
  // ...

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "login" }).click();
      await page.getByLabel("username").fill("root");
      await page.getByLabel("password").fill("tigers");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new task can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new task" }).click();
      await page.getByRole("textbox").fill("a task created by playwright");
      await page.getByRole("button", { name: "save" }).click();
      await expect(page.getByText("a task created by playwright")).toBeVisible();
    });
  });  
});
```

The test is defined in its own `describe` block.
Creating a task requires that the user is logged in, which is handled in the `beforeEach` block.

The test trusts that when creating a new task, there is only one input field on the page, so it searches for it as follows:

```js
page.getByRole("textbox");
```

If there were more fields, the test would break.
Because of this, it could be better to add a *test-id* to the form input and search for it in the test based on this id.

> **FYI:** the test will only pass the first time.
> The reason for this is that its expectation
>
> ```js
> await expect(page.getByText("a task created by playwright")).toBeVisible();
> ```
>
> causes problems when the same task is created in the application more than once.
> The problem will be solved in the next section.

The structure of the tests looks like this:

```js
const { test, describe, expect, beforeEach } = require("@playwright/test");

describe("Task app", () => {
  // ....

  test("user can log in", async ({ page }) => {
    await page.getByRole("button", { name: "login" }).click();
    await page.getByLabel("username").fill("root");
    await page.getByLabel("password").fill("tigers");
    await page.getByRole("button", { name: "login" }).click();
    await expect(page.getByText("Superuser logged in")).toBeVisible();
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "login" }).click();
      await page.getByLabel("username").fill("root");
      await page.getByLabel("password").fill("tigers");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new task can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new task" }).click();
      await page.getByRole("textbox").fill("a task created by playwright");
      await page.getByRole("button", { name: "save" }).click();
      await expect(page.getByText("a task created by playwright")).toBeVisible();
    });
  });
});
```

Since we have prevented the tests from running in parallel, Playwright runs the tests in the order they appear in the test code.
The first test, ***user can log in***, checks whether the user *`root`* can login to the application.
Then, the test ***a new task can be created*** gets executed, which also performs a login (*shown in the `beforeEach` block*).

> ***Pertinent:*** Why do we login again, *isn't the user already logged in because of the first test*?
> No, because the execution of each test starts from the browser's **zero state**, *all changes made to the browser's state by the previous tests are reset*.

### Controlling the state of the database

If the tests need to be able to modify the server's database, the situation immediately becomes more complicated.
Ideally, the *server's database should be the same each time we run the tests*, so our tests can be reliably and easily repeatable.

As with unit and integration tests, with E2E tests it is best to empty the database and possibly format it before the tests are run.
The challenge with E2E tests is that they do not have access to the database.

The solution is to ***create API endpoints for the backend tests***.
We can empty the database using these endpoints.
Let's create a new **router** for the tests in *controllers/testing.js*.

```js
const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");

router.post("/reset", async (request, response) => {
  await Task.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = router
```

Now, let's add this router to the backend only *if the application is run in test-mode*:

```js
// ...

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/tasks", tasksRouter);

// highlight-start
if (process.env.NODE_ENV === "test"); {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
// highlight-end

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app
```

After the changes, *an HTTP POST request to the **/api/testing/reset** endpoint empties the database*.
Make sure your backend is running in test mode by starting it with this command (previously configured in the *package.json* file):

```bash
  npm run start:test
```

The modified backend code can be found on the [GitHub](https://github.com/comp227/tasks-e2e/tree/part5-1) branch *part5-1*.

#### Controlling the state of the database on the frontend

Next, we will change the `beforeEach` block so that it empties the server's database before tests are run.

Currently, it is not possible to add new users through the frontend's UI, so we add a new user to the backend from the `beforeEach` block.
While it may be a matter of preference, ***I"m going to make a different test user entirely*** (called *Pacific Tests*),
which means that I"ll also **change my tests slightly** to login with the new user.
If you want to minimize your changes, just change our `Pacific Tests` user back to the previous details of our previous user in the code below.

```js
describe("Task app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Pacific Tests",
        username: "test",
        password: "pacific"
      }
    });

    await page.goto("http://localhost:5173")
  });
  
  test("front page can be opened",  () => {
    // ...
  });

  test("user can login", () => {
    // ...
  });

  describe("when logged in", () => {
    // ...
  });
});
```

During initialization, the test makes HTTP requests to the backend with the [method `post`](https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-post)
of the parameter `request`.

> Unlike before, now the testing of the backend *always starts from the same state*, i.e. there is one user and no tasks in the database.

Let's make a **test that checks that the importance of the tasks can be changed**.
There are a few different approaches to taking the test.

In the following, we first look for a task and click on its button that has text ***make not important***.
After this, we check that the task contains the button with ***make important***.

```js
describe("Task app", () => {
  // ...

  describe("when logged in", () => {
    // ...

    // highlight-start
    describe("and a task exists", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("button", { name: "new task" }).click();
        await page.getByRole("textbox").fill("a test task by playwright");
        await page.getByRole("button", { name: "save" }).click();
      })
  
      test("importance can be changed", async ({ page }) => {
        await page.getByRole("button", { name: "make not important" }).click();
        await expect(page.getByText("make important")).toBeVisible();
      });
    // highlight-end
    });
  });
});
```

This means that for our test `*importance can be changed*`, we execute the commands in the `beforeEach` block where playwright:

1. Clicks on a button that has the name *`new task`*
2. Fills the textbox with the text ***a test task by playwright*** and
3. inside it the button ***make not important*** and clicks on it.

Before we start executing the test.
This means that by the time that we sarch for make not important, we are clicking the importance of the task, ***a test task by playwright***,
and ensure that the text of that for the button on that task has changed to ***make important***.

### Test for failed login

Now let's do a test that ensures that the login attempt fails if the password is wrong.

The first version of the test looks like this:

```js
describe("Task app", () => {
  // ...

  test("login fails with wrong password", async ({ page }) => {
    await page.getByRole("button", { name: "login" }).click();
    await page.getByLabel("username").fill("test");
    await page.getByLabel("password").fill("wrong");
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("wrong credentials")).toBeVisible();
  });

  // ...
});
```

The test verifies with the [method `page.getByText`](https://playwright.dev/docs/api/class-page#page-get-by-text) that the application prints an error message.

The application renders the error message to an element containing the CSS class `error`:

```js
const Notification = ({ message }); => {
  if (message === null) {
    return null;
  }

  return (
    <div className="error"> // highlight-line
      {message}
    </div>
  );
};
```

We could refine the test to ensure that the error message is printed exactly in the right place, i.e. in the element containing the CSS class `error`:

```js
test("login fails with wrong password", async ({ page }) => {
  // ...

  const errorDiv = page.locator(".error"); // highlight-line
  await expect(errorDiv).toContainText("wrong credentials");
});
```

So the test uses the [`page.locator` method](https://playwright.dev/docs/api/class-page#page-locator) to find the component containing the CSS class `error` and stores it in a variable.
The correctness of the text associated with the component can be verified with the expectation [`toContainText`](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text).
Notice that the [CSS class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) starts with a dot, so the `error` class selector is *`.error`*.

It is also possible to test the application's CSS styles with matcher [`toHaveCSS`](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-css).
For example, we can make sure that the color of the error message is red, and that there is a border around it:

```js
test("login fails with wrong password", async ({ page }) => {
  // ...

  const errorDiv = page.locator(".error");
  await expect(errorDiv).toContainText("wrong credentials");
  await expect(errorDiv).toHaveCSS("border-style", "solid"); // highlight-line
  await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)"); // highlight-line
});
```

Colors must be defined to Playwright as [RGB](https://rgbcolorcode.com/color/red) codes.

Let's finalize this incorrect login test by ensuring that the application **does not render the text describing a successful login**, *`"Pacific Tests logged in"`*:

```js
test("login fails with wrong password", async ({ page }) =>{
  await page.getByRole("button", { name: "login" }).click();
  await page.getByLabel("username").fill("root");
  await page.getByLabel("password").fill("wrong");
  await page.getByRole("button", { name: "login" }).click();

  const errorDiv = page.locator(".error");
  await expect(errorDiv).toContainText("wrong credentials");
  await expect(errorDiv).toHaveCSS("border-style", "solid");
  await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

  await expect(page.getByText("Pacific Tests logged in")).not.toBeVisible(); // highlight-line
});
```

### Running tests one by one

By default, Playwright always runs all tests, and as the number of tests increases, it becomes time-consuming.
When developing a new test or debugging a broken one, the test can be defined with the command *`test.only`*,
which makes Playwright ***run only that test***:

```js
describe(() => {
  // this is the only test executed!
  test.only("login fails with wrong password", async ({ page }) => {  // highlight-line
    // ...
  });

  // this test is skipped...
  test("user can login with correct credentials", async ({ page }) => {
    // ...
  });

  // ...
});
```

When the test no longer needs to be isolated, *`only` can and **should be deleted***.
Otherwise, we keep only running that one test.

Another option to run a single test is to use a command line parameter:

```bash
npm test -- -g "login fails with wrong password"
```

### Helper functions for tests

Our application tests currently look like this:

```js
const { test, describe, expect, beforeEach } = require("@playwright/test");

describe("Task app", () => {
  // ...

  test("user can login with correct credentials", async ({ page }) => {
    await page.getByRole("button", { name: "login" }).click();
    await page.getByLabel("username").fill("test");
    await page.getByLabel("password").fill("pacific");
    await page.getByRole("button", { name: "login" }).click();
    await expect(page.getByText("Pacific Tests logged in")).toBeVisible();
  })

  test("login fails with wrong password", async ({ page }) =>{
    // ...
  });

  describe("when logged in", () => {
    beforeEach(async ({ page, request }) => {
      await page.getByRole("button", { name: "login" }).click();
      await page.getByLabel("username").fill("test");
      await page.getByLabel("password").fill("pacific");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new task can be created", async ({ page }) => {
      // ...
    });
  
    // ...
  });  
});
```

First, the login function is tested.
After this, another `describe` block contains a set of tests that assume that the user is logged in, and that same login is duplicated inside of the initializing `beforeEach` block.

Remember, each test is executed starting from the initial state (where the database is cleared and one user is created there),
so even though the test is defined after another test in the code, it does not start from the same state where the tests in the code executed earlier have left!

While it looks like we need to duplicate the code because of how tests are structured,
(*and we try to keep tests to be simple to understand*),
we should also consider having non-repetitive code in tests, where it makes sense.
Let's isolate the code that handles the login as a helper function, which is placed e.g. in the file *tests/helper.js*:

```js
const loginWith = async (page, username, password)  => {
  await page.getByRole("button", { name: "login" }).click();
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

export { loginWith };
```

The tests becomes simpler and clearer:

```js
const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith } = require("./helper"); // highlight-line

describe("Task app", () => {
  // ...

  test("user can log in", async ({ page }) => {
    await loginWith(page, "test", "pacific"); // highlight-line
    await expect(page.getByText("Powercat logged in")).toBeVisible();
  });

  test("login fails with wrong password", async ({ page }) => {
    await loginWith(page, "test", "wrong"); // highlight-line

    const errorDiv = page.locator(".error");
    // ...
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "test", "pacific") // highlight-line
    });

    // ...
  });
});
```

Playwright also offers a [solution](https://playwright.dev/docs/auth) where the login is performed once before the tests,
and each test starts from a state where the application is already logged in.
In order for us to take advantage of this method, the initialization of the application's test data should be done a bit differently than now.
In the current solution, the database is reset before each test, and because of this, logging in just once before the tests is impossible.
In order for us to use the pre-test login provided by Playwright, the user should be initialized only once before the tests.
We'll stick to our current solution for the sake of simplicity.

The corresponding repeating code actually also applies to creating a new task:

```js
describe("Task app", function() {
  // ...

  describe("when logged in", () => {
    test("a new task can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new task" }).click();
      await page.getByRole("textbox").fill("a task created by playwright");
      await page.getByRole("button", { name: "save" }).click();
      await expect(page.getByText("a task created by playwright")).toBeVisible();
    });
  
    describe("and a task exists", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("button", { name: "new task" }).click();
        await page.getByRole("textbox").fill("a test task by playwright");
        await page.getByRole("button", { name: "save" }).click();
      });
  
      test("it can be made important", async ({ page }) => {
        // ...
      });
    });
  });
});
```

We can isolate task creation to a helper function.
The file *tests/helper.js* expands as follows:

```js
const loginWith = async (page, username, password)  => {
  await page.getByRole("button", { name: "login" }).click();
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

// highlight-start
const createTask = async (page, content) => {
  await page.getByRole("button", { name: "new task" }).click();
  await page.getByRole("textbox").fill(content);
  await page.getByRole("button", { name: "save" }).click();
};
// highlight-end

export { loginWith, createTask }; // highlight-line
```

This function, in turn, simplifies our tests:

```js
const { test, describe, expect, beforeEach } = require("@playwright/test");
const { createTask, loginWith } = require("./helper"); // highlight-line

describe("Task app", () => {
  // ...

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "test", "pacific");
    });

    test("a new task can be created", async ({ page }) => {
      await createTask(page, "a task created by playwright"); // highlight-line
      await expect(page.getByText("a task created by playwright")).toBeVisible();
    });

    describe("and a task exists", () => {
      beforeEach(async ({ page }) => {
        await createTask(page, "a test task by playwright"); // highlight-line
      });
  
      test("importance can be changed", async ({ page }) => {
        await page.getByRole("button", { name: "make not important" }).click();
        await expect(page.getByText("make important")).toBeVisible();
      });
    });
  });
});
```

There is one more annoying feature in our tests.
The frontend address <http://localhost:5173> and the backend address <http://localhost:3001> are hardcoded for tests.
Of these, ***the address of the backend is actually useless***, because a proxy has been defined in the Vite configuration of the frontend,
which forwards all requests made by the frontend to the address <http://localhost:5173/api> to the backend:

```js
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    }
  },
  // ...
});
```

So we can replace all the addresses in the tests from ***`http://localhost:3001/api/...`*** to ***`http://localhost:5173/api/...`***

We can now define the `baseUrl` for the application in the tests configuration file *playwright.config.js*:

```js
export default defineConfig({
  // ...
  use: {
    baseURL: "http://localhost:5173",
    // ...
  },
  // ...
});
```

All the commands in the tests that use the application URL, e.g.

```js
await page.goto("http://localhost:5173");
await request.post("http://localhost:5173/api/testing/reset");
```

can be transformed to:

```js
await page.goto("/");
await request.post("/api/testing/reset");
```

The current code for the tests is on [GitHub](https://github.com/comp227/tasks-e2e/tree/part5-2) branch *part5-2*.

### Task importance change revisited

Let's take a look at the test we did earlier, which verifies that it is possible to change the importance of a task.

Let's change the initialization block of the test so that it creates two tasks instead of one:

```js
describe("when logged in", () => {
  // ...
  describe("and several tasks exists", () => { // highlight-line
    beforeEach(async ({ page }) => {
      // highlight-start
      await createTask(page, "first task");
      await createTask(page, "second task");
      // highlight-end
    });

    test("one of those can be made non-important", async ({ page }) => {
      const otherTaskElement = page.getByText("first task");

      await otherTaskElement
        .getByRole("button", { name: "make not important" }).click();
      await expect(otherTaskElement.getByText("make important")).toBeVisible();
    });
  });
});
```

The above test searches for the element `first task`using the method `page.getByText` and stores it in a variable (`otherTaskElement`).
After this, a button with the text ***make not important*** is searched inside the element and the button is pressed.
Finally, the test verifies that the button's text has changed to ***make important***.

The test could also have been written without the auxiliary variable *`otherTaskElement`*:

```js
test("one of those can be made non-important", async ({ page }) => {
  page.getByText("first task")
    .getByRole("button", { name: "make not important" }).click();

  await expect(page.getByText("first task").getByText("make important"))
    .toBeVisible();
});
```

Let's change the `Task` component so that the task text is rendered inside a `span` element

```js
const Task = ({ task, toggleImportance }); => {
  const label = task.important
    ? "make not important" : "make important";

  return (
    <li className="task">
      <span>{task.content}</span> // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};
```

If you run the tests now, *the tests break*!
The reason for the problem is that the command `page.getByText("first task")` now returns a `span` element containing only text, and the button is outside of it.

One way to fix the problem is as follows:

```js
test("one of those can be made non-important", async ({ page }) => {
  const otherTaskText = page.getByText("first task"); // highlight-line
  const otherTaskElement = otherTaskText.locator(".."); // highlight-line

  await otherTaskElement.getByRole("button", { name: "make not important" }).click();
  await expect(otherTaskElement.getByText("make important")).toBeVisible();
});
```

The first line now looks for the `span` element containing the text associated with the first created task.
In the second line, the function `locator` is used and `..` is given as an argument, which retrieves the element's parent element.
The locator function is very flexible, and we take advantage of the fact that accepts [as argument](https://playwright.dev/docs/locators#locate-by-css-or-xpath)
not only CSS selectors but also [***XPath selector***](https://developer.mozilla.org/en-US/docs/Web/XPath).
It would be possible to express the same with CSS, but in this case XPath provides the simplest way to find the parent of an element.

Of course, the test can also be written using only one auxiliary variable:

```js
test("one of those can be made non-important", async ({ page }) => {
  const secondTaskElement = page.getByText("second task").locator("..");
  await secondTaskElement.getByRole("button", { name: "make not important" }).click();
  await expect(secondTaskElement.getByText("make important")).toBeVisible();
});
```

Let's change the test so that three tasks are created, and the importance is changed in the second created task:

```js
describe("when logged in", () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, "root", "tigers");
  });

  test("a new task can be created", async ({ page }) => {
    await createTask(page, "a task created by playwright", true);
    await expect(page.getByText("a task created by playwright")).toBeVisible();
  });

  describe("and several tasks exists", () => {
    beforeEach(async ({ page }) => {
      await createTask(page, "first task");
      await createTask(page, "second task");
      await createTask(page, "third task"); // highlight-line
    });

    test("one of those can be made non-important", async ({ page }) => {
      const otherTaskText = page.getByText("second task"); // highlight-line
      const otherTaskElement = otherTaskText.locator("..");
    
      await otherTaskElement.getByRole("button", { name: "make not important" }).click();
      await expect(otherTaskElement.getByText("make important")).toBeVisible();
    });
  });
}); 
```

For some reason if we start running the tests,
the ***tests starts working unreliably***, sometimes it passes and sometimes it doesn't.
It's time to roll up your sleeves and learn how to debug tests.

### Test development and debugging

If, and when the tests don't pass and you suspect that the fault is in the tests instead of in the code,
you should run the tests in [**debug mode**](https://playwright.dev/docs/debug#run-in-debug-mode-1).

The following command runs the problematic test in debug mode:

```bash
npm test -- -g"one of those can be made non-important" --debug
```

Playwright-inspector shows the progress of the tests step by step.
The **arrow-dot** button at the top takes the tests one step further.
The elements found by the locators and the interaction with the browser are visualized in the browser:

![playwright inspector highlighting element found by the selected locator in the application](../../images/5/play6a.png)

By default, debug steps through the test command by command.
If it is a complex test, it can be quite a burden to step through the test to the point of interest.
This can be avoided by using the command `await page.pause()`:

```js
describe("Task app", () => {
  beforeEach(async ({ page, request }) => {
    // ...
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      // ...
    });

    describe("and several tasks exists", () => {
      beforeEach(async ({ page }) => {
        await createTask(page, "first task");
        await createTask(page, "second task");
        await createTask(page, "third task");
      });
  
      test("one of those can be made non-important", async ({ page }) => {
        await page.pause(); // highlight-line
        const otherTaskText = page.getByText("second task");
        const otherTaskElement = otherTaskText.locator("..");
      
        await otherTaskElement.getByRole("button", { name: "make not important" }).click();
        await expect(otherTaskElement.getByText("make important")).toBeVisible();
      });
    });
  });
});
```

Now in the test you can go to `page.pause()` in one step, by pressing the green arrow symbol in the inspector.
When we now run the test and jump to the `page.pause()` command, we find an interesting fact:

![playwright inspector showing the state of the application at page.pause](../../images/5/play6b.png)

> ***Pertinent:*** It seems that the browser ***does not render*** all the tasks created in the block `beforeEach`.
> What is the problem?
>
> The reason for the problem is that when the test creates one task, it starts creating the next one even before the server has responded, and the added task is rendered on the screen.
> This in turn can cause some tasks to be lost (in the picture, this happened to the second task created),
> since the browser is re-rendered when the server responds, based on the state of the tasks at the start of that insert operation.
>
> The problem can be solved by "slowing down" the insert operations
> by using the [`waitFor` method](https://playwright.dev/docs/api/class-locator#locator-wait-for) after the insert to wait for the inserted task to render:
>
> ```js
> const createTask = async (page, content) => {
>   await page.getByRole("button", { name: "new task" }).click();
>   await page.getByRole("textbox").fill(content);
>   await page.getByRole("button", { name: "save" }).click();
>   await page.getByText(content).waitFor(); // highlight-line
> }
> ```

Instead of, or alongside debugging mode, running tests in UI mode can be useful.
As already mentioned, tests are started in UI mode as follows:

```bash
npm run test -- --ui
```

Almost the same as UI mode is use of the Playwright's [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro).
The idea is that a ***visual trace*** of the tests is saved, which can be viewed if necessary after the tests have been completed.
A trace is saved by running the tests as follows:

```bash
npm run test -- --trace on
```

If necessary, Trace can be viewed with the command

```bash
npx playwright show-report
```

or with the npm script we defined `npm run test:report`

Trace looks practically the same as running tests in UI mode.

UI mode and Trace Viewer also offer the possibility of assisted search for locators.
This is done by pressing the double circle on the left side of the lower bar, and then by clicking on the desired user interface element.
Playwright displays the element locator:

![playwright's trace viewer with red arrows pointing at the locator assisted search location and to the element selected with it showing a suggested locator for the element](../../images/5/play8.png)

Playwright suggests the following as the locator for the third task

```js
page.locator("li").filter({ hasText: "third task" }).getByRole("button");
```

The method [`page.locator`](https://playwright.dev/docs/api/class-page#page-locator) is called with the argument `li`,
i.e. we search for all `li` elements on the page, of which there are three in total.
After this, using the [`locator.filter` method](https://playwright.dev/docs/api/class-locator#locator-filter),
we narrow down to the `li` element that contains the text ***`third task`*** and the button element inside it is taken using the
[`locator.getByRole` method](https://playwright.dev/docs/api/class-locator#locator-get-by-role).

The locator generated by Playwright is somewhat different from the locator used by our tests, which was

```js
page.getByText("first task").locator("..").getByRole("button", { name: "make not important" });
```

Which of the locators is better is probably a matter of taste.

Playwright also includes a [test generator](https://playwright.dev/docs/codegen-intro) that makes it possible to "record" a test through the user interface.
The test generator is started with the command:

```bash
npx playwright codegen http://localhost:5173/
```

When the `Record` mode is on, the test generator "records" the user's interaction in the Playwright inspector, from where it is possible to copy the locators and actions to the tests:

![playwright's record mode enabled with its output in the inspector after user interaction](../../images/5/play9.png)

Instead of the command line, Playwright can also be used via [Webstorm's IDE](https://www.jetbrains.com/help/webstorm/playwright.html).

To avoid problem situations and increase understanding, it is definitely worth browsing Playwright's high-quality [documentation](https://playwright.dev/docs/intro).
The most important sections are listed below:

- the section about [locators](https://playwright.dev/docs/locators) gives good hints for finding elements in test
- section [actions](https://playwright.dev/docs/input) tells how it is possible to simulate the interaction with the browser in tests
- the section about [assertions](https://playwright.dev/docs/test-assertions) demonstrates the different expectations Playwright offers for testing

In-depth details can be found in the [API](https://playwright.dev/docs/api/class-playwright) description,
particularly useful are the class [`Page`](https://playwright.dev/docs/api/class-page) corresponding to the browser window of the application under test,
and the class [`Locator`](https://playwright.dev/docs/api/class-locator) corresponding to the elements searched for in the tests.

The final version of the tests is in full on [GitHub](https://github.com/comp227/tasks-e2e/tree/part5-3), in branch *part5-3*.

The final version of the frontend code is in its entirety on [GitHub](https://github.com/comp227/part2-tasks-frontend/tree/part5-9), in branch *part5-9*.

</div>

<div class="tasks">

### Exercises 5.17-5.22

In the last exercises of this part, we will do some E2E tests for our Watchlist application.
The material above should be enough to complete the exercises.
However, you **should definitely read Playwright's [documentation](https://playwright.dev/docs/intro) and [API description](https://playwright.dev/docs/api/class-playwright)**,
at least the sections mentioned at the end of the previous chapter.

#### 5.17: Watchlist End To End Testing, Step 1

Create a new npm project for tests and configure Playwright there.

Make a test to ensure that the application displays the login form by default.

The body of the test should be as follows:

```js
const { test, expect, beforeEach, describe } = require("@playwright/test")

describe("Watchlist app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    // ...
  });
});

```

#### 5.18: Watchlist End To End Testing, Step 2

Make tests for logging in.
Test both successful and unsuccessful login attempts.
Make a new user in the `beforeEach` block for the tests.

The body of the tests expands as follows

```js
const { test, expect, beforeEach, describe } = require("@playwright/test")

describe("Watchlist app", () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    // create a user for the backend here
    // ...
  });

  test("Login form is shown", async ({ page }) => {
    // ...
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      // ...
    });

    test("fails with wrong credentials", async ({ page }) => {
      // ...
    });
  });
});
```

The `beforeEach` block must empty the database using, for example, the `reset` method we used in the [material](#controlling-the-state-of-the-database).

**Optional bonus exercise**: Check that the notification shown with unsuccessful login is displayed red.

#### 5.19: Watchlist End To End Testing, Step 3

Create a test that verifies that a logged in user can recommend a new show.
The structure of the test may look like the following:

```js
describe("When logged in", () => {
  beforeEach(async ({ page }) => {
    // ...
  });

  test("a new show can be added", async ({ page }) => {
    // ...
  });
});
```

The test should ensure that the recommended show is visible in the list of shows.

#### 5.20: Watchlist End To End Testing, Step 4

Do a test that makes sure that a show can be liked.

#### 5.21: Blog List End To End Testing, Step 5

Make a test for ensuring that the user who recommended a show can delete it.
If you use the `window.confirm` dialog in the delete operation, you may have to Google how to use the dialog in the Playwright tests.

#### 5.22: Watchlist End To End Testing, Step 6

Make an additional test that other users do not see a delete button on shows they did not recommend.

#### 5.23*: Watchlist End To End Testing, Step 7

Make a test that checks that the shows are ordered according to likes - the show with the most likes should be first.

*This task is significantly more challenging than the previous ones.*

This was the last exercise of this part, and it's time to push your code to GitHub if you haven't already and mark the exercises that were completed on Canvas.

</div>
