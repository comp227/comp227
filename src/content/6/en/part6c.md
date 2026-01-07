---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: en
---

<div class="content">

### Setting up a JSON Server

Let's expand our application so that the tasks are stored in the backend.
We'll use [json-server](/part2/getting_data_from_server),
familiar from part 2.

The initial state of the database is stored in the file *db.json*, which is placed in the root of the project:

```json
{
  "tasks": [
    {
      "content": "learn more about how the app state is in redux store",
      "important": true,
      "id": 1
    },
    {
      "content": "understand more fully how state changes are made with actions",
      "important": false,
      "id": 2
    }
  ]
}
```

Let's install both *`axios`* and *`json-server`* to the project:

```js
npm i -D json-server
npm i axios
```

Then add the following line to the `scripts` part of our *package.json*

```js
"scripts": {
  "server": "json-server -p 3001 db.json",
  // ...
}
```

We can now launch *json-server* with the command `npm run server`.

### Fetch API

In software development, it is often necessary to consider whether a certain functionality should be implemented using an external library
or whether it is better to utilize the native solutions provided by the environment.
Both approaches have their own advantages and challenges.

In the earlier parts of this course, we used the [Axios](https://axios-http.com/docs/intro) library to make HTTP requests.
Now, let's explore an alternative way to make HTTP requests using the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

It is typical for an external library like *Axios* to be implemented using other external libraries.
For example, if you install Axios in your project with the command `npm i axios`, the console output will be:

```bash
$ npm i axios

added 23 packages, and audited 302 packages in 1s

71 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

So, in addition to the Axios library, the command would install over 20 other npm packages that Axios needs to function.

The *Fetch API* provides a similar way to make HTTP requests as Axios, but ***using the Fetch API does not require installing any external libraries***.
Maintaining the application becomes easier when there are fewer libraries to update, and security is also improved because the potential attack surface of the application is reduced.
The security and maintainability of applications is discussed further in [part 7](part7/class_components_miscellaneous#react-node-application-security) of the course.

In practice, requests are made using the `fetch()` function.
The syntax used differs somewhat from Axios.
We will also soon notice that Axios has taken care of some things for us and made our lives easier.
However, *we will now use the Fetch API*, as it is a widely used native solution that every Full Stack developer should be familiar with.

### Getting data from the backend

Let's create a method for fetching data from the backend in the file *src/services/tasks.js*:

```js
const baseUrl = 'http://localhost:3001/tasks'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  const data = await response.json()
  return data
}

export default { getAll }
```

*Let's take a closer look at `getAll`*.
The tasks are now fetched from the backend by calling the `fetch()` function with the backend's URL as an argument.
The request type is not explicitly defined, so `fetch` performs its default action, *which is a **GET** request*.

Once the response has arrived, the success of the request is checked using the `response.ok` property, and an error is thrown if necessary:

```js
if (!response.ok) {
  throw new Error('Failed to fetch tasks')
}
```

The `response.ok` attribute is set to `true` if the request was successful, meaning the *response status code is between 200 and 299*.
For all other status codes, such as *`404`* or *`500`*, *it is set to `false`*.

Notice that ***`fetch` does not automatically throw an error*** even if the response status code is, for example, `404`.
Error handling must be implemented manually, as we have done here.

If the request is successful, the data contained in the response is converted to JSON format:

```js
const data = await response.json()
```

***`fetch` does not automatically convert any data included in the response*** to JSON format; the conversion must be done manually.
Also remember that `response.json()` is an asynchronous method, *so the `await` keyword is required*.

Let's further simplify the code by directly returning the data from `response.json()`:

```js
const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  return await response.json() // highlight-line
}
```

### Initializing the store with data fetched from the server

Let's now modify our application so that the *application state is initialized with tasks fetched from the server*.
We'll change the initialization of the state in *taskReducer.js*, so that by default there are no tasks:

```js
const taskSlice = createSlice({
  name: 'tasks',
  initialState: [], // highlight-line
  // ...
})
```

Let's add an action creator called **`setTasks`**, which allows us to directly replace the array of tasks.
We can create the desired action creator using the `createSlice` function as follows:

```js
// ...

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    createTask(state, action) {
      const content = action.payload
      state.push({
        content,
        important: false,
        id: generateId()
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const taskToChange = state.find(t => t.id === id)
      const changedTask = {
        ...taskToChange,
        important: !taskToChange.important
      }
      return state.map(task => (task.id !== id ? task : changedTask))
    },
    // highlight-start
    setTasks(state, action) {
      return action.payload
    }
    // highlight-end
  }
})

export const { createTask, toggleImportanceOf, setTasks } = taskSlice.actions // highlight-line
export default taskSlice.reducer
```

Let's implement the initialization of tasks in the `App` component.
As usual, when fetching data from a server, we will use the `useEffect` hook:

```js
import { useEffect } from 'react' // highlight-line
import { useDispatch } from 'react-redux' // highlight-line
import taskService from './services/tasks'  // highlight-line
import { setTasks } from './reducers/taskReducer' // highlight-line

import TaskForm from './components/TaskForm'
import Tasks from './components/Tasks'
import VisibilityFilter from './components/VisibilityFilter'
import { setTasks } from './reducers/taskReducer' // highlight-line
import taskService from './services/tasks' // highlight-line

const App = () => {
  const dispatch = useDispatch() // highlight-line

  // highlight-start
  useEffect(() => {
    taskService.getAll().then(tasks => dispatch(setTasks(tasks)))
  }, [dispatch])
  // highlight-end

  return (
    <div>
      <TaskForm />
      <VisibilityFilter />
      <Tasks />
    </div>
  )
}

export default App
```

The tasks are:

1. fetched from the server using the `getAll()` method we defined, and then
2. stored in the Redux store by dispatching the action returned by the `setTasks` action creator.

These *operations are performed inside the `useEffect` hook*, meaning they are executed when the `App` component is rendered for the first time.

> ***Pertinent:***: Let's take a closer look at a small detail.
> We have added the `dispatch` variable to the dependency array of the `useEffect` hook.
> If we try to use an empty dependency array, ESLint gives the following warning: *`React Hook useEffect has a missing dependency: 'dispatch'`*.
> What does this mean?
>
> Logically, the code would work exactly the same even if we used an empty dependency array, because dispatch refers to the same function throughout the execution of the program.
> However, it is considered good programming practice to add all variables and functions used inside the `useEffect` hook that are defined within the component to the dependency array.
> This helps to avoid unexpected bugs.

### Sending data to the backend

We can do the same thing when it comes to creating a new task.
This will also give us an opportunity to practice how to make a *POST* request using the `fetch()` method.

Let's expand the code communicating with the server in *services/tasks.js*:

```js
const baseUrl = 'http://localhost:3001/tasks'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  return await response.json()
}

// highlight-start
const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create task')
  }
  
  return await response.json()
}
// highlight-end

export default { getAll, createNew } // highlight-line
```

Let's take a closer look at the implementation of the `createNew` method.
`fetch()`'s first parameter specifies the URL to send the request to.
`fetch()`'s second parameter defines other details with the request, such as the:

- *request type*
- *`headers`*, and
- *data*.

We can *further clarify the code* by storing the object that defines the request details in a separate *`options`* variable:

```js
const createNew = async (content) => {
  // highlight-start
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  }
  
  const response = await fetch(baseUrl, options)
  // highlight-end

  if (!response.ok) {
    throw new Error('Failed to create task')
  }
  
  return await response.json()
}
```

Let's take a closer look at the *`options`* object:

- `method` defines the type of the request, which in this case is *POST*
- `headers` defines the request headers.
  *We add the header `'Content-Type': 'application/json'` to let the server know that the data sent with the request is in JSON format*, so it can handle the request correctly
- `body` contains the data sent with the request.
  *You cannot directly assign a JavaScript object to this field*; it must first be converted to a JSON string by calling the `JSON.stringify()` function

As with a *GET* request, the response status code is checked for errors:

```js
if (!response.ok) {
  throw new Error('Failed to create task')
}
```

If the request is successful, *JSON Server* returns the newly created task, for which it has also generated a unique *id*.
However, the data contained in the response *still needs to be converted to JSON format using the `response.json()` method*:

```js
return await response.json()
```

Let's then modify our application's `TaskForm` component so that a new task is sent to the backend.
The method `addTask` in *components/NewTask.js* changes slightly:

```js
import { useDispatch } from 'react-redux'
import { createTask } from '../reducers/taskReducer'
import taskService from '../services/tasks' // highlight-line

const TaskForm = (props) => {
  const dispatch = useDispatch()
  
  const addTask = async (event) => { // highlight-line
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    const newTask = await taskService.createNew(content) // highlight-line
    dispatch(createTask(newTask)) // highlight-line
  }

  return (
    <form onSubmit={addTask}>
      <input name="task" />
      <button type="submit">add</button>
    </form>
  )
}

export default TaskForm
```

When a new task is created in the backend by calling the `createNew()` method, *the return value is an object representing the task*, to which the backend has generated a unique *`id`*.
Therefore, let's modify the action creator *`createTask`* defined in *tasksReducer.js* accordingly:

```js
const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    createTask(state, action) {
      state.push(action.payload) // highlight-line
    },
    // ..
  },
})
```

Changing the importance of tasks could be implemented using the same principle,
by making an asynchronous method call to the server and then dispatching an appropriate action.

The current state of the code for the application can be found on [GitHub](https://github.com/comp227/redux-tasks/tree/part6-4) in the branch *part6-4*.

</div>

<div class="tasks">

### Exercises 6.14-6.15

#### 6.14 Jokes and the backend, Step 1

When the application launches, fetch the jokes from the backend implemented using json-server.
Use the Fetch API to make the HTTP request.

As the initial backend data, you can use, e.g. [this](https://github.com/comp227/misc/blob/main/jokes.json).

#### 6.15 Jokes and the backend, Step 2

Modify the creation of new jokes, so that the jokes are stored in the backend.
Utilize the Fetch API in your implementation once again.

</div>

<div class="content">

### Asynchronous actions and Redux Thunk

Our approach is pretty good, but we can improve the separation between the components and the server communication.
It would be better if the *communication could be abstracted away from the components*
so that they don't have to do anything else but call the appropriate ***action creator***.
As an example, `App` would initialize the state of the application as follows:

```js
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeTasks())
  }, [dispatch]) 
  
  // ...
}
```

and `TaskForm` would create a new task as follows:

```js
const TaskForm = () => {
  const dispatch = useDispatch()
  
  const addTask = async (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    dispatch(createTask(content))
  }

  // ...
}
```

In this implementation, both components would `dispatch` an action
*without the need to know about the communication between the server*, which happens behind the scenes.
These kinds of **async actions** can be implemented using the [Redux Thunk](https://github.com/reduxjs/redux-thunk) library.
The use of the library *doesn't need any additional configuration/installation* when we use Redux Toolkit's `configureStore`.

With Redux Thunk, it is possible to implement **action creators** that *return a function* instead of an object.
This allows implementations of ***asynchronous action creators*** that:

1. wait for the completion of a specific asynchronous operation
2. and only then *dispatch* an action, which changes the store's state.

If an action creator returns a function, Redux automatically passes the Redux store's *`dispatch`* and *`getState`* methods as arguments to the returned function.
This allows us to define an action creator called **`initializeTasks`** in the *taskReducer.js* file, which fetches the initial tasks from the server, as follows:

```js
import { createSlice } from '@reduxjs/toolkit'
import taskService from '../services/tasks' // highlight-line

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    createTask(state, action) {
      state.push(action.payload)
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const taskToChange = state.find((t) => t.id === id)
      const changedTask = {
        ...taskToChange,
        important: !taskToChange.important,
      }
      return state.map((task) => (task.id === id ? changedTask : task))
    },
    setTasks(state, action) {
      return action.payload
    },
  },
})

const { setTasks } = taskSlice.actions // highlight-line

// highlight-start
export const initializeTasks = () => {
  return async (dispatch) => {
    const tasks = await taskService.getAll()
    dispatch(setTasks(tasks))
  }
}
// highlight-end

export const { createTask, toggleImportanceOf } = taskSlice.actions // highlight-line

export default taskSlice.reducer
```

In its inner function, that is, in the **asynchronous action**, the operation first fetches all tasks from the server (*`getAll`*)
and then ***dispatches*** the `setTasks` action to add the tasks to the store.
It is notable that Redux automatically passes a reference to the `dispatch` method as an argument to the function, so the action creator `initializeTasks` does not require any parameters.

The action creator `setTasks` is no longer exported outside the module,
since the initial state of the tasks will now be set using the asynchronous action creator `initializeTasks` we created.
However, we still use the `setTasks` action creator within the module.

The component `App` can now be defined as follows:

```js
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import TaskForm from './components/TaskForm'
import Tasks from './components/Tasks'
import VisibilityFilter from './components/VisibilityFilter'
import { initializeTasks } from './reducers/taskReducer' // highlight-line

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeTasks()) // highlight-line
  }, [dispatch])

  return (
    <div>
      <TaskForm />
      <VisibilityFilter />
      <Tasks />
    </div>
  )
}

export default App
```

The solution is elegant.
The initialization logic for the tasks has been completely separated from the React component.

### Refactoring to separate task creation

Next, let's create an asynchronous action creator called `appendTask`:

```js
import { createSlice } from '@reduxjs/toolkit'
import taskService from '../services/tasks'

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    createTask(state, action) {
      state.push(action.payload)
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const taskToChange = state.find((t) => t.id === id)
      const changedTask = {
        ...taskToChange,
        important: !taskToChange.important,
      }
      return state.map((task) => (task.id === id ? changedTask : task))
    },
    setTasks(state, action) {
      return action.payload
    },
  },
})

const { createTask, setTasks } = taskSlice.actions // highlight-line

export const initializeTasks = () => {
  return async (dispatch) => {
    const tasks = await taskService.getAll()
    dispatch(setTasks(tasks))
  }
}

// highlight-start
export const appendTask = (content) => {
  return async (dispatch) => {
    const newTask = await taskService.createNew(content)
    dispatch(createTask(newTask))
  }
}
// highlight-end

export const { toggleImportanceOf } = taskSlice.actions // highlight-line

export default taskSlice.reducer
```

The principle is the same: first, an asynchronous operation (*`createNew`*) is executed,
and once it is completed, an action that updates the store's state is ***dispatched***.

> ***FYI:*** The `createTask` action creator is no longer exported outside the file; it is used only internally in the implementation of the `appendTask` function.

The component `TaskForm` changes as follows:

```js
import { useDispatch } from 'react-redux'
import { appendTask } from '../reducers/taskReducer' // highlight-line

const TaskForm = () => {
  const dispatch = useDispatch()

  const addTask = async (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    dispatch(appendTask(content)) // highlight-line
  }

  return (
    <form onSubmit={addTask}>
      <input name="task" />
      <button type="submit">add</button>
    </form>
  )
}
```

The current state of the code for the application can be found on [GitHub](https://github.com/comp227/redux-tasks/tree/part6-5) in the branch *part6-5*.

Redux Toolkit offers a multitude of tools to simplify asynchronous state management,
like the [`createAsyncThunk`](https://redux-toolkit.js.org/api/createAsyncThunk) function
and the [*RTK Query*](https://redux-toolkit.js.org/rtk-query/overview) API.

</div>

<div class="tasks">

### Exercises 6.16-6.19

#### 6.16 Jokes and the backend, Step 3

Modify the initialization of the Redux store to happen using asynchronous action creators, which are made possible by the *Redux Thunk* library.

#### 6.17 Jokes and the backend, Step 4

Also modify the creation of a new joke to happen using asynchronous action creators.

#### 6.18 Jokes and the backend, Step 5

Voting does not yet save changes to the backend.
Fix this situation with the help of the *Redux Thunk* library and the Fetch API.

#### 6.19 Jokes and the backend, Step 6

The creation of notifications is still a bit tedious since one has to do two actions and use the `setTimeout` function:

```js
dispatch(setNotification(`new joke '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

Make an action creator, which enables one to provide the notification as follows:

```js
dispatch(setNotification(`you voted '${joke.content}'`, 10))
```

The first parameter is the text to be rendered and the second parameter is the time to display the notification given in seconds.

Implement the use of this improved notification in your application.

</div>
