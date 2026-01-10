---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: en
---

<div class="content">

Let's go back to working with React.

We start with a new example:

```js
const Greet = (props) => {
  return (
    <div>
      <p>
        Hi {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Buddy'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Greet name="Bailey" age={14 + 7} />
      <Greet name={name} age={age} />
    </div>
  )
}
```

### Component helper functions

Let's expand our `Greet` component so that it guesses the year of birth of the person being greeted:

```js
const Greet = (props) => {
  // highlight-start
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }
  // highlight-end

  return (
    <div>
      <p>
        Hi {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p> // highlight-line
    </div>
  )
}
```

The logic for guessing the year of birth is encapsulated within a function of its own, which is invoked when the component is rendered.

The person's age does not need to be explicitly passed as a parameter to this function because
the function can directly access all the props provided to the component.

If we examine the current code, we'll notice that the helper function is defined within another function that determines the component's behavior.
In Java programming, defining a function within another function is complex and uncommon.
In JavaScript however, defining functions within functions is a commonly used technique.

### Destructuring

Before we move forward, we will take a look at a small but useful feature of the JavaScript language that was added in the ES6 specification, that allows us to
[**destructure**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) values from objects and arrays upon assignment.

In our previous code, we had to reference the data passed to our component as `props.name` and `props.age`.
Of these two expressions, we had to repeat `props.age` twice in our code.

Since `props` is an object

```js
props = {
  name: 'Powercat',
  age: 23,
}
```

we can streamline our component by assigning the values of the properties directly into two variables `name` and `age` which we can then use in our code:

```js
const Greet = (props) => {
  // highlight-start
  const name = props.name
  const age = props.age
  // highlight-end

  const bornYear = () => new Date().getFullYear() - age // highlight-line

  return (
    <div>
      <p>Hi {name}, you are {age} years old</p> // highlight-line
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Notice that we've also utilized the more compact syntax for arrow functions when defining the `bornYear` function.
As mentioned earlier, if an arrow function consists of a single expression,
then the function body does not need to be written inside of curly braces.
In this more compact form, the function simply returns the result of the single expression.

To recap, the two function definitions shown below are equivalent:

```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

Destructuring makes the assignment of variables even easier since we can use it to extract and gather the values of an object's properties into separate variables:

```js
const Greet = (props) => {
    // highlight-start
  const { name, age } = props
    // highlight-end
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hi {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

When the object that we are destructuring has the values

```js
props = {
  name: 'Powercat',
  age: 23,
}
```

the expression `const { name, age } = props` assigns the values `'Powercat'` to `name` and `23` to `age`.

We can take destructuring a step further:

```js
const Greet = ({ name, age }) => { // highlight-line
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hi {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

The props that are passed to the component are now directly destructured into the variables, `name` and `age`.

This means that instead of assigning the entire props object into a variable called `props` and then assigning its properties to the variables `name` and `age`

```js
const Greet = (props) => {
  const { name, age } = props
```

we assign the values of the properties directly to variables by *destructuring the `props` object* that is passed to the component function as a parameter:

```js
const Greet = ({ name, age }) => {
```

### Page re-rendering

Up to this point, our applications have been static; their appearance remains unchanged after the initial rendering.
But what if we wanted to create a counter that increased over time or at the click of a button?

Let's start with the following.
*App.jsx* becomes:

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

And *main.jsx* becomes:

```js
import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <App counter={counter} />
)
```

The App component is given the value of the counter via the `counter` prop.
This component renders the value to the screen.
What happens when the value of `counter` changes?
Even if we were to add the following:

```js
counter += 1
```

the component won't re-render.
We can get the component to re-render by calling the `render` method a second time, e.g. in the following way:

```js
let counter = 1

const root = ReactDOM.createRoot(document.getElementById('root'))

const refresh = () => {
  root.render(
    <App counter={counter} />
  )
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

The re-rendering command has been wrapped inside of the `refresh` function to cut down on the amount of copy-pasted code.

Now the component ***renders three times***, first with the value *`1`*, then *`2`*, and finally *`3`*.
However, values *`1`* and *`2`* are displayed on the screen for such a short amount of time that they can't be noticed.

We can implement slightly more interesting functionality by re-rendering and incrementing the counter every second by using
[`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

Making repeated calls to the `render` method is not the recommended way to re-render components.
Next, we'll introduce a better way of accomplishing this effect.

### Stateful component

All of our components up until now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.

Next, let's add state to our application's `App` component with the help of React's [**state hook**](https://react.dev/learn/state-a-components-memory).

We will change the application as follows.
*main.jsx* goes back to:

```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

and *App.jsx* changes to the following:

```js
import { useState } from 'react' // highlight-line

const App = () => {
  const [ counter, setCounter ] = useState(0) // highlight-line

// highlight-start
  setTimeout(
    () => setCounter(counter + 1),
    1000
  )
  // highlight-end

  return (
    <div>{counter}</div>
  )
}

export default App
```

In the first row, the file imports the `useState` function:

```js
import { useState } from 'react'
```

The function body that defines the component begins with the function call:

```js
const [ counter, setCounter ] = useState(0)
```

The function call adds ***state*** to the component and renders it initialized with the value of zero.
The function returns an array that contains two items.
We assign the items to the variables `counter` and `setCounter` by using the destructuring assignment syntax shown earlier.

The `counter` variable is assigned the initial value of ***state***, which is zero.
The variable `setCounter` is assigned to a function that will be used to *modify the state*.

The application calls the
[`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
function and passes it two parameters:

1. a function to be executed in the future
2. how long it should wait to execute that function (expressed in *ms*):

So in our example from above:

```js
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

The function passed as the first parameter to the `setTimeout` function:

```js
() => setCounter(counter + 1)
```

is invoked *`1000` ms* after `setTimeout` is called.

Once the state modifying function `setCounter` is called, **React re-renders the component**
which means that the function body of the component function gets re-executed (*shown below*):

```js
() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

The second time the component function is executed it calls the `useState` function and returns the new value of the state: 1.
Executing the function body again also makes a new function call to `setTimeout`,
which executes the one-second timeout and increments the `counter` state again.
Because the value of the `counter` variable is 1, incrementing the value by 1 is essentially the same as an expression setting the value of `counter` to 2.

```js
() => setCounter(2)
```

Meanwhile, the old value of `counter` - "1" - is rendered to the screen.

Every time the `setCounter` modifies the state it causes the component to re-render.
The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running.

If the component doesn't render when you think it should, or if it renders at the "wrong time",
you can debug the application by logging the values of the component's variables to the console.
If we make the following additions to our code:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter) // highlight-line

  return (
    <div>{counter}</div>
  )
}
```

It's easy to follow and track the calls made to the `App` component's `render` function:

![screenshot of rendering log on dev tools](../../images/1/4e.png)

Was your browser console open?
If it wasn't, do yourself a favor and keep it open.
Make it a habit to type (***Ctrl-Shift-I***) while your *localhost* is loading.
Or keep using the same browser tab.

### Event handling

We have already mentioned **event handlers**, which are registered to be called when specific events occur a few times in [part 0](/part0).
A user's interaction with the different elements of a web page can cause a collection of various kinds of events to be triggered.

Let's change the application so that increasing the counter happens when a user clicks a button,
which is implemented with the [`button`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) element.

Button elements support [*mouse events*](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent),
of which [***click***](https://developer.mozilla.org/en-US/docs/Web/Events/click) is the most common event.
The click event on a button can also be triggered with the keyboard or a touch screen despite the name *mouse event*.

In React, [registering an event handler function](https://react.dev/learn/responding-to-events) to the ***click*** event happens like this:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  // highlight-start
  const handleClick = () => {
    console.log('clicked')
  }
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      // highlight-start
      <button onClick={handleClick}>
        plus
      </button>
      // highlight-end
    </div>
  )
}
```

We set the value of the button's `onClick` attribute to a reference to the custom `handleClick` function above.

Now every click of the ***plus*** button causes the `handleClick` function to be called,
meaning that every click event will log a `clicked` message to the browser console.

An event handler function can also be defined directly to the `onClick` attribute:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}> // highlight-line
        plus
      </button>
    </div>
  )
}
```

By changing the event handler to that direct form:

```js
<button onClick={() => setCounter(counter + 1)}>
  plus
</button>
```

we still achieve the desired behavior.
The value of `counter` is incremented **and** the component gets re-rendered.

Let's also add a button for resetting the counter:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      // highlight-start
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
      // highlight-end
    </div>
  )
}
```

Our application is now ready!

### An event handler is a function

We define the event handlers for our buttons where we declare their `onClick` attributes:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

> *What if we tried to define the event handlers in a simpler form?*
>
> ```js
> <button onClick={setCounter(counter + 1)}> // highlight-line
>   plus
></button>
> ```
>
> This would completely break our application:
>
> ![screenshot of re-renders error](../../images/1/5c.png)
>
> What's going on?
> The problems section in WebStorm (lower right) hints at the issue, as it says: *`Type void is not assignable to MouseEventHandler<HTMLButtonElement>`*.
> An event handler is supposed to be either a **function** or a **function reference**, and when we write:
>
> ```js
> <button onClick={setCounter(counter + 1)}>
> ```
>
> the event handler is actually a **function call** (hence the type *`void`*, since `setCounter` does not return anything).
> In many situations, this is OK, but not in this particular situation.
> In the beginning, the value of the `counter` variable is **`0`**.
> When React renders the component for the first time,
> it executes the function call `setCounter(0+1)` and changes the value of the component's state to **`1`**.
> ***This will cause the component to be re-rendered, React will execute the `setCounter` function call again, and the state will change leading to another re-render...***
>
> In our original version:
>
> ```js
> <button onClick={() => setCounter(counter + 1)}> 
>   plus
> </button>
> ```
>
> `onClick` has the value `() => setCounter(counter + 1)`.
> The `setCounter` function is called ***only when a user clicks the button***.

Defining event handlers within JSX templates (i.e. directly) is not recommended.
Here it was OK because our event handlers were so simple.

Let's separate the event handlers into separate functions:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  // highlight-start
  const handleIncrement = () => setCounter(counter + 1)
  
  const handleReset = () => setCounter(0)
  // highlight-end

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleIncrement}> // highlight-line
        plus
      </button>
      <button onClick={handleReset}> // highlight-line
        zero
      </button>
    </div>
  )
}
```

Here, the event handlers have been defined correctly.
The value of the `onClick` attribute is a variable containing a reference to a function:

```js
<button onClick={handleIncrement}> 
  plus
</button>
```

### Passing state-to-child components

It's recommended to write React components that are small and reusable across the application and even across projects.
Let's refactor our application so that it's composed of three smaller components:

- one component to *`Display`* the counter
- two components: one for each *`Button`*

Let's first implement the `Display` component:

A best practice in React is to [lift shared state](https://react.dev/learn/sharing-state-between-components) in the component hierarchy.
The documentation says:

> *Often, several components need to reflect the same changing data.
  We recommend lifting the shared state up to their closest common ancestor.*

So let's:

1. place the application's state in the `App` component
2. pass it down to the `Display` component via `props`

Examine the `Display` component:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

Using the component is straightforward, as we only need to pass the state of the `counter` to it:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const handleIncrement = () => setCounter(counter + 1)
  const handleReset = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/> // highlight-line
      <button onClick={handleIncrement}>
        plus
      </button>
      <button onClick={handleReset}> 
        zero
      </button>
    </div>
  )
}
```

Everything still works.
When the buttons are clicked and the `App` gets re-rendered, all of its children including the `Display` component are also re-rendered.

Next, let's make a `Button` component for the buttons of our application.
We have to pass the event handler as well as the title of the button through the component's props:

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

Our `App` component now looks like this:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const handleIncrement = () => setCounter(counter + 1)
  //highlight-start
  const handleDecrement = () => setCounter(counter - 1)
  //highlight-end
  const handleReset = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      // highlight-start
      <Button
        onClick={handleIncrement}
        text='plus'
      />
      <Button
        onClick={handleReset}
        text='zero'
      />     
      <Button
        onClick={handleDecrement}
        text='minus'
      />           
      // highlight-end
    </div>
  )
}
```

Since we now have an easily reusable `Button` component,
we added a button that decrements the counter with little code.

The event handler is passed to the `Button` component through the `onClick` prop.
When creating your own components, you can name the props whatever you want.
However, in our case, the naming choice wasn't entirely arbitrary.

React's official [tutorial](https://react.dev/learn/tutorial-tic-tac-toe) suggests this convention.
> *"In React, it’s conventional to use `onSomething` names for props which take functions which handle events*
> *and `handleSomething` for the actual function definitions which handle those events."*

### Changes in state cause re-rendering

Let's go over the main principles of how an application works once more.

When the application starts, the code in `App` is executed.
This code uses a [`useState`](https://react.dev/reference/react/useState)
hook to create the application state,
setting an initial value of the variable `counter`.
This component contains three `Button` components and the `Display` component, which displays the counter's value (*`0`*).
The buttons all have event handlers, which are used to change the state of the counter.

When one of the buttons is clicked, the event handler is executed.
The event handler changes the state of the `App` component with the `setCounter` function.
**Calling a function that changes the state causes the component to re-render.**

So, if a user clicks the ***plus*** button, the button's event handler changes the value of `counter` to **`1`**.
This triggers the `App` component, and its subcomponents `Display` and `Button`, to be re-rendered.
`Display` receives the new value of the counter, **`1`**, as props.
The `Button` components receive event handlers, which can be used to change the state of the counter.

Let's add `console.log` statements to our application to help us understand how the program works.

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  console.log('rendering with counter value', counter) // highlight-line

  const handleIncrement = () => {
    console.log('increasing, value before', counter) // highlight-line
    setCounter(counter + 1)
  }

  const handleDecrement = () => { 
    console.log('decreasing, value before', counter) // highlight-line
    setCounter(counter - 1)
  }

  const handleReset = () => {
    console.log('resetting to zero, value before', counter) // highlight-line
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={handleIncrement} text="plus" />
      <Button onClick={handleReset} text="zero" />
      <Button onClick={handleDecrement} text="minus" />
    </div>
  )
} 
```

Let us now see what gets rendered to the console when the buttons ***plus***, ***plus***, ***zero*** and ***minus*** are pressed:

![browser showing plus, plus, zero, and minus being pressed](../../images/1/31.png)

Do not try to guess what your code does.
Use the debugger and `console.log` to observe what it does.

### Refactoring the components

The component displaying the value of the counter is as follows:

```js
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}
```

The component only uses the `counter` field of its `props`.
This means we can simplify the component by using [destructuring](/part1/component_state_event_handlers#destructuring), like so:

```js
const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
```

The function defining the component contains only the `return` statement,
so we can define the function using the more compact form of arrow functions:

```js
const Display = ({ counter }) => <div>{counter}</div>
```

We can simplify the `Button` component as well.

```js
const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

We can use destructuring to get only the required fields from `props`, and use the more compact form of arrow functions:

> **Review**: While building your own components, you can name their event handler props anyway you like.
For this you can refer to the React's documentation on [Naming event handler props](https://react.dev/learn/responding-to-events#naming-event-handler-props)
It goes as following:
>
>> *By convention, event handler props should start with `on`, followed by a capital letter.*

For example, the Button component’s `onClick` prop:

```js
<Button onClick={handleIncrement} text="plus" />
```

could have been called `onSmash`:

```js
<Button onSmash={handleIncrement} text="plus">
```

by renaming the variable in the `Button` component itself to `onSmash`:

```js
// highlight-start
const Button = ({ onSmash, text }) => ( 
  <button onClick={onSmash}>
// highlight-end
    {text}
  </button>
)
```

> **FYI:** We could simplify the `Button` component further by declaring the return statement on just one line:
>
> ```js
> const Button = ({ onSmash, text }) => <button onClick={onSmash}>{text}</button>
> ```
>
> In this situation, such a refactoring is fine.
> *Nevertheless, remember how to use both formats so that you can make effective changes in the future*

</div>
