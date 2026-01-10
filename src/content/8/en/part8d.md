---
mainImage: ../../../images/part-8.svg
part: 8
letter: d
lang: en
---

<div class="content">

Before we start delving into how you can use TypeScript with React, we should first have a look at what we want to achieve.
When everything works as it should, TypeScript will help us catch the following errors:

- Trying to pass an extra/unwanted prop to a component
- Forgetting to pass a required prop to a component
- Passing a prop with the wrong type to a component

If we make any of these errors, TypeScript will help us notice them immediately via the IDE.
If we didn't use TypeScript, we would have to catch these errors later during testing.
We might be forced to do some tedious debugging to find the cause of the errors.

Avoiding tedious debugging is always appreciated.

Like in the previous parts, we'll start with a new empty repo.
<http://go.djosv.com/227labtsreact>.
Go ahead and import that into WebStorm just like with all the previous iterations.

Once you have that done, let's get into it!

### Vite with TypeScript

We can use [Vite](https://vitejs.dev/) to create a TypeScript app specifying the template *`react-ts`* in the initialization script.
So to create a TypeScript app, run the following command:

```shell
npm create vite@latest my-app-name -- --template react-ts
```

After running the command, ***you should have a complete basic React app that uses TypeScript***.
You can start the app by running `npm run dev` in the application's root.
> *You'll need to cd into the new folder you just created to start it*

If you take a look at the files and folders,
you'll notice that the app is not that different from one using pure JavaScript.
The only differences are that the *.jsx* files are now *.tsx* files,
they contain some type annotations, and the root directory contains a *tsconfig.json* file.

Now, let's take a look at the *tsconfig.json* file that has been created for us:

```js
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Notice `compilerOptions` now has the key [`lib`](https://www.typescriptlang.org/tsconfig#lib)
that includes:
> *type definitions for things found in browser environments (like `document`).*

Everything else should be more or less fine.

In our previous project, we used ESlint to help us enforce a coding style, and we'll do the same with this app.
We do not need to install any dependencies, since Vite has taken care of that already.

When we look at the *main.tsx* file that Vite has generated, it looks familiar but there is a small but remarkable difference.
There is an exclamation mark after the statement `document.getElementById('root')`:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

The reason for this is that the statement might return value null but the `ReactDOM.createRoot` does not accept *`null`* as a parameter.
With the [`!` operator](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-),
it is possible to assert to the TypeScript compiler that the value is *not null*.

Earlier in this part we [warned](/part8/first_steps_with_type_script#type-assertion) about the dangers of type assertions,
but in our case the assertion is OK since we are sure that the file *index.html* indeed has this particular id and the function is always returning a `HTMLElement`.

### React components with TypeScript

Let us consider the following ***JavaScript React example***:

```jsx
import ReactDOM from 'react-dom/client';
import PropTypes from "prop-types";

const Welcome = props => {
  return <h1>Hello, {props.name}</h1>;
};

Welcome.propTypes = {
  name: PropTypes.string
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Welcome name="Powercat" />
)
```

In this example, we have a component called `Welcome` to which we pass a `name` as a prop.
It then renders the name to the screen.
We know that the `name` should be a string,
and we use the [prop-types](https://www.npmjs.com/package/prop-types) package introduced in
[part 5](/part5/props_children_and_proptypes#prop-types) to receive hints about the desired types of a component's props and warnings about invalid prop types.

With TypeScript, *we don't need the **prop-types** package anymore*.
We can define the types with the help of TypeScript, just like we define types for a regular function as *React components are nothing but mere functions*.
We will use an interface for the parameter types (i.e., `props`) and `JSX.Element` as the return type for any React component:

```jsx
import ReactDOM from 'react-dom/client';

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps): JSX.Element => {
  return <h1>Hello, {props.name}</h1>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Welcome name="Powercat" />
)
```

***We defined a new type***, `WelcomeProps`, and passed it to the function's parameter types.

```jsx
const Welcome = (props: WelcomeProps): JSX.Element => {
```

> You could write the same thing using a more verbose syntax with the help of destructuring:
>
> ```jsx
> const Welcome = ({ name }: { name: string }): JSX.Element => (
> ```

Now our editor knows that the `name` prop is a string.

There is actually no need to define the return type of a React component since the TypeScript compiler infers the type automatically, and we can just write:

```jsx
interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps) => { // highlight-line
  return <h1>Hello, {props.name}</h1>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Welcome name="Powercat" />
);
```

</div>

<div class="tasks">

### Exercise 8.15

Create a new Vite App with TypeScript.

This exercise is similar to the one you have already done in [Part 1](/part1/java_script#exercises-1-3-1-5) of the course, but with TypeScript and some extra tweaks.
Start off by modifying the contents of *main.tsx* to the following:

```jsx
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
```

and *App.tsx* to the following:

```jsx
const App = () => {
  const companyName = "Nintendo";
  const companyHandhelds = [
    {
      name: "Game Boy",
      gameCount: 1046
    },
    {
      name: "Game Boy Advance",
      gameCount: 1538
    },
    {
      name: "DS",
      gameCount: 1791
    }
  ];

  const totalGames = companyHandhelds.reduce((carry, handheld) => carry + handheld.gameCount, 0);

  return (
    <div>
      <h1>{companyName}</h1>
      <p>
        {companyHandhelds[0].name} {companyHandhelds[0].gameCount}
      </p>
      <p>
        {companyHandhelds[1].name} {companyHandhelds[1].gameCount}
      </p>
      <p>
        {companyHandhelds[2].name} {companyHandhelds[2].gameCount}
      </p>
      <p>
        Number of games{totalGames}
      </p>
    </div>
  );
};

export default App;
```

and remove the unnecessary files.

The whole app is now in one component.
That is not what we want, so refactor the code so that it consists of three components: `Header`, `Content` and `Total`.
All data is still kept in the `App` component, which passes all necessary data to each component as props.
**Be sure to add type declarations for each component's props!**

The `Header` component should take care of rendering the name of the company.
`Content` should render the names of the different handhelds and the number of games on each handheld, and `Total` should render the total sum of games across all handhelds.

The `App` component should look somewhat like this:

```jsx
const App = () => {
  // const-declarations

  return (
    <div>
      <Header name={companyName} />
      <Content ... />
      <Total ... />
    </div>
  )
};
```

</div>

<div class="content">

### Adding types that don't exactly fit

In the previous exercise, we had three handhelds, and all handhelds had the same attributes `name` and `gameCount`.
But what if we needed additional attributes for the systems and each handheld needs different attributes?
How would this look, code-wise?
Let's consider the following example:

```js
const companyHandhelds = [
  {
    name: "Game Boy",
    gameCount: 1046,
    description: "AA Battery monster, here we come!"
  },
  {
    name: "DS",
    gameCount: 1791,
    numberOfScreens: 2
  },
  {
    name: "Game Boy Advance",
    gameCount: 1538,
    description: "The SP version was OP",
  },
  {
    name: "Virtual Boy",
    gameCount: 22,
    description: "All Hail The Greatest system everrrrr",
    agreement: "http://sebastianmihai.com/virtual-boy-warnings.html"
  },
];
```

In the above example, we have added some additional attributes to each handheld.
Each handheld has the `name` and `gameCount` attributes,
but the first, third and fourth also have an attribute called `description`,
and the second and fourth handhelds also have some distinct additional attributes.

Let's imagine that our application just keeps on growing, and we need to pass the different handheld systems around in our code.
On top of that, there are also additional attributes and handheld systems added to the mix.
How can we know that our code is capable of handling all the different types of data correctly,
and we are not for example forgetting to render a new handheld system on some page?
This is where TypeScript comes in handy!

Let's start by defining types for our different handhelds.
We notice that the first and third have the same set of attributes.
The second and fourth are a bit different so we have three different categories of handhelds.

So let us define a type for each handheld category:

```js
interface HandheldBasic {
  name: string;
  gameCount: number;
  description: string;
  category: "basic";
}

interface HandheldDual {
  name: string;
  gameCount: number;
  numberOfScreens: number;
  category: "dual";
}

interface HandheldVirtual {
  name: string;
  gameCount: number;
  description: string;
  agreement: string;
  category: "vr";
}
```

Besides the attributes that are found in the various handhelds,
we have now ***introduced a additional attribute called `category`*** that has a [**literal**](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) type,
it is a "hard coded" string, distinct for each handheld.
We shall soon see where the attribute `category` is used!

We will now create a type [union](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) of all these types.
We can then use this union as the type for our array, which should accept any of these handheld types:

```js
type Handheld = HandheldBasic | HandheldDual | HandheldVirtual;
```

Now we can set the type for our `companyHandhelds` variable.

```js
const App = () => {
  const companyName = "Nintendo";
  const companyHandhelds: Handheld[] = [
    {
      name: "Game Boy",
      gameCount: 1046,
      description: "AA Battery monster, here we come!",
      category: "basic" // highlight-line
    },
    {
      name: "DS",
      gameCount: 1791,
      numberOfScreens: 2,
      category: "dual" // highlight-line
    },
    {
      name: "Game Boy Advance",
      gameCount: 1538,
      description: "The SP version was OP",
      category: "basic" // highlight-line
    },
    {
      name: "Virtual Boy",
      gameCount: 22,
      description: "All Hail The Greatest system everrrrr",
      agreement: "http://sebastianmihai.com/virtual-boy-warnings.html",
      category: "vr" // highlight-line
    },
  ]

  // ...
}
```

Notice that we have now added the attribute `category` with a proper value to each element of the array.

Our editor will automatically warn us if we use the wrong type for an attribute, use an extra attribute, or forget to set an expected attribute.
If we e.g. try to add the following to the array

```js
{
  name: "3DS",
  gameCount: 1407,
  category: "dual",
},
```

We will immediately see an error in the editor:

![WebStorm 3DS needs number of screens to be a handheld](../../images/8/63new.png)

Since our new entry has the attribute `category` with value *`dual`*, **TypeScript knows that the new entry is not just a *`Handheld`* but more specifically a *`HandheldDual`***.
So here the attribute `category` ***narrows*** the type of the entry from a more general to a more specific type that has a certain set of attributes.
We shall soon see this style of type narrowing in action in the code!

But we're not satisfied yet! There is still a lot of type duplication we want to avoid.
We start by identifying the attributes all handhelds have in common, and defining a **base type** that contains them.
Then we will [extend](https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types) that base type to create our category-specific types:

```js
interface HandheldBase {
  name: string;
  gameCount: number;
}

interface HandheldBasic extends HandheldBase {
  description: string;
  category: "basic";
}

interface HandheldDual extends HandheldBase {
  numberOfScreens: number;
  category: "dual";
}

interface HandheldVirtual extends HandheldBase {
  description: string;
  agreement: string;
  category: "vr";
}

type Handheld = HandheldBasic | HandheldDual | HandheldVirtual;
```

### More type narrowing

How should we now use these types in our components?

If we try to access the objects in the array `handhelds: Handheld[]` we notice that it is possible to only access the attributes that are common to all the types in the union:

![WebStorm showing handheld...](../../images/8/65new.png)

And indeed, the TypeScript [documentation](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#working-with-union-types) says this:

> *TypeScript will only allow an operation (or attribute access) if it is valid for every member of the union.*

The documentation also mentions the following:

> *The solution is to narrow the union with code...
Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.*

So once again the [type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) is the rescue!

One way to narrow these structures in TypeScript is to use *switch case* expressions.
Once TypeScript has deduced that a variable is of union type and that each type in the union contains a particular literal attribute (in our case `category`),
we can use that as a type identifier.
We can then build a switch case around that attribute and TypeScript will know which attributes are available within each case block:

![WebStorm showing handheld. and then attributes](../../images/8/64new.png)

In the above example, TypeScript knows that a `handheld` has the type *Handheld*
and it can then infer that `handheld` is of either type *HandheldBasic*, *HandheldDual* or *HandheldVirtual* based on the value of the attribute `category`.

The specific technique of type narrowing where a union type is narrowed based on literal attribute value is called
[**discriminated union**](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions).

> Notice that the narrowing can naturally be also done via an `if` statement.
> We could eg. do the following:
>
> ```js
>   companyHandhelds.forEach(handheld => {
>     if (handheld.category === 'virtual') {
>       console.log('see the following:', handheld.agreement);
>     }
> 
>     // can not refer to handheld.agreement here!
>   });
> ```

#### Adding new types

*What about adding new types?*
If we were to add a new handheld, wouldn't it be nice to know if we had already implemented handling that type in our code?
In the example above, a new type would go to the `default` block and nothing would get printed for a new type.
Sometimes this is wholly acceptable.
For instance, if you wanted to handle only specific (but not all) cases of a type union, having a default is fine.
***Nonetheless, you should handle all variations separately in most cases.***

With TypeScript, we can use a method called [**exhaustive type checking**](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking).
Its basic principle is that if we encounter an unexpected value,
we call a function that accepts a value with the type
[**never**](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type) and also has the return type `never`.

A straightforward version of the function could look like this:

```js
/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
```

If we now were to replace the contents of our `default` block to:

```js
default:
  return assertNever(handheld);
```

and remove the case that handles the type `HandheldVirtual`, we would see the following error:

![vscode error Argument of Type CoursePart not assignable to type never](../../images/8/66new.png)

The error message says that

```bash
'HandheldVirtual' is not assignable to parameter of type 'never'.
```

which tells us that we are using a variable somewhere where it should never be used.
This tells us that something needs to be fixed.

</div>

<div class="tasks">

### Exercise 8.16

#### 8.16

Let us now continue extending the app created in exercise 8.15.
First, add the type information and replace the variable `companyHandhelds` with the one from the example below.

```js
interface HandheldBase {
  name: string;
  gameCount: number;
}

interface HandheldBasic extends HandheldBase {
  description: string;
  category: "basic";
}

interface HandheldDual extends HandheldBase {
  numberOfScreens: number;
  category: "dual";
}

interface HandheldVirtual extends HandheldBase {
  description: string;
  agreement: string;
  category: "vr";
}

type Handheld = HandheldBasic | HandheldDual | HandheldVirtual;

const companyHandhelds: Handheld[] = [
  {
    name: "Game Boy",
    gameCount: 1046,
    description: "AA Battery monster, here we come!",
    category: "basic" // highlight-line
  },
  {
    name: "DS",
    gameCount: 1791,
    numberOfScreens: 2,
    category: "dual" // highlight-line
  },
  {
    name: "Game Boy Advance",
    gameCount: 1538,
    description: "The SP version was OP",
    category: "basic" // highlight-line
  },
  {
    name: "Virtual Boy",
    gameCount: 22,
    description: "All Hail The Greatest system everrrrr",
    agreement: "http://sebastianmihai.com/virtual-boy-warnings.html"
    category: "vr" // highlight-line
  },
  {
    name: "Game Boy Color",
    gameCount: 916,
    description: "Game Boy Color...Get Into It!",
    category: "basic",
  },
];
```

Now we know that both interfaces `HandheldBasic` and `HandheldVirtual` share not only the base attributes but also an attribute called `description`, which is a `string` in both interfaces.

Your first task is to declare a new interface that includes the `description` attribute and extends the `HandheldBase` interface.
Then modify the code so that you can remove the `description` attribute from both `HandheldBasic` and `HandheldVirtual` without getting any errors.

Then create a component `System` that renders all attributes of each type of Handheld.
**Use switch case-based exhaustive type checking!**
Use the new component in component `Content`.

Lastly, add another handheld interface with the following attributes:
`name`, `gameCount`, `description` and `colors`, the latter being a string array.
The objects of this type look like the following:

```js
{
  name: "GBA SP",
  gameCount: 1538,
  description: "A way better Game Boy Advance System",
  colors: ["Silver", "Blue", "Onyx"],
  category: "special"
}
```

Then add that interface to the type union `Handheld` and add corresponding data to the `companyHandhelds` variable.
Now, if you have not modified your `Content` component correctly, you should get an error,
because you have not yet added support for the fourth handheld type.
Implement the necessary changes to `Content`, so that all attributes for the new handheld also get rendered and that the compiler doesn't produce any errors.

The result might look like the following:

![browser showing Nintendo](../../images/8/45.png)

</div>

<div class="content">

### React app with state

So far, we have only looked at an application that keeps all the data in a typed variable but does not have any state.
Let us once more go back to the task app, and build a typed version of it.

We start with the following code:

```js
import { useState } from 'react';

const App = () => {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);

  return null;
}
```

When we hover over the `useState` calls in the editor, we notice couple of interesting things.

The type of the first call `useState('')` looks like the following:

```ts
useState<string>(initialState: string | (() => string)): 
  [string, React.Dispatch<React.SetStateAction<string>>] 
```

The type is somewhat challenging to decipher.
It has the following "form":

```ts
functionName(parameters): return_value
```

So we notice that TypeScript compiler has inferred that the initial state is either a `string` or a ***function*** that *returns* a `string`:

```ts
initialState: string | (() => string)
```

The type of the returned array is the following:

```ts
[string, React.Dispatch<React.SetStateAction<string>>]
```

So with the line `const [newTask, setNewTask] = useState('');`,
we can deduce that `newTask` is a `string` since that is what `useState` returns.
The second element that we assigned `setNewTask` has a slightly more complex type: `React.Dispatch<React.SetStateAction<string>>`.
We notice that there is a `string` mentioned there, so we know that it must be the type of a function that sets a valued data.
[See here](https://codewithstyle.info/Using-React-useState-hook-with-TypeScript/) if you want to learn more about `useState`'s types.

From all this we see that TypeScript has indeed
[inferred](https://www.typescriptlang.org/docs/handbook/type-inference.html#handbook-content)
the type of the first `useState` correctly, it is creating a state with type `string`.

When we look at the second line, `const [tasks, setTasks] = useState([]);`, the type looks quite different

```ts
useState<never[]>(initialState: never[] | (() => never[])): 
  [never[], React.Dispatch<React.SetStateAction<never[]>>] 
```

*TypeScript can just infer that the state has type `never[]`*, it is an array but it ***has no clue what the elements stored in the array are***,
so we clearly need to help the compiler and provide the type explicitly.

One of the best sources for information about typing React is the [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/).

The chapter about [useState](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#usestate) hook
instructs us to use a **type parameter** in situations where the compiler can not infer the type.

Let us now define a type for `tasks`:

```js
interface Task {
  id: string,
  content: string
}
```

To fix the typing issue, we write:

```js
const [tasks, setTasks] = useState<Task[]>([]);
```

Now when hovering the type is correct:

```ts
useState<Task[]>(initialState: Task[] | (() => Task[])):
  [Task[], React.Dispatch<React.SetStateAction<Task[]>>]
```

So in technical terms useState is a [**generic function**](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables),
where the type has to be specified as a type parameter in those cases when the compiler can not infer the type.

Rendering the tasks is now easy.
Let us just add some data to the state so that we can see that the code works:

```js
import { useState } from "react";

interface Task {
  id: number,
  content: string
}

const App = () => {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, content: 'testing' } // highlight-line
  ]);

  return (
    // highlight-start
    <div>
      <ul>
        {tasks.map(task =>
          <li key={task.id}>{task.content}</li>
        )}
      </ul>
    </div>
    // highlight-end
  )
}
```

The next task is to add a form that makes it possible to create new tasks:

```js
const App = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', content: 'testing' }
  ]);
  const [newTask, setNewTask] = useState('');

  return (
    <div>
      // highlight-start
      <form>
        <input
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)} 
        />
        <button type='submit'>add</button>
      </form>
      // highlight-end
      <ul>
        {tasks.map(task =>
          <li key={task.id}>{task.content}</li>
        )}
      </ul>
    </div>
  )
}
```

It just works!
When we hover over the `event.target.value`, we see that it is a `string`, which is what `setNewTask` expects as a parameter:

![vscode showing variable is a string](../../images/8/67new.png)

So we still need the event handler for adding the new task.
Let us try the following:

```js
const App = () => {
  // ...

   // highlight-start
  const taskCreation = (event) => {
    event.preventDefault();
    // ...
  };
   // highlight-end

  return (
    <div>
      <form onSubmit={taskCreation}> // highlight-line
        <input
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)} 
        />
        <button type='submit'>add</button>
      </form>
      // ...
    </div>
  )
}
```

It does not quite work, there is an Eslint error complaining about implicit any:

![vscode error event implicitly has any type](../../images/8/68new.png)

TypeScript compiler now has no clue what the type of the parameter is.
This is why the type is the infamous implicit `any` that we want to [avoid](/part8/first_steps_with_type_script#the-horrors-of-any) at all costs.
The React TypeScript cheatsheet comes to the rescue again, the chapter about
[forms and events](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events) reveals that the right type of event handler is `React.SyntheticEvent`.

The code becomes

```js
interface Task {
  id: string,
  content: string
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

// highlight-start
  const taskCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const taskToAdd = {
      content: newTask,
      id: String(tasks.length + 1)
    }
    setTasks(tasks.concat(taskToAdd));

    setNewTask('');
  };
// highlight-end

  return (
    <div>
      <form onSubmit={taskCreation}>
        <input value={newTask} onChange={(event) => setNewTask(event.target.value)} />
        <button type='submit'>add</button>
      </form>
      <ul>
        {tasks.map(task =>
          <li key={task.id}>{task.content}</li>
        )}
      </ul>
    </div>
  )
}
```

And that's it, our app is ready and perfectly typed!

### Communicating with the server

Let's modify the app so that the tasks are saved in a JSON server backend in URL <http://localhost:3001/tasks>

As usual, we shall use Axios and the `useEffect` hook to fetch the initial state from the server.

Let us try the following:

```js
const App = () => {
  // ...
  useEffect(() => {
    axios.get('http://localhost:3001/tasks').then(response => {
      console.log(response.data);
    })
  }, []);
  // ...
}
```

When we hover over the `response.data` we see that is has the type `any`

![vscode response.data showing the any type](../../images/8/69new.png)

To set the data using `setTasks` we must type it properly.

With a little [help from the internet](https://upmostly.com/typescript/how-to-use-axios-in-your-typescript-apps), we find a clever trick:

```js
  useEffect(() => {
    axios.get<Task[]>('http://localhost:3001/tasks').then(response => { // highlight-line
      console.log(response.data);
    })
  }, []);
```

When we hover over `response.data` we see that it has the correct type:

![vscode showing response.data has Task array type](../../images/8/70new.png)

With the correct type, we can call `setTasks` to get the code working:

```js
  useEffect(() => {
    axios.get<Task[]>('http://localhost:3001/tasks').then(response => {
      setTasks(response.data); // highlight-line
    })
  }, []);
```

So just like with `useState`, we gave a *type parameter* to `axios.get` to instruct it how the typing should be done.
Like `useState`, **`axios.get`** is also a [**generic function**](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables).
Unlike some generic functions, the type parameter of `axios.get` has a default value `any`.
*If the function is used without defining the type parameter, the type of the response data would be `any`*.

The code works, and we see no large errors from eslint or the compiler.
However, ***giving a type parameter to `axios.get` is potentially dangerous***.
The *request body can be **anything***, and when giving a type parameter we are essentially just telling to TypeScript compiler to trust us that the data has type `Task[]`.

So our code is essentially as safe as it would be if a [type assertion](/part8/first_steps_with_type_script#type-assertion) were used (not good):

```js
  useEffect(() => {
    axios.get('http://localhost:3001/tasks').then(response => {
      // response.body is of type any
      setTasks(response.data as Task[]); // highlight-line
    })
  }, []);
```

Since the TypeScript types do not even exist in runtime, **our code does not *safeguard* against malformed data** from the request body.

Type casting `axios.get` might be ok if we are *absolutely sure* that the backend behaves correctly and always sends the right data.
If we want to build a robust system, we should prepare for surprises and parse the response data
(similar to what we did [in the previous section](/part8/typing_an_express_app#proofing-requests) for the requests to the backend).

Let's finish our app's functionality by integrating axios into our task creation:

```js
  const taskCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // highlight-start
    axios.post<Task>('http://localhost:3001/tasks', { content: newTask })
      .then(response => {
        setTasks(tasks.concat(response.data));
      });
    // highlight-end

    setNewTask('');
  };
```

We are again giving `axios.post` a type parameter.
We know that the server response is the added task, so the proper type parameter is `Task`.

Let's refactor a bit of the code.
Let's move some type definitions into a new file named *types.ts*:

```js
export interface Task {
  id: string,
  content: string
}

export type NewTask = Omit<Task, 'id'>
```

We have added a type for a *new task*, one that does not yet have the `id` field assigned.

The code that communicates with the backend is also refactored to the file *services/taskService.tsx*

```js
import axios from 'axios';
import { Task, NewTask } from "../types";

const baseUrl = 'http://localhost:3001/tasks';

export const getAllTasks = () => {
  return axios
    .get<Task[]>(baseUrl)
    .then(response => response.data);
}

export const createTask = (object: NewTask) => {
  return axios
    .post<Task>(baseUrl, object)
    .then(response => response.data);
}
```

The component `App` is now much cleaner:

```js
import { useState, useEffect } from "react";
import { Task } from "./types"; // highlight-line
import { getAllTasks, createTask } from './services/taskService'; // highlight-line

const App = () => {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // highlight-start
    getAllTasks().then(data => {
      setTasks(data);
    })
    // highlight-end
  }, []);

  const taskCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    // highlight-start
    createTask({content: newTask})
      .then(data => {
        setTasks(tasks.concat(data));
      });
    // highlight-end

    setNewTask('');
  };

  return (
    // ...
  );
}
```

The app is now nicely typed and ready for further development!

The code of the typed tasks can be [found here](https://github.com/comp227/typescript-tasks).

### About defining object types

We have used [interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
to define object types, e.g. diary entries, in the previous section

```js
interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
} 
```

and in the handheld of this section

```js
interface HandheldBase {
  name: string;
  gameCount: number;
}
```

We actually could have had the same effect by using a [**type alias**](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)

```js
type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
} 
```

`type` and `interface` are mostly interchangeable.
However, subtle differences exist, particularly when you try to define types or interfaces with a non-unique name.
If you define a second *`interface`* with the same name,
Typescript will merge them.
Trying to define a second *`type`*, however,
will result in Typescript raising an error because a type with the same name has already declared.

TypeScript documentation [recommends using interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces) in most cases.

</div>

<div class="tasks">

### Exercises 8.17-8.20

Let us now build a frontend for the Tails' flight diaries that was developed in [the previous section](/part8/typing_an_express_app).
The source code of the backend can be found in [this GitHub repository](https://github.com/comp227/flight-diary).

#### Exercise 8.17

Create a TypeScript React app with similar configurations as the apps of this section.
Fetch the diaries from the backend and render those to screen.
Do all the required typing and ensure that there are no Eslint errors.

***Remember to keep the network tab open.***
It might give you a valuable hint...

You can decide how the diary entries are rendered.
If you wish, you may take inspiration from the figure below.
Notice that the backend API does not return the diary comments, you may modify it to return those on a GET request.

#### Exercise 8.18

Make it possible to add new diary entries from the frontend.
In this exercise you may skip all validations and assume that the user just enters the data in a correct form.

#### Exercise 8.19

Notify the user if the the creation of a diary entry fails in the backend.
Make sure to also show the reason for the failure.

See [this example](https://dev.to/mdmostafizurrahaman/handle-axios-error-in-typescript-4mf9) on how you can narrow the Axios error so that you can get hold of the error message.

Your solution may look like this:

![browser showing error incorrect visibility best ever](../../images/8/71new.png)

#### Exercise 8.20

The addition of a diary entry is now very error prone since the user can type anything to the input fields.
We must improve this situation.

Modify the input form so that the date is set with an HTML [`date`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) input element,
and the weather and visibility are set with HTML [radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio).
We have already used radio buttons in [part 6](/part6/many_reducers#store-with-complex-state), that material may or may not be useful...

Your app should all the time stay well typed and there should not be any Eslint errors and no Eslint rules should be ignored.

Your solution could look like this:

![browser showing add new entry form for diaries](../../images/8/72new.png)

</div>
