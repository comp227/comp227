---
mainImage: ../../../images/part-7.svg
part: 7
letter: b
lang: en
---

<div class="content">

### Hooks

React offers 15 different [**built-in hooks**](https://react.dev/reference/react/hooks),
of which the most popular ones are the [`useState`](https://react.dev/reference/react/useState)
and [`useEffect`](https://react.dev/reference/react/useEffect).
We have already used both hooks extensively.

In [part 5](/part5/props_children_and_proptypes#references-to-components-with-ref) we used the
[`useImperativeHandle` hook](https://react.dev/reference/react/useImperativeHandle)
which allows components to provide their functions to other components.
In [part 6](/part6/react_query_use_reducer_and_the_context) we used
[`useReducer`](https://react.dev/reference/react/useReducer) and [`useContext`](https://react.dev/reference/react/useContext) to implement a Redux-like state management.

Within the last couple of years, many React libraries have begun to offer hook-based APIs.
[In part 6](/part6/flux_architecture_and_redux) we used the [`useSelector`](https://react-redux.js.org/api/hooks#useselector)
and [`useDispatch`](https://react-redux.js.org/api/hooks#usedispatch)
hooks from the react-redux library to share our redux-store and dispatch function to our components.

The [React Router's API](https://reactrouter.com/en/main/start/tutorial) that we introduced in the
[previous part](/part7/react_router) is also partially ***hook-based***.
Its hooks can be used to access URL parameters and the `navigation` object, which allows for manipulating the browser URL programmatically.

As mentioned in [part 1](/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks),
hooks are not normal functions, and when using those we have to adhere to certain [rules or limitations](https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks).
Let's recap the rules of using hooks, copied verbatim from the official React documentation:

> **Don’t call Hooks inside loops, conditions, or nested functions.**
> Instead, always use Hooks at the top level of your React function, before any early returns.
> You can only call Hooks while React is rendering a function component.
>
> - ✅ Call them at the top level in the body of a [function component](https://react.dev/learn/your-first-component).
> - ✅ Call them at the top level in the body of a [custom Hook](https://react.dev/learn/reusing-logic-with-custom-hooks)
> ...
>
> It’s not supported to call Hooks (functions starting with use) in any other cases, for example:
>
> - 🔴 Do not call Hooks inside conditions or loops.
> - 🔴 Do not call Hooks after a conditional return statement.
> - 🔴 Do not call Hooks in event handlers.
> - 🔴 Do not call Hooks in class components.
> - 🔴 Do not call Hooks inside functions passed to useMemo, useReducer, or useEffect.

There's an existing [ESlint plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) that can be used to verify that the application uses hooks correctly.

To use [this rule with vite](https://github.com/vitejs/vite/discussions/5788), make sure you install the rule and plugin in your project.

```bash
npm i -D eslint eslint-plugin-react-hooks
```

You'll also want to add this rule to your *package.json*

```json
{
  //...
  "eslintConfig": {
    "extends": "plugin:react-hooks/recommended"
  }
}
```

Once the rule is configured, the *react-hooks* rule will complain if hooks are used incorrectly.

![vscode error useState being called conditionally](../../images/7/60ea.png)

If you do not see such an error here, then make sure that you have turned on ***Automatic ESLint configuration*** in ***File->New Projects Setup->Settings for New Projects***.

### Custom hooks

React offers the option to create [custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).
According to React:

> *Building your own Hooks lets you extract component logic into reusable functions.*

**Custom hooks** are regular JavaScript functions that can use any other hooks,
as long as they adhere to the [rules of hooks](/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks).
Additionally, the name of custom hooks must start with the word `use`.

We implemented a counter application in [part 1](/part1/component_state_event_handlers#event-handling) that can have its value incremented, decremented, or reset.
The code of the application is as follows:

```js  
import { useState } from 'react'
const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(counter - 1)}>
        minus
      </button>      
      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}
```

Let's extract the *counter logic into a custom hook*.
The code for the hook is as follows:

```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value, 
    increase,
    decrease,
    zero
  }
}
```

Our custom hook uses the `useState` hook internally to create its state.
The hook returns an object, the properties of which include the value of the counter as well as functions for manipulating the value.

React components can use the hook as shown below:

```js
const App = (props) => {
  const counter = useCounter() // highlight-line

  return (
    <div>
      <div>{counter.value}</div> // highlight-line
      <button onClick={counter.increase}> // highlight-line
        plus
      </button>
      <button onClick={counter.decrease}> // highlight-line
        minus
      </button>      
      <button onClick={counter.zero}> // highlight-line
        zero
      </button>
    </div>
  )
}
```

By doing this we can extract the state of the `App` component and its manipulation entirely into the `useCounter` hook.
Managing the counter state and logic is now the responsibility of the custom hook.

The same hook could be *reused* in the application that was keeping track of the number of clicks made to the left and right buttons:

```js

const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}
```

The application creates ***two completely separate counters***.
The first one is assigned to the variable `left` and the other to the variable `right`.

Dealing with forms in React can be complex.
The following application presents the user with a form that requests them to input their name, birthday, and height:

```js
const App = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div>
      <form>
        name: 
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)} 
        /> 
        <br/> 
        birthdate:
        <input
          type='date'
          value={born}
          onChange={(event) => setBorn(event.target.value)}
        />
        <br /> 
        height:
        <input
          type='number'
          value={height}
          onChange={(event) => setHeight(event.target.value)}
        />
      </form>
      <div>
        {name} {born} {height} 
      </div>
    </div>
  )
}
```

Every field of the form has its own state.
To keep the state of the form synchronized with the data provided by the user,
*we have to register an appropriate `onChange` handler for each of the `input` elements*.

Let's **define our own custom `useField` hook** that simplifies the state management of the form:

```js
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
```

The hook function receives the type of the input field as a parameter.
It returns *all of the attributes required by the `input`*: its `type`, `value` and the `onChange` handler.

Here's how the hook can be used:

```js
const App = () => {
  const name = useField('text') // highlight-line
  // ...

  return (
    <div>
      <form>
        <input
          type={name.type} // highlight-line
          value={name.value} // highlight-line
          onChange={name.onChange} // highlight-line
        /> 
        // ...
      </form>
    </div>
  )
}
```

### Spread attributes

We could simplify things a bit further.
Since the `name` object has exactly all of the attributes that the `input` element expects to receive as props,
we can pass the props to the element using the
[**spread syntax**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) in the following way:

```js
<input {...name} /> 
```

As the [example](https://react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax) in the React documentation states,
the following two ways of passing props to a component achieve the exact same result:

|Explicit assignment|Using Spread syntax|
|:---|:---|
|<pre>\<Greeting firstName='Randy'<br/>   lastName='Lau' /></pre>|<pre>const person = {<br/>  firstName: 'Randy',<br/>  lastName: 'Lau'<br/>}<br/><br/>\<Greeting {...person} /></pre>|

The application gets simplified into the following format:

```js
const App = () => {
    // highlight-start
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')
    // highlight-end

  return (
    <div>
      <form>
        name: 
        <input  {...name} /> // highlight-line
        <br/> 
        birthdate:
        <input {...born} />
        <br /> 
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value} // highlight-line
      </div>
    </div>
  )
}
```

When we encapsulate the byzantine details for synchronizing the form's state inside our hook, which simplifies our form.

Custom hooks are not only a tool for reusing code; they also **provide a better way for dividing our code into smaller modular parts**.

### More about hooks

The internet is starting to fill up with more and more helpful material related to hooks.
The following sources are worth checking out:

- [Awesome React Hooks Resources](https://github.com/rehooks/awesome-react-hooks)
- [Easy to understand React Hook recipes by Gabe Ragland](https://usehooks.com/)
- [Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)

</div>

<div class="tasks">

### Exercises 7.4-7.8

We'll continue with the app from [exercises](/part7/react_router#exercises-7-1-7-3) of the [react router section](/part7/react_router).

#### 7.4: Jokes and Hooks, Step 1

Simplify the joke creation form of your application with the `useField` custom hook we defined earlier.

One natural place to save the custom hooks of your application is in the */src/hooks/index.js* file.

If you use the [named export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description) instead of the default export:

```js
import { useState } from 'react'

export const useField = (type) => { // highlight-line
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// modules can have several named exports
export const useAnotherHook = () => { // highlight-line
  // ...
}
```

Then [importing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) happens in the following way:

```js
import  { useField } from './hooks'

const App = () => {
  // ...
  const username = useField('text')
  // ...
}
```

#### 7.5: Jokes and Hooks, Step 2

Add a button to the form that you can use to clear all the input fields:

![browser jokes with reset button](../../images/7/61ea.png)

Expand the functionality of the `useField` hook so that it offers a new ***reset*** operation for clearing the field.

Depending on your solution, you may see the following warning in your console:

![devtools console warning invalid value for reset prop](../../images/7/62ea.png)

We will return to this warning in the next exercise.

#### 7.6: Jokes and Hooks, Step 3

If your solution did not cause a warning to appear in the console, you have already finished this exercise.

If you see the console warning: *Invalid value for prop \`reset\` on \<input\> tag*, make the necessary changes to get rid of it.

The reason for this warning is that after making the changes to your application, the following expression:

```js
<input {...content}/>
```

Essentially, is the same as this:

```js
<input
  value={content.value} 
  type={content.type}
  onChange={content.onChange}
  reset={content.reset} // highlight-line
/>
```

The `input` element should not be given a `reset` attribute.

One simple fix would be to not use the spread syntax and write all of the forms like this:

```js
<input
  value={username.value} 
  type={username.type}
  onChange={username.onChange}
/>
```

If we were to do this, we would lose much of the benefit provided by the `useField` hook.
Instead, *come up with a solution that fixes the issue, but is still easy to use with the spread syntax*.

#### 7.7: Country hook

Let's return to exercises [2.18-20](/part2/adding_styles_to_react_app#exercises-2-18-2-20).

We're going to start another repo by visiting <http://go.djosv.com/227lab7-2>

The application can be used to search for a country's details from the <https://restcountries.com/> interface.
If a country is found, its details are displayed:

![browser displaying country details](../../images/7/69ea.png)

If no country is found, a message is displayed to the user:

![browser showing country not found](../../images/7/70ea.png)

The application is otherwise complete, but in this exercise, you have to implement a custom hook `useCountry`,
which can be used to search for the details of the country given to the hook as a parameter.

Use the API endpoint [full name](https://restcountries.com/#api-endpoints-v3-full-name)
to fetch a country's details in a `useEffect` hook within your custom hook.

Notice that in this exercise, you must enter useEffect's
[second parameter](https://react.dev/reference/react/useEffect#parameters)
array to control when the effect function is executed.
Review [this section of part 2](/part2/adding_styles_to_react_app#couple-of-important-remarks) for more info on how the second parameter could be used.

#### 7.8: Ultimate Hooks

The code of the application responsible for communicating with the backend of the task application of the previous parts looks like this:

```js
import axios from 'axios'
const baseUrl = '/api/tasks'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${ baseUrl }/${id}`, newObject)
  return response.data
}

export default { getAll, create, update, setToken }
```

We notice that the code is in no way specific to the fact that our application deals with tasks.
Excluding the value of the `baseUrl` variable, the same code could be reused in the watchlist application for dealing with the communication with the backend.

Extract the code for communicating with the backend into its own `useResource` hook.
It is sufficient to implement fetching all resources and creating a new resource.

You can do the exercise in the project by going to <https://go.djosv.com/227lab7-3>.
The `App` component for the project is the following:

```js
const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [tasks, taskService] = useResource('http://localhost:3005/tasks')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleTaskSubmit = (event) => {
    event.preventDefault()
    taskService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, email: email.value})
  }

  return (
    <div>
      <h2>tasks</h2>
      <form onSubmit={handleTaskSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      <ol>
        {tasks.map(t => <li key={t.id}>{t.content}</li>)}
      </ol>

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        email <input {...email} />
        <button>create</button>
      </form>
      <ul>
        {persons.map(p => <li key={p.id}>{p.name} (<a href={`mailto:${p.number}`}>{p.number}</a>)</li>)}
      </ul>
    </div>
  )
}
```

The `useResource` custom hook returns an array of two items just like the state hooks.
The first item of the array contains all of the individual resources
and the second item of the array is an object that can be used for manipulating the resource collection, like creating new ones.

If you implement the hook correctly, it can be used for both tasks and emails (start the server with the `npm run server` command at port *`3005`*).

While the email link and having the tasks be a list here is not required, it's included here simple to make the use case more interesting/compelling.

![browser showing tasks and persons](../../images/7/17.png)

</div>
