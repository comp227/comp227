---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: en
---

<div class="content">

There are many different ways of testing React applications.
Let's take a look at few of those next.

The course previously used the [Jest](http://jestjs.io/) library developed by Facebook to test React components.
We are now using the new generation of testing tools from Vite developers called [Vitest](https://vitest.dev/).
Apart from the configurations, the libraries provide the same programming interface, so there is virtually no difference in the test code.

Let's start by installing Vitest and the [**jsdom** library](https://github.com/jsdom/jsdom) library simulating a web browser:

```bash
npm i -D vitest jsdom
```

In addition to Vitest, we also need another *testing library that will help us render components* for testing purposes.
The current best option for this is [**react-testing-library**](https://github.com/testing-library/react-testing-library)
which has seen rapid growth in popularity in recent times.
It is also worth extending the expressive power of the tests with the [**jest-dom**](https://github.com/testing-library/jest-dom) library.

Let's install the libraries with the command:

```bash
npm i -D @testing-library/react @testing-library/jest-dom
```

Before we can do the first test, we need some additional configuration in *package.json*:

```js
{
  "scripts": {
    // ...
    "test": "vitest run"
  }
  // ...
}
```

Let's create a file *testSetup.js* in the project root with the following content

```js
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});
```

Now, after each test, the function `cleanup` is executed to reset jsdom, which is simulating the browser.

Expand the *vite.config.js* file as follows

```js
export default defineConfig({
  // ...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
  }
});
```

With `globals: true`, there is no need to import keywords such as *`describe`*, *`test`* and *`expect`* into the tests.

Before we start writing tests, let's review the `Task` component and what it renders:

```js
const Task = ({ task, toggleImportance }) => {
  const label = task.important
    ? "make not important"
    : "make important";

  return (
    <li className='task'> // highlight-line
      {task.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};
```

Notice that the `li` element has the [CSS](https://react.dev/learn#adding-styles) className **`task`**,
which could be used to access the component in our tests.

### Rendering the component for tests

We will write our first test in the *src/components/Task.test.js* file, which is in the same directory as the component itself.

The first test verifies that the component renders the contents of the task:

```js
import { render, screen } from "@testing-library/react";
import Task from "./Task";

test("renders content", () => {
  const task = {
    content: "Component testing is done with react-testing-library",
    important: true
  };

  // highlight-start
  render(<Task task={task} />);

  const element = screen.getByText("Component testing is done with react-testing-library");
  expect(element).toBeDefined();
  // highlight-end
});
```

Before we run the test, let's examine the contents of the test itself.
After some initial configuration, our newest test renders the component with the
[`render` method](https://testing-library.com/docs/react-testing-library/api#render)
provided by the *react-testing-library*:

```js
render(<Task task={task} />);
```

Normally React components are rendered to the [***DOM***](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model).
The `render` method we used renders the components in a format that is **suitable for tests without rendering them to the DOM**.

We can use the [`screen` object](https://testing-library.com/docs/queries/about#screen) to access the rendered component.
We use `screen`'s method [`getByText`](https://testing-library.com/docs/queries/bytext)
to search for an element that has the task content and ensure that it exists:

```js
  const element = screen.getByText("Component testing is done with react-testing-library");
  expect(element).toBeDefined();
```

The existence of an element is checked using Vitest's [`expect` command](https://vitest.dev/api/expect.html#expect).
`expect` generates an assertion for its argument, the validity of which can be tested using various condition functions.
Now we used [`toBeDefined`](https://vitest.dev/api/expect.html#tobedefined) which tests whether the *`element`* argument of `expect` exists.

### Running tests

Run the test with command `npm test`:

```bash
$ npm test

> tasks@0.0.0 test
> vitest run


 RUN  v3.2.3 /home/src/comp227/tasks-frontend

 ✓ src/components/Task.test.jsx (1 test) 19ms
   ✓ renders content 18ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  14:31:54
   Duration  874ms (transform 51ms, setup 169ms, collect 19ms, tests 19ms, environment 454ms, prepare 87ms)
```

Eslint complains about the keywords `test` and `expect` in the tests. The problem can be solved by adding the following configuration to the *eslint.config.js* file:

```js
// ...

export default [
  // ...
  // highlight-start
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    }
  }
  // highlight-end
]
```

This is how ESLint is informed that Vitest keywords are globally available in test files.

### Test file location

In React there are (at least)
[two different conventions](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850)
for the test file's location.
We created our test files according to the current standard by placing them in the same directory as the component being tested.

The other convention is to store the test files in a separate *test* directory.
This debate on which convention is better is almost as contentious (*and hilarious IMO*) as [the debate on whether you use Tabs or Spaces for indentation](https://www.youtube.com/watch?v=SsoOG6ZeyUI).

I prefer to store tests and application code separately.
Nonetheless, we'll keep them in the same folder because some of the previous libraries we've used follow this convention by default.

### Searching for content in a component

The *react-testing-library* package offers many different ways of investigating the content of the component being tested.
In reality, *the `expect` in our test is not needed at all*!

```js
import { render, screen } from "@testing-library/react";
import Task from "./Task";

test("renders content", () => {
  const task = {
    content: "Component testing is done with react-testing-library",
    important: true
  };

  render(<Task task={task} />);

  const element = screen.getByText("Component testing is done with react-testing-library");

  expect(element).toBeDefined(); // highlight-line
});
```

The test fails if, on the previous line, *`getByText` does not find the element it is looking for*.

The `getByText` command, by default, searches for an element that contains only the **text provided as a parameter** and nothing else.
Let us assume that a component would render text to an HTML element as follows:

```js
const Task = ({ task, toggleImportance }) => {
  const label = task.important
    ? "make not important" : "make important";

  return (
    <li className='task'>
      Your awesome task: {task.content} // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Task;
```

The `getByText` method that the test uses does **not** find the element:

```js
test("renders content", () => {
  const task = {
    content: "Does not work anymore :(",
    important: true
  };

  render(<Task task={task} />);

  const element = screen.getByText("Does not work anymore :(");

  expect(element).toBeDefined();
});
```

If we want to look for an element that ***contains*** the text, we could use an extra option:

```js
const element = screen.getByText(
  "Does not work anymore :(", { exact: false }
);
```

or we could use the `findByText` method:

```js
const element = await screen.findByText("Does not work anymore :(");
```

It is important to notice that, unlike the other `ByText` methods, `findByText` returns a promise!

There are situations where yet another form of the `queryByText` method is useful.
The method returns the element but *it does not cause an exception* if it is not found.

For example, we could use the method to ensure that something *is not rendered* to the component:

```js
test("does not render this", () => {
  const task = {
    content: "This is a reminder",
    important: true
  };

  render(<Task task={task} />);

  const element = screen.queryByText("do not want this thing to be rendered");
  expect(element).toBeNull();
});
```

Other methods also exist, such as [`getByTestId`](https://testing-library.com/docs/queries/bytestid/),
which searches for elements based on ID fields specifically created for testing purposes.

We could also use [**CSS selectors**](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
to find rendered elements by using the [`querySelector` method](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
on the [`container` object](https://testing-library.com/docs/react-testing-library/api/#container-1) that is one of the fields returned by the render:

```js
import { render, screen } from "@testing-library/react";
import Task from "./Task";

test("renders content", () => {
  const task = {
    content: "Component testing is done with react-testing-library",
    important: true
  };

  const { container } = render(<Task task={task} />); // highlight-line

// highlight-start
  const div = container.querySelector(".task");
  expect(div).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
  // highlight-end
});
```

It is, however, recommended to ***search for elements primarily using methods other than the `container` object and CSS selectors***.
*CSS attributes can often be changed* without affecting the application's functionality, and users are not aware of them.
It is better to **search for elements based on properties visible to the user**, for example, by using the `getByText` method.
This way, the tests better simulate the actual nature of the component and how a user would find the element on the screen.

### Debugging tests

We typically run into many different kinds of problems when writing our tests.

Object `screen` has the method [`debug`](https://testing-library.com/docs/queries/about/#screendebug) that can be used to print the HTML of a component to the terminal.
If we change the test as follows:

```js
import { render, screen } from "@testing-library/react";
import Task from "./Task";

test("renders content", () => {
  const task = {
    content: "Component testing is done with react-testing-library",
    important: true
  };

  const { container } = render(<Task task={task} />);

  screen.debug(); // highlight-line

  // ...

});
```

the HTML gets printed to the console:

![showing output to the console](../../images/5/custom/showing_output_of_test.png)

It is also possible to use the same method to print a wanted element to the console:

```js
import { render, screen } from "@testing-library/react";
import Task from "./Task";

test("renders content", () => {
  const task = {
    content: "Component testing is done with react-testing-library",
    important: true
  };

  const { container } = render(<Task task={task} />);

  const element = screen.getByText("Component testing is done with react-testing-library");

  screen.debug(element);  // highlight-line

  // ...
});
```

Now the HTML of the wanted element gets printed:

```js
  <li
    class="task"
  >
    Component testing is done with react-testing-library
    <button>
      make not important
    </button>
  </li>
```

### Clicking buttons in tests

In addition to displaying content, the `Task` component also makes sure that when the button associated with the task is pressed,
the `toggleImportance` event handler function gets called.

Let us install a library called [**user-event**](https://testing-library.com/docs/user-event/intro) that makes simulating user input a bit easier:

```bash
npm i -D @testing-library/user-event
```

Testing this functionality can be accomplished by adding another test like this:

```js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // highlight-line
import Task from "./Task";

// ...

test("clicking the button calls event handler once", async () => {
  const task = {
    content: "Component testing is done with react-testing-library",
    important: true
  };
  
  const mockHandler = vi.fn();  // highlight-line

  render(
    <Task task={task} toggleImportance={mockHandler} /> // highlight-line
  );

  const user = userEvent.setup(); // highlight-line
  const button = screen.getByText("make not important"); // highlight-line
  await user.click(button); // highlight-line

  expect(mockHandler.mock.calls).toHaveLength(1); // highlight-line
});
```

There are a few interesting things related to this test.
The event handler is a [**mock function**](https://vitest.dev/api/mock) defined with Vitest:

```js
const mockHandler = vi.fn()
```

A [**session**](https://testing-library.com/docs/user-event/setup/) is started to interact with the rendered component:

```js
const user = userEvent.setup();
```

The test finds the button *based on the text* from the rendered component and clicks the element:

```js
const button = screen.getByText("make not important");
await user.click(button);
```

Clicking happens via the [`click` method](https://testing-library.com/docs/user-event/convenience/#click) from the *userEvent* library.

The expectation of the test uses [`toHaveLength`](https://vitest.dev/api/expect.html#tohavelength) to verify that the *mock function* has been called exactly once:

```js
expect(mockHandler.mock.calls).toHaveLength(1);
```

The calls to the mock function are saved to the array [`mock.calls`](https://vitest.dev/api/mock#mock-calls) within the mock function object.

[**Mock objects and functions**](https://en.wikipedia.org/wiki/Mock_object) are commonly used [**stub**](https://en.wikipedia.org/wiki/Method_stub) components
in testing that are used for replacing dependencies of the components being tested.
***Mocks*** make it possible to return hardcoded responses, and to verify the number of times the mock functions are called and with what parameters.

In our example, the mock function is a perfect choice since it can be easily used for verifying that the method gets called exactly once.

### Tests for the `Togglable` component

Let's write a few tests for the `Togglable` component. The tests are shown below:

```js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Togglable from "./Togglable";

describe("<Togglable />", () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show...">
        <div>togglable content</div>
      </Togglable>
    );
  });

  test("renders its children", () => {
    screen.getByText("togglable content");
  });

  test("at start the children are not displayed", () => {
    const element = screen.getByText("togglable content");
    expect(element).not.toBeVisible();
  });

  test("after clicking the button, children are displayed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show...");
    await user.click(button);

    const element = screen.getByText("togglable content");
    expect(element).toBeVisible();
  });
});
```

The `beforeEach` function gets called before each test, which then renders the `Togglable` component and saves the field `container` of the return value.

The first test verifies that the `Togglable` component renders its child component

```html
<div>
  togglable content
</div>
```

The remaining tests use the `toBeVisible` method
to verify that the child component of the `Togglable` component is not visible initially,
by checking that the style of the *`div`* element contains `{ display: 'none' }`.
Another test verifies that when the button is pressed the component is visible,
meaning that the style for hiding it **is no longer** assigned to the component.

Let's also ***add a test*** that can be used to verify that the visible content can be hidden by clicking the second button of the component:

```js
describe("<Togglable />", () => {

  // ...

  test("toggled content can be closed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show...");
    await user.click(button);

    const closeButton = screen.getByText("cancel");
    await user.click(closeButton);

    const element = screen.getByText("togglable content");
    expect(element).not.toBeVisible();
  });
});
```

### Testing the forms

We already used the `click` function of the [*user-event*](https://testing-library.com/docs/user-event/intro) in our previous tests to click buttons.

```js
const user = userEvent.setup();
const button = screen.getByText("show...");
await user.click(button);
```

We can also simulate text input with `userEvent`.

Let's make a test for the `TaskForm` component in a separate file.
But before we do, let's review and make a small change to our `TaskForm` component.

```js
import { useState } from "react";

const TaskForm = ({ createTask }) => {
  const [newTask, setNewTask] = useState("");

  const addTask = event => {
    event.preventDefault()
    createTask({
      content: newTask,
      important: Math.random() > 0.5,
    })

    setNewTask("");
  };

  return (
    <div>
      <h2>Create a new task</h2>

      <form onSubmit={addTask}>
        <input
          value={newTask}
          onChange={event => setNewTask(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default TaskForm;
```

The form works by calling the function received as props `createTask`, with the details of the new task.

We are now ready to write our test.
*Taskform.test.js* is as follows:

```js
import { render, screen } from "@testing-library/react";
import TaskForm from "./TaskForm";
import userEvent from "@testing-library/user-event";

test("<TaskForm /> updates parent state and calls onSubmit", async () => {
  const createTask = vi.fn();
  const user = userEvent.setup();

  render(<TaskForm createTask={createTask} />);

  const input = screen.getByRole("textbox");
  const sendButton = screen.getByText("save");

  await user.type(input, "testing a form...");
  await user.click(sendButton);

  expect(createTask.mock.calls).toHaveLength(1);
  expect(createTask.mock.calls[0][0].content).toBe("testing a form...");
});
```

Tests get access to the input field using the function [`getByRole`](https://testing-library.com/docs/queries/byrole).

The method [`type`](https://testing-library.com/docs/user-event/utility#type) of the `userEvent` is used to write text to the input field.

Our first `expect` call ensures that submitting the form calls the `createTask` method.
The second expectation checks that the event handler is called with the right parameters.
In other words, the second `expect` checks that a task with the correct content is created when the form is filled.

It's worth noting that the good old `console.log` works as usual in the tests. For example, if you want to see what the calls stored by the mock-object look like, you can do the following

```js
test("<TaskForm /> updates parent state and calls onSubmit", async() => {
  const user = userEvent.setup();
  const createTask = vi.fn();

  render(<TaskForm createTask={createTask} />);

  const input = screen.getByRole("textbox");
  const sendButton = screen.getByText("save");

  await user.type(input, "testing a form...");
  await user.click(sendButton);

  console.log(createTask.mock.calls); // highlight-line
});
```

In the middle of running the tests, the following is printed in the console:

```json
[ [ { content: "testing a form...", important: true } ] ]
```

### About finding the elements

Let us assume that the form has two input fields

```js
const TaskForm = ({ createTask }) => {
  // ...

  return (
    <div>
      <h2>Create a new task</h2>

      <form onSubmit={addTask}>
        <input
          value={newTask}
          onChange={event => setNewTask(event.target.value)}
        />
        // highlight-start
        <input
          value={...}
          onChange={...}
        />
        // highlight-end
        <button type="submit">save</button>
      </form>
    </div>
  );
};
```

Now the approach that our test uses to find the input field

```js
const input = screen.getByRole("textbox");
```

would cause an error:

![node error that shows two elements with textbox since we use getByRole](../../images/5/40.png)

The error message suggests using `getAllByRole`.
The test could be fixed as follows:

```js
const inputs = screen.getAllByRole("textbox");

await user.type(inputs[0], "testing a form...");
```

Method `getAllByRole` now returns an array and the right input field is the first element of the array.
However, this [**approach is brittle**](https://www.callumhart.com/blog/brittle-selectors/) since it relies on the order of the input fields.

If a `label` were defined for the input field, the input field could be located using it with the `getByLabelText` method.
For example, if we added a label to the input field:

```js
  // ...
  <label> // highlight-line
    content // highlight-line
    <input
      value={newTask}
      onChange={event => setNewTask(event.target.value)}
    />
  </label> // highlight-line
  // ...
```

The test could locate the input field as follows:

```js
test("<TaskForm /> updates parent state and calls onSubmit", async () => {
  const user = userEvent.setup();
  const createTask = vi.fn();

  render(<TaskForm createTask={createTask} />); 

  const input = screen.getByLabelText("content"); // highlight-line
  const sendButton = screen.getByText("save");

  await user.type(input, "testing a form...");
  await user.click(sendButton);

  expect(createTask.mock.calls).toHaveLength(1);
  expect(createTask.mock.calls[0][0].content).toBe("testing a form...");
});
```

Quite often input fields have ***placeholder text*** that hints to the user what kind of input is expected.
Let us add a placeholder to our form:

```js
const TaskForm = ({ createTask }) => {
  // ...

  return (
    <div>
      <h2>Create a new task</h2>

      <form onSubmit={addTask}>
        <input
          value={newTask}
          onChange={event => setNewTask(event.target.value)}
          placeholder='write task here' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  );
};
```

Now finding the right input field is easy with the method [`getByPlaceholderText`](https://testing-library.com/docs/queries/byplaceholdertext):

```js
test("<TaskForm /> updates parent state and calls onSubmit", async () => {
  const user = userEvent.setup();
  const createTask = vi.fn();

  render(<TaskForm createTask={createTask} />);

  const input = screen.getByPlaceholderText("write task here"); // highlight-line 
  const sendButton = screen.getByText("save");

  await user.type(input, "testing a form...");
  await user.click(sendButton);

  expect(createTask.mock.calls).toHaveLength(1);
  expect(createTask.mock.calls[0][0].content).toBe("testing a form...");
});
```

Sometimes, finding the correct element using the methods described above can be challenging.
In such cases, an alternative is the method `querySelector` of the *`container`* object,
which is returned by `render`, as was [mentioned above](#searching-for-content-in-a-component).
*Any CSS selector can be used with this method* for searching elements in tests.

For example, if we added a unique `id` to the input field:

```js
const TaskForm = ({ createTask }) => {
  // ...

  return (
    <div>
      <h2>Create a new task</h2>

      <form onSubmit={addTask}>
        <input
          value={newTask}
          onChange={event => setNewTask(event.target.value)}
          id='task-input' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  );
};
```

The input element could now be found in the test as follows:

```js
const { container } = render(<TaskForm createTask={createTask} />);

const input = container.querySelector("#task-input");
```

However, we shall stick to the approach of using `getByPlaceholderText` in the test.

### Test coverage

We can easily find out the [**coverage**](https://vitest.dev/guide/coverage.html#coverage) of our tests by running them with the command.

```js
npm test -- --coverage
```

The first time you run the command, Vitest will ask you if you want to install the required library `@vitest/coverage-v8`.
Install it, and run the command again:

![terminal output of test coverage](../../images/5/18new.png)

A HTML report will be generated to the *coverage* directory.
The report will tell us the lines of untested code in each component:

![HTML report of the test coverage](../../images/5/19newer.png)

Let's add the directory *coverage/* to the *.gitignore* file to exclude its contents from version control:

```js
//...

coverage/
```

You can find the code for our current application in its entirety in the *part5-8* branch of
[this GitHub repository](https://github.com/comp227/part2-tasks/tree/part5-8).
</div>

<div class="tasks">

### Exercises 5.13.-5.16

#### 5.13: Watchlist tests, Step 1

Make a test, which checks that the component displaying a show renders the show's title and genre, but does not render its URL or number of likes by default.

Add CSS classes to the component to help the testing as necessary.

#### 5.14: Watchlist tests, Step 2

Make a test, that checks that a show's URL and number of likes are shown when the button controlling the shown details has been clicked.

#### 5.15: Watchlist tests, Step 3

Make a test, which ensures that if the ***like*** button is clicked twice, the event handler the component received as props *is called twice*.

#### 5.16: Watchlist tests, Step 4

Make a test for the *Recommend new show* form.
The test should check if the form calls the event handler it received as props with the right details when a new show is added.

</div>

<div class="content">

### Frontend integration tests

In the previous part of the course material, we wrote integration tests for the backend that tested its logic and connected the database through the API provided by the backend.
When writing these tests, we made the conscious decision **not to write unit tests**, as the code for that backend is fairly simple,
and *it is likely that bugs in our application occur in more complicated scenarios* than what would be discovered via our unit tests.

So far all of our tests for the frontend have been unit tests that have validated the correct functioning of individual components.
Unit testing is useful at times, but ***even a comprehensive suite of unit tests is not enough to validate that the application works as a whole***.

We could also make integration tests for the frontend.
**Integration testing** tests the collaboration of multiple components.
It is considerably more difficult than unit testing.
For example, we would have to mock data from the server.
We will concentrate on making end-to-end tests to test the whole application.
We will work on the end-to-end tests in the next section.

### Snapshot testing

Vitest offers a completely different alternative to "traditional" testing called [**snapshot testing**](https://vitest.dev/guide/snapshot) testing.
The interesting feature of snapshot testing is that **developers do not need to define any tests themselves**, it is simple enough to adopt snapshot testing.

The fundamental principle is to compare the HTML code defined by the component after it has changed to the HTML code that existed before it was changed.

If the snapshot notices some change in the HTML defined by the component, then *either it is new functionality or a **bug** caused by accident*.
Snapshot tests notify the developer if the HTML code of the component changes.
The developer has to tell Vitest if the change was desired or undesired.
*If the change to the HTML code is unexpected, it strongly implies a bug,*
and the developer can become aware of these potential issues easily thanks to snapshot testing.

</div>
