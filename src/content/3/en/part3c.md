---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: en
---

<div class="content">

Before we move into the main topic of persisting data in a database, we will take a look at a few different ways of debugging Node applications.

### Debugging Node applications

Debugging Node applications is slightly more difficult than debugging JavaScript running in your browser.
Printing to the console is simple and works, and can be quickly elaborated via our live templates.
Sometimes though, using `console.log` everywhere just makes things messy.
While some people disagree, I believe that *if you take the time to learn to use the debugger, it can greatly help your abilities as a software dev in the future*.

#### WebStorm

To use WebStorm to ***debug the backend***, you'll need to tell WebStorm where *node* is.
You can start this by going to ***Run->Debug*** in the top menu.
You'll then see a tiny Debug window in the middle of the screen that looks like this:

![debug window](../../images/3/custom/debug_option.png)

Once you select, Edit configurations..., you'll then arrive at this window:

![node configuration in WebStorm](../../images/3/35x.png)

After clicking on npm, you'll see a variety of options.
You'll then:

1. Select the *Command* dropdown and pick ***Start***.
2. Select the *Node interpreter* dropdown and choose the nvm path that you [added in back in our initial configuration](/part0/configuring_your_machine_for_this_course#link-webstorm-to-nvm).
3. Click ***Debug***

At that point click ***Debug***.

At this point, you'll see via the process console that WebStorm starts up by running `npm start`.
The output in red is similar to the `npm start` output from the terminal, with some additional messages about WebStorm attaching a debugger.

![WebStorm process console](../../images/3/custom/process_console.png)

> **Remember:** the application shouldn't be running in another console, otherwise the port will already be in use.

Below you can see a screenshot where the code execution has been paused in the middle of saving a new task:

![WebStorm screenshot of execution at a breakpoint](../../images/3/36x.png)

The execution stopped at the **breakpoint** in line 81.
On the line itself and in the code, you can see some of the values of different variables.
For example, at the end of line 77 in light gray, you can see the value of `body.important` is *`false`*.
On line 81 you can also see the value of `task`.
To see the current values of all of the pertinent variables and objects at the point of executing line 81, you want to look in the Debugger Pane at the bottom of WebStorm.
For example, you can see what the value of `tasks` is just before it changes.

In the Debugger Console, you can type in values just like you did before in the developer tools console.
The Debugger Console is great as you can type out code to see what values would be as you are writing the code.
See here my example of checking to see if I am parsing a string correctly.

![WebStorm screenshot of debugger console](../../images/3/custom/webstorm_debugger_console.png)

The arrows at the top of the debugger window control the program's flow and execute a single line of code when they get pressed.
Their behavior differs though when the lines contain a function.
When on a line that contains a function:

- **step into** will jump into the body of the function and execute the first line.
- **step over** will execute the entire function's body and just give the result
- **step out** will finish executing the body of a function and return back to the function that called it.

Finally, the inspector is similar to the debugger console that I showed.
However, this particular feature is available across all JetBrains IDEs for evaluating expressions while debugging during the state of control.

Lastly, look at some of the icons on the right.

- The play button resumes execution of the program
- The red square stop sign will stop debugging
- the red octagon stop signs allow you to see all breakpoints or to pause breakpoints from executing for a while.
- the lightning bolt allows your program to break on an exception, which can be very handy when trying to find out when an exception is being thrown.

Invest time into learning to use a debugger properly...it can save you a lot of time in the future and increase your understanding of a language as well!

#### Chrome dev tools

Debugging backend applications is also possible with the Chrome developer console by starting your application with the command:

```bash
node --inspect index.js
```

You can access the debugger by clicking the green icon - the node logo - that appears in the Chrome developer console:

![dev tools with green node logo icon](../../images/3/37.png)

The *Debugging View* works the same way as it did with React applications.
The ***Sources*** tab can be used for setting breakpoints where the execution of the code will be paused.

![dev tools sources tab breakpoint and watch variables](../../images/3/38eb.png)

All of the application's `console.log` messages will appear in the ***Console*** tab of the debugger.
You can also inspect the values of variables and execute your JavaScript code.

![dev tools console tab showing task object typed in](../../images/3/39ea.png)

#### Question everything

Soon our application will also have a database in addition to the frontend and backend,
so there will be many potential areas for bugs in the application.
With so many areas, debugging Full-Stack applications may seem tricky at first.

When the application "does not work", we have to first figure out where the problem occurs.
It's very common for the problem to exist in a place where you didn't expect it to,
and it can take minutes, hours, or even days before you find the source of the problem.

The key is to ***be systematic*** so that you can divide and conquer.
Since the problem can exist anywhere, *you must question everything*, and eliminate all possibilities one by one.
Logging to the console, REST Client/Postman, debuggers, and experience will help.

When bugs occur, ***the worst of all possible strategies*** is to continue writing code.
It will guarantee that your code will soon have even more bugs, and debugging them will be even more difficult.
The [Jidoka *stop and fix* principle](https://leanscape.io/principles-of-lean-13-jidoka/)
from Toyota Production Systems is very effective in this situation as well.

### MongoDB

To store our saved tasks indefinitely, we need a database.
Most college courses use relational databases.
In most parts of this course, we will use [MongoDB](https://www.mongodb.com/)
which is a [**document database**](https://en.wikipedia.org/wiki/Document-oriented_database).

Mongo is easier to understand compared to a relational database.

Document databases differ from relational databases in how they organize data as well as in the query languages they support.
Document databases are usually categorized under the [NoSQL](https://en.wikipedia.org/wiki/NoSQL) umbrella term.

Please read the chapters on [collections](https://docs.mongodb.com/manual/core/databases-and-collections/) and [documents](https://docs.mongodb.com/manual/core/document/)
from the MongoDB manual to get a basic idea of how a document database stores data.

Naturally, you can install and run MongoDB on your computer.
However, the internet is also full of Mongo database services that you can use that are always available in the cloud.
Our preferred MongoDB provider in this course will be [**MongoDB Atlas**](https://www.mongodb.com/atlas/database).

Once you've created, verified, and logged into your account with Atlas, you're first presented with a survey.
These are the options to choose.

![MongoDB survey first time user](../../images/3/custom/mongo_survey.png)

After clicking ***Finish***, you're given a choice for a deployment option.
Choose the shared option.

![MongoDB's deploy a cloud database free shared](../../images/3/mongo1.png)

Pick the cloud provider and location and create the cluster:

![MongoDB picking shared, aws and region](../../images/3/mongo2.png)

Let's wait for the cluster to be ready for use.
This may take some minutes, but for me, it was pretty quick.

Now let's answer the questions from the Security Quickstart.
Because you are handling data, you need to create a user and password that can connect and access your database.
***These are not the same credentials that you use for logging into MongoDB Atlas.***
For me, I used *`comp227`* as the user, and then clicked ***Autogenerate the password*** and clicked ***Copy***.
Store that password somewhere that you can access it, as you'll need it in files we'll modify soon.
Finally, once you've stored the password in a secure location, click ***Create User***.

> If you do ever lose that password, you'll be able to edit the user and set a new password.

![MongoDB security quickstart](../../images/3/mongo3.png)

Next, we have to define the IP addresses that are allowed access to the database.
For the sake of simplicity, we will allow access from all IP addresses, scroll down and type `0.0.0.0/0`, and then click ***Add Entry*** and then ***Finish and Close***.

![MongoDB network access/add ip access list](../../images/3/mongo4.png)

At this point, you may get two more popups.
I liked the wizard so I unchecked it before closing, and I also skipped the Termination Protection feature.
After closing the popups, we are finally ready to connect to our database.
Click ***Connect***:

![MongoDB database deployment connect](../../images/3/mongo5.png)

Choose: ***Connect your application***, then you'll see this screen.

![MongoDB connect application](../../images/3/mongo6.png)

The view displays the *MongoDB URI*, which is the address of the database that we will supply to the MongoDB client library we will add to our application.

The address looks like this:

```bash
mongodb+srv://comp227:$<password>@cluster0.gb6u3el.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&appName=Cluster0
```

We are now ready to use the database.

We could use the database directly from our JavaScript code
with the [official MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/) library,
but it is quite cumbersome to use.
We will instead use the [Mongoose](http://mongoosejs.com/index.html) library that offers a higher-level API.

Mongoose could be described as an **object document mapper** (ODM),
and saving JavaScript objects as Mongo documents is straightforward with this library.

Let's install Mongoose on our backend:

```bash
npm i mongoose
```

Let's not add any code dealing with Mongo to our backend just yet.
Instead, let's make a practice application by creating a new file, *mongo.js* in the root of the *`tasks` backend* application:

```js
const mongoose = require('mongoose').set('strictQuery', true)

if (process.argv.length < 3) {
  console.log('give password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://comp227:${password}@cluster0.gb6u3el.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const taskSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Task = mongoose.model('Task', taskSchema)

mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log('connected')

    const task = new Task({
      content: 'Practice coding interview problems',
      date: new Date(),
      important: true,
    })

    return task.save()
  })
  .then(() => {
    console.log('task saved!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))
```

> **Pertinent:** Depending on which region you selected when building your cluster, the *MongoDB URI* may be different from the example provided above.
You should verify and use the correct URI that was generated from MongoDB Atlas.

The connection to the database is established with the command:

```js
mongoose.connect(url, { family: 4 })
```

The method takes the database URL as the first argument and an object that defines the required settings as the second argument.
MongoDB Atlas supports only IPv4 addresses, so with the object `{ family: 4 }` we specify that the connection should always use IPv4.

The code also assumes that it will be passed the password from the credentials we created in MongoDB Atlas, as a command line parameter.
In the code above, we access the command line parameter like this:

```js
const password = process.argv[2]
```

When the code is run with the command `node mongo.js YOUR_PASSWORD_HERE`, Mongo will add a new document to the database.

> **Remember:** Replace `YOUR_PASSWORD_HERE` with the *password created for the database user*, not your MongoDB Atlas password.
> Also, if you created a password with special characters,
then you'll need to [URL encode that password](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password).

We can view the current state of the database from the MongoDB Atlas from ***Browse collections***, in the Database tab.

![MongoDB databases browse collections button](../../images/3/mongo7.png)

As the view states, the *document* matching the task has been added to the ***tasks*** collection in the ***myFirstDatabase*** database.

![MongoDB collections tab db my first app tasks](../../images/3/mongo8.png)

Let's destroy the default database ***myFirstDatabase*** and change the name of the database referenced in our connection string to `taskApp` instead, by modifying the URI:

```bash
const url = `mongodb+srv://comp227:${password}@cluster0.gb6u3el.mongodb.net/taskApp?retryWrites=true&w=majority&appName=Cluster0`
```

Let's run our code again:

![MongoDB collections tab taskApp tasks](../../images/3/mongo9.png)

The data is now stored in the right database.
The view also offers the ***create database*** functionality, that can be used to create new databases from the website.
Creating a database like this is not necessary, since MongoDB Atlas automatically creates a new database when an application tries to connect to a database that does not exist yet.

### Schema

After establishing the connection to the database, we define the [**schema**](https://mongoosejs.com/docs/guide.html#schemas)
for a task and the matching [**model**](https://mongoosejs.com/docs/models.html):

```js
const taskSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Task = mongoose.model('Task', taskSchema)
```

First, we define the [schema](https://mongoosejs.com/docs/guide.html#schemas) of a task that is stored in the `taskSchema` variable.
The schema tells Mongoose how the task objects are to be stored in the database.

In the `Task` model definition, the first `'Task'` parameter is the *singular name of the model*.
The name of the collection will be the lowercase plural `tasks`, because the [Mongoose convention](https://mongoosejs.com/docs/models.html#compiling)
is to automatically name collections as the plural (e.g. `tasks`) when the schema refers to them in the singular (e.g. `Task`).

Document databases like Mongo are **schemaless**, meaning that the database itself does not care about the structure of the data that is stored in the database.
It is possible to store documents with completely different fields in the same collection.

The idea behind Mongoose is that the data stored in the database is given a *schema at the level of the application* that defines the shape of the documents stored in any given collection.

### Creating and saving objects

Next, the application creates a new task object with the help of the `Task` [model](https://mongoosejs.com/docs/models.html):

```js
const task = new Task({
  content: 'Study for 227',
  date: new Date(),
  important: false,
})
```

Models are **constructor functions** that create new JavaScript objects based on the provided parameters.

> **Pertinent:** Since the objects are created with the model's constructor function,
they have all the properties of the model, which include methods for saving the object to the database.

Saving the object to the database happens with the appropriately named `save` method, which can be provided with an event handler with the `then` method:

```js
task.save().then(result => {
  console.log('task saved!')
  mongoose.connection.close()
})
```

When the object is saved to the database, the event handler provided to `then` gets called.
The event handler closes the database connection with the command `mongoose.connection.close()`.
If the connection is not closed, the connection remains open until the program terminates.

The event handler's **`result`** parameter stores the *result of the save* operation.
The result is not that interesting when we're storing one object in the database.
You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging.

Let's also save a few more tasks by modifying the data in the code and by executing the program again.

> **Pertinent:** Unfortunately the Mongoose documentation is not very consistent,
with parts of it using callbacks in its examples and other parts, other styles,
so it is not recommended to copy and paste code directly from there.
***Mixing promises with old-school callbacks in the same code is not recommended***.

### Fetching objects from the database

Let's comment out the code in *mongo.js* that creates and saves the `task` and replace it with the following:

```js
Task.find({}).then(result => {
  result.forEach(task => {
    console.log(task)
  })
  mongoose.connection.close()
})
```

When the code is executed, the program prints all the tasks stored in the database:

![node mongo.js outputs tasks as JSON](../../images/3/70ea.png)

The objects are retrieved from the database with the [`find` method](https://mongoosejs.com/docs/api/model.html#model_Model-find) of the `Task` model.
The parameter for `find` is an object expressing search conditions.
Since the parameter is an empty object (`{}`), we get all of the tasks stored in the ***tasks*** collection.

The search conditions adhere to the [Mongo search query syntax](https://docs.mongodb.com/manual/reference/operator/).

As an example of that syntax, we could restrict our search to only include important tasks like this:

```js
Task.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### Exercise 3.12

#### 3.12: Command-line database

Create a cloud-based MongoDB database for the *communities* application with MongoDB Atlas.

Create a *mongo.js* file in the *communities* project directory, that can be used for adding a community, and for listing all of the communities.

> ***Do not include or paste in the password in any of the files in your repo!***
> We have auto-commit turned on, so any change will get saved.
> If this does happen, please send me a discord message.

The application should work as follows.
You use the program by passing three command-line arguments (the first is the password), e.g.:

```bash
node mongo.js your_mongo_password_here "Meaningful Conversation" https://discord.com/invite/PHrdsnKa
```

As a result, the application will print:

```bash
added Meaningful Conversation and invite URL https://discord.com/invite/PHrdsnKa to communities
```

The new community entry will be saved to the database.
Notice that because the community name in this example contains whitespace characters, it is enclosed in quotes.
If it is one word, then it is not necessary.

```bash
node mongo.js your_mongo_password_here MeditationMind https://discord.com/invite/XT9xqwv9
```

If the password is the only parameter given to the program, meaning that it is invoked like this:

```bash
node mongo.js your_mongo_password_here
```

Then the program should display all of the communities:

```shell
communities:
Meaningful Conversation https://discord.com/invite/PHrdsnKa
MeditationMind https://discord.com/invite/XT9xqwv9
PySlackers https://pythondev.slack.com
```

You can get the command-line parameters from the [`process.argv`](https://nodejs.org/docs/latest-v22.x/api/process.html#process_process_argv) variable.

> **Pertinent: do not close the connection in the wrong place**.
> E.g. the following code will not work:
>
> ```js
> Group
>   .find({})
>   .then(groups=> {
>     // ...
>   })
> 
> mongoose.connection.close()
> ```
>
> In the code above the `mongoose.connection.close()` command will get executed immediately after the `Group.find` operation is started.
This means that the database connection will be closed immediately,
and the execution will never get to the point where `Group.find` operation finishes and the `callback` function gets called.
>
> The correct place for closing the database connection is at the end of the callback function:
>
> ```js
> Group
>   .find({})
>   .then(groups=> {
>     // ...
>     mongoose.connection.close()
>   })
> ```

</div>

<div class="content">

### Connecting the backend to a database

Now we have enough knowledge to start using Mongo in our tasks application backend. 🥳

Let's get a quick start by copy-pasting the Mongoose definitions to the backend's *index.js* file:

```js
const mongoose = require('mongoose').set('strictQuery', true)
const password = process.argv[2]

// DO NOT SAVE OR EVEN PASTE YOUR PASSWORD ANYWHERE IN THE REPO
const url = `mongodb+srv://comp227:${password}@cluster0.gb6u3el.mongodb.net/taskApp?retryWrites=true&w=majority&appName=Cluster0`
// LET ME REPEAT - DO NOT SAVE YOUR PASSWORD IN YOUR REPO!

mongoose.connect(url, { family: 4 })

const taskSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Task = mongoose.model('Task', taskSchema)
```

Let's change the handler for fetching all tasks to the following form:

```js
app.get('/api/tasks', (request, response) => {
  Task.find({}).then(tasks => {
    response.json(tasks)
  })
})
```

Let's start the backend with the command `node --watch index.js yourpassword` so we can verify in the browser that the backend correctly displays all tasks saved to the database:

![api/tasks in browser shows tasks in JSON](../../images/3/44ea.png)

The application works almost perfectly.
The frontend assumes that every object has a unique id in the `id` field.
We also don't want to return the mongo versioning field `__v` to the frontend.

One way to format the objects returned by Mongoose is to [*modify*](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id)
the `toJSON` method of the schema, which is used on all instances of the models produced with that schema.

To modify the method we need to change the configurable options of the schema.

Options can be changed using the [`set` method of the schema](https://mongoosejs.com/docs/guide.html#options).

MongooseJS is a good source of documentation.
For more info on the `toJSON` option, check out:

- [the mongoose JSON guide](https://mongoosejs.com/docs/guide.html#toJSON)
- [mongoose `toObject` JSON API Reference](https://mongoosejs.com/docs/api.html#document_Document-toObject)
  
For info on the `transform` function see <https://mongoosejs.com/docs/api/document.html#transform>.

Below is one way to modify the schema:

```js
taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

Even though the `_id` property of Mongoose objects looks like a string, ***it is an object***.
The `toJSON` method we defined transforms it into a string just to be safe.
If we didn't make this change, it would cause more harm to us in the future once we start writing tests.

Let's respond to the HTTP request with a list of objects formatted with the `toJSON` method:

```js
app.get('/api/tasks', (request, response) => {
  Task.find({}).then(tasks => {
    response.json(tasks)
  })
})
```

The code automatically uses the defined `toJSON` when formatting *`tasks`* to the response.

### Moving db configuration to its own module

Before we refactor the rest of the backend to use the database, let's extract the Mongoose-specific code into its own module.

Let's create a new directory for the module called *models*, and add a file called *task.js*:

```js
const mongoose = require('mongoose').set('strictQuery', true)

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
// highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
// highlight-end

const taskSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', taskSchema) // highlight-line
```

Defining Node [modules](https://nodejs.org/docs/latest-v22.x/api/modules.html)
differs slightly from the way of defining [ES6 modules](/part2/rendering_a_collection_modules#refactoring-modules) in part 2.

The public interface of the module is defined by setting a value to the `module.exports` variable.
We will set the value to be the `Task` model.
The other things defined inside of the module, like the variables `mongoose` and `url` will not be accessible or visible to users of the module.

Importing the module happens by adding the following line to *index.js*:

```js
const Task = require('./models/task')
```

This way the `Task` variable will be assigned to the same object that the module defines.

### Defining environment variables using the dotenv library

```js
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

It's not a good idea to hardcode the address of the database into the code,
so instead the address of the database is passed to the application via the `MONGODB_URI` environment variable.
We'll discuss where to store this variable shortly.

Now, our code for establishing a connection has handlers for dealing with successful and unsuccessful connection attempts.
Both functions just log a message to the console about the success status:

![node output when given the wrong username/password](../../images/3/45e.png)

There are many ways to define the value of an environment variable.
One way would be to define it when the application is started:

```bash
MONGODB_URI=address_here npm run dev
```

A more sophisticated way to define environment variables is to use the [dotenv](https://github.com/motdotla/dotenv#readme) library.
You can install the library with the command:

```bash
npm i dotenv
```

To use the library, we will create a *.env* file at the root of the project.
Please make sure that *.env* is added to your github folder.
You should ***close WebStorm*** so that your file watchers are not active currently.
After that, you can make a .env file and type `git status` to verify that git does not see the .env file as something that was added.
If it was or if it says it was updated, please send me a message to help you get the commands to remove the *.env* file and to verify it's in your *.gitignore* file.
The environment variables are defined inside of the file, and it can look like this:

```bash
MONGODB_URI=mongodb+srv://comp227:your_DB_password@cluster0.o1opl.mongodb.net/taskApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
```

We also added the hardcoded port of the server into the `PORT` environment variable.

Our repos have been setup to already ignore the *.env* file by default.
If you ever make a new repo, **make sure that you immediately add `.env` so you do not publish any confidential information publicly online!**

Once you verify that *.env* is correctly being ignored by git, ***open up WebStorm again***.

The environment variables defined in the *.env* file can be taken into use with the expression `require('dotenv').config()`
and you can reference them in your code just like you would reference normal environment variables, with the `process.env.MONGODB_URI` syntax.

Let's load the environment variables at the beginning of the *index.js* file so that they are available throughout the entire application.
Let's change *index.js* in the following way:

```js
require('dotenv').config() // highlight-line
const express = require('express')
const Task = require('./models/task') // highlight-line

const app = express()
// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

> You can also take out the pre-filled contents inside the `tasks` variable and just leave it as an empty array *[]*.

Notice how `dotenv` must be imported before the `task` model.
This ensures that the environment variables from the *.env* file are available globally before the code from the other modules is imported.

> **Pertinent:** Once the file *.env* has been gitignored, Render does not get the database URL from the repository, so ***you have to set the DB URL yourself***.
>
> That can be done by visiting the [Render dashboard](http://dashboard.render.com).
> Once you are there, click on your web service and then select ***Environment*** from the left-hand nav menu.
> Scroll down until you can click on ***Add Secret File.**
> From there, name the file .env and then click the contents section.
> There you will paste all of the contents of your .env file, making sure you put your DB password from mongo in there.
> Next click ***Done*** and then Finally ***Save Changes***.
>
> ![browser showing render environment variables](../../images/3/cloudConfig.png)

### Using database in route handlers

Next, let's change the rest of the backend functionality to use the database.

Creating a new task is accomplished like this:

```js
app.post('/api/tasks', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const task = new Task({
    content: body.content,
    important: Boolean(body.important) || false,
    date: new Date().toISOString(),
  })

  task.save().then(savedTask => {
    response.json(savedTask)
  })
})
```

The task objects are created with the `Task` constructor function.
The response is sent inside of the callback function for the `save` operation.
This ensures that the response is sent only if the operation succeeded.
We will discuss error handling a little bit later.

The `savedTask` parameter in the callback function is the saved and newly created task.
The data sent back in the response is the formatted version created with the `toJSON` method:

```js
response.json(savedTask)
```

Using Mongoose's [`findById` method](https://mongoosejs.com/docs/api/model.html#model_Model-findById), fetching an individual task gets changed to the following:

```js
app.get('/api/tasks/:id', (request, response) => {
  Task.findById(request.params.id).then(task => {
    response.json(task)
  })
})
```

### Verifying frontend and backend integration

When the backend gets expanded, it's a good idea to test the backend first with **the browser, Postman or the WebStorm REST client**.
Next, let's try creating a new task after taking the database into use:

![WebStorm rest client doing a post](../../images/3/46e.png)

***Verify first*** that the backend completely works.
Then you can test that the frontend works with the backend.
***It is highly inefficient to test things exclusively through the frontend.***

It's probably a good idea to integrate the frontend and backend one functionality at a time.
First, we could implement fetching all of the tasks from the database and test it through the backend endpoint in the browser.
After this, we could verify that the frontend works with the new backend.
Once everything seems to be working, we would move on to the next feature.

Once we introduce a database into the mix, it is useful to inspect the saved state in the database, e.g. from the control panel in MongoDB Atlas.
Quite often small Node programs (like the *mongo.js* program we wrote earlier) can be very helpful for testing during development.

You can find the code for our current application in its entirety in the [*part3-4* branch of our backend repo](https://github.com/comp227/part3-tasks-backend/tree/part3-4).

</div>

<div class="tasks">

### Exercises 3.13-3.14

The following exercises are pretty straightforward,
but if your frontend stops working with the backend, then finding and fixing the bugs can be quite interesting.

#### 3.13: Communities database, Step 1

Change the fetching of all communities so that the data is **fetched from the database**.

Verify that the frontend works after the changes have been made.

In the following exercises, write all Mongoose-specific code into its own module,
just like we did in the chapter [Database configuration into its own module](/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module).

#### 3.14: Communities database, Step 2

Change the backend so that new URLs are **saved to the database**.
Verify that your frontend still works after the changes.

For this exercise, you can allow communities to have the same name.

</div>

<div class="content">

### Error handling

If we try to visit the URL of a task with an id that does not exist e.g. <http://localhost:3001/api/tasks/5c41c90e84d891c15dfa3431>
where `5c41c90e84d891c15dfa3431` is not an id stored in the database, then the response will be `null`.

Let's change this behavior so that if a task with the given id doesn't exist,
the server will respond to the request with the HTTP status code 404 not found.
In addition, let's implement a simple `catch` block to handle cases where the promise returned by the `findById` method is **rejected**:

```js
app.get('/api/tasks/:id', (request, response) => {
  Task.findById(request.params.id)
    .then(task => {
      // highlight-start
      if (task) {
        response.json(task)
      } else {
        response.status(404).end()
      }
      // highlight-end
    })
    // highlight-start
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
    // highlight-end
})
```

If no matching object is found in the database, the value of `task` will be `null` and the `else` block is executed.
This results in a response with the status code **404 not found**.
If a promise returned by the `findById` method is rejected, the response will have the status code **500 internal server error**.
The console displays more detailed information about the error.

On top of the non-existing task, there's one more error situation that needs to be handled.
In this situation, we are trying to fetch a task with the wrong kind of `id`, meaning an `id` that doesn't match the Mongo identifier format.

If we make a request like `GET http://localhost:3001/api/tasks/someInvalidId`, we will get an error message like the one shown below:

```shell
Method: GET
Path:   /api/tasks/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id" for model "Task"
    at CastError (/Users/powercat/comp227/part3-tasks/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/powercat/comp227/part3-tasks/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
```

Given a malformed id as an argument, the `findById` method will throw an error causing the returned promise to be rejected.
This will cause the callback function defined in the `catch` block to be called.

Let's make some small adjustments to the response in the `catch` block:

```js
app.get('/api/tasks/:id', (request, response) => {
  Task.findById(request.params.id)
    .then(task => {
      if (task) {
        response.json(task)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({error: 'malformatted id'}) // highlight-line
    })
})
```

If the format of the id is incorrect, then we will end up in the error handler defined in the `catch` block.
The appropriate status code for the situation is
[400 Bad Request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request)
because the situation fits the description perfectly:

> *The 400 (Bad Request) status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error
> (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).*

We have also added some information to the response to shed some light on the cause of the error.

When dealing with Promises, it's almost always a good idea to add error and exception handling.
Otherwise, you will find yourself dealing with strange bugs.

You can always print the object that caused the exception to the console in the error handler:

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

The reason the error handler gets called might be something completely different than what you had anticipated.
If you log the error to the console, you may save yourself from long and frustrating debugging sessions.
Moreover, most modern services where you deploy your application support some form of logging system that you can use to check these logs.

Every time you're working on a project with a backend, **it is critical to keep an eye on the console output of the backend**.
If you are working on a small screen, it is enough to just see a tiny slice of the output in the background.
Any error messages will catch your attention even when the console is far back in the background:

![sample screenshot showing tiny slice of output](../../images/3/15b.png)

> **FYI:** You can keep the terminal in the background even if you are using the WebStorm terminal.
> All you need to do is change the terminal to the window view mode instead of as a dock by right-clicking on WebStorm's *Terminal* tab.
>
> ![changing the terminal to be a window](../../images/3/custom/changing_terminal_to_window.png)

### Moving error handling into middleware

We have written the code for the error handler among the rest of our code.
This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place.
This can be particularly useful if we want to report data related to errors to an external error-tracking system like [Sentry](https://sentry.io/welcome/) later on.

Let's change the handler for the ***/api/tasks/:id*** route so that it passes the error forward with the `next` function.
The next function is passed to the handler as the third parameter:

```js
app.get('/api/tasks/:id', (request, response, next) => { // highlight-line
  Task.findById(request.params.id)
    .then(task => {
      if (task) {
        response.json(task)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // highlight-line
})
```

The error that is passed forward is given to the `next` function as an argument.
If `next` was called without an argument, then the *execution would simply move onto the next route or middleware*.
If the `next` function is called with an argument, then the execution will continue to the **error handler middleware**.

Express [error handlers](https://expressjs.com/en/guide/error-handling.html)
are middleware that are defined with a function that accepts ***four parameters***.
Our error handler looks like this:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
```

After printing the error message, the error handler checks if the error is a `CastError` exception, in which case we know that the error was caused by an invalid object id for Mongo.
In this situation, the error handler will send a response to the browser with the response object passed as a parameter.
In all other error situations, the middleware passes the error forward to the default Express error handler.

> **Remember:** the error-handling middleware *has to be the last loaded middleware*.
> Also, *all the routes should be registered before the error-handler*!

### The order of middleware loading

The execution order of middleware is the same as the order that they are loaded into Express with the `app.use` function.
For this reason, it is important to be careful when defining middleware.

The correct order is the following:

```js
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// ...

app.use(requestLogger)

// ...

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    // ...
}

// handler of requests with result to errors
app.use(errorHandler)

app.post('/api/tasks', (request, response) => {
    const body = request.body
    // ...
})
```

The json-parser middleware should be among the very first middleware loaded into Express.
If the order was the following: 🐞

```js
app.use(requestLogger) // request.body is undefined! 🐞

app.post('/api/tasks', (request, response) => {
  // request.body is undefined! 
  const body = request.body
  // ...
})

app.use(express.json()) // needs to be before! 🐞
```

Then the JSON data sent with the HTTP requests would not be available for the logger middleware or the POST route handler, since the `request.body` would be `undefined` at that point.

It's also important that the middleware for handling unsupported routes is next to the last middleware that is loaded into Express, just before the error handler.

For example, the following loading order would cause an issue: 🐞

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handling all requests that get to this line with 'unknown endpoint' 🐞
app.use(unknownEndpoint)

app.get('/api/tasks', (request, response) => {
  // ...
})
```

Now the handling of unknown endpoints is ordered *before the HTTP request handler*.
Since the unknown endpoint handler responds to all requests with **404 unknown endpoint**,
no routes or middleware will be called after the response has been sent by unknown endpoint middleware.
The only exception to this is the error handler which needs to come at the very end, after the unknown endpoints handler.

### Other operations

Let's add some missing functionality to our application, including deleting and updating an individual task.

The easiest way to delete a task from the database is with the [`findByIdAndDelete` method](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()):

```js
app.delete('/api/tasks/:id', (request, response, next) => {
  Task.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

In both of the "successful" cases of deleting a resource, the backend responds with the status code **204 no content**.
The two different cases are deleting a task that exists, and deleting a task that does not exist in the database.
The `result` callback parameter could be used for checking if a resource was deleted,
and we could use that information for returning different status codes for the two cases if we deem it necessary.
Any exception that occurs is passed onto the error handler.

Let's implement the functionality to update a single task, allowing the importance of the task to be changed.
The task updating is done as follows:

```js
app.put('/api/tasks/:id', (request, response, next) => {
  const { content, important } = request.body

  Task.findById(request.params.id)
    .then(task => {
      if (!task) {
        return response.status(404).end()
      }

      task.content = content
      task.important = important

      return task.save().then((updatedTask) => {
        response.json(updatedTask)
      })
    })
    .catch(error => next(error))
})
```

The task to be updated is first fetched from the database using the `findById` method.
If no object is found in the database with the given *`id`*, the value of the variable `task` is `null`, and the query responds with the status code **`404`** (*Not Found*).

If an object with the given id is found, its `content` and `important` fields are updated with the data provided in the request,
and the modified task is saved to the database using the `save()` method.
The HTTP request responds by sending the updated task in the response.

One notable point is that the code now has nested promises, meaning that within the outer `.then` method,
another [**promise chain**](https://javascript.info/promise-chaining) is defined:

```js
    .then(task => {
      if (!task) {
        return response.status(404).end()
      }

      task.content = content
      task.important = important

      // highlight-start
      return task.save().then((updatedTask) => {
        response.json(updatedTask)
      })
      // highlight-end
```

Usually, this is not recommended because it can make the code difficult to read.
In this case, however, the solution works because it ensures that the `.then` block following the `save()` method is only executed
if a task with the given id is found in the database and the `save()` method is called.
In the fourth part of the course, we will explore the `async`/`await` syntax, which offers an easier and clearer way to handle such situations.

Mongoose also provides the method [`findByIdAndUpdate`](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()),
which can be used to find a document by its `id` and update it with a single method call.
However, this approach does not fully suit our needs, because later in this part we define certain requirements for the data stored in the database,
and `findByIdAndUpdate` does not fully support Mongoose's validations.
Mongoose's [documentation](https://mongoosejs.com/docs/documents.html#updating-using-queries)
also mentions that the `save()` method is generally the correct choice for updating a document, as it provides full validation.

After testing the backend directly with Postman and the WebStorm REST client, we can verify that it seems to work.
The frontend also appears to work with the backend using the database.

You can find the code for our current application in its entirety in the [*part3-5* branch of our backend repo](https://github.com/comp227/part3-tasks-backend/tree/part3-5).

### Web developers pledge v3

We will update
[our web developer pledge](/part2/altering_data_in_server#web-developers-pledge-v2)
by adding an item:

> I also pledge to:
>
> - *Check that the database is storing the correct values*

</div>

<div class="tasks">

### Exercises 3.15-3.18

#### 3.15: Communities database, Step 3

Change the backend so that deleting communities are reflected in the database.

Verify that the frontend still works after making the changes.

#### 3.16: Communities database, Step 4

Move the error handling of the application to a new error handler middleware.

#### 3.17*: Communities database, Step 5

If the user tries to create a new community for one whose name is already in the communities application,
the frontend will try to update the community's invite location by making an *`HTTP PUT`* request to the entry's unique backend URL.

Modify the backend to support this request.

Verify that the frontend works after making your changes.

#### 3.18*: Communities database Step 6

Also, update the handling of the ***api/groups/:id*** and ***info*** routes to use the database,
and verify that they work directly with the browser, Postman, or WebStorm REST client.

Inspecting an individual community from the browser should look like this:

![screenshot of browser showing one group with api/groups/their_id](../../images/3/49.png)

</div>
