---
mainImage: ../../../images/part-8.svg
part: 8
letter: b
lang: en
---

<div class="content">

After the brief introduction to the main principles of TypeScript, we are now ready to start our journey toward becoming FullStack TypeScript developers.
Rather than giving you a thorough introduction to all aspects of TypeScript,
we will focus in this part on the most common issues that arise when developing Express backends or React frontends with TypeScript.
In addition to language features, we will also have a strong emphasis on tooling.

### Setting things up

Luckily there is not much setup here as WebStorm works natively with TypeScript.
Just go ahead and download this new empty repo by visiting this site:
<http://go.djosv.com/227labtsintro>

As mentioned earlier, ***TypeScript code is not executable by itself***.
It has to be first compiled into executable JavaScript.
When TypeScript is compiled into JavaScript, the code becomes subject to **type erasure**.
This means that type annotations, interfaces, type aliases, and other type system constructs are removed and the result is pure ready-to-run JavaScript.

In a production environment, the need for compilation often means that you have to set up a **build step**.
During the build step, all TypeScript code is compiled into JavaScript in a separate folder, and the *production environment then runs the code from that folder*.
In a development environment, it is often easier to make use of real-time compilation and auto-reloading so one can see the resulting changes more quickly.

Let's start writing our first TypeScript app.
To keep things simple, let's consider using the npm package [***ts-node***](https://github.com/TypeStrong/ts-node).
It compiles and executes the specified TypeScript file immediately so that there is no need for a separate compilation step.

You *could* install both *`ts-node`* and the official *`typescript`* package globally by running:

```bash
npm i -g ts-node typescript
```

However, if you can't or don't want to install global packages, you can create an npm project that has the required dependencies and run your scripts in it.
Let's take this approach.

As we recall from [part 3](/part3),
an npm project is set by running the command `npm init` in an empty directory.
You can do this now from inside your repository.
Afterward, we can install the dependencies by running:

```bash
npm i -D ts-node typescript
```

and setting up *scripts* within the package.json:

```json
{
  // ..
  "scripts": {
    "ts-node": "ts-node" // highlight-line
  },
  // ..
}
```

You can now use *`ts-node`* within this directory by running `npm run ts-node`.
Notice that if you are using *`ts-node`* through *package.json*,
command-line arguments that include short or long-form options for the `npm run script` need to be prefixed with `--`.
So if you want to run file.ts with *`ts-node`* and options `-s` and `--someoption`, the whole command is:

```shell
npm run ts-node file.ts -- -s --someoption
```

It is worth mentioning that TypeScript also provides an [online playground](https://www.typescriptlang.org/play/index.html),
where you can quickly try out TypeScript code and instantly see the resulting JavaScript and possible compilation errors.

> **Pertinent:** The playground might contain different tsconfig rules (which will be introduced later) than your local environment,
which is why you might see different warnings there compared to your local environment.
The playground's tsconfig is modifiable through the ***TS Config*** dropdown menu.

#### Configuration and coding style

Let's add a configuration file *tsconfig.json* to the project.
In WebStorm you can generate one via ***File->New->tsconfig.json file***.
Then, add the noImplicitAny field to the `compilerOptions` object

```js
{
  "compilerOptions":{
    // ...
    "sourceMap": true,
    "noImplicitAny": false // highlight-line
  }
}
```

The *tsconfig.json* file is used to define:

- how the TypeScript compiler should interpret the code
- how strictly the compiler should work
- which files to watch or ignore,
- and [much more](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

For now, we will add the compiler option [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny),
which will not require that we specify types for all variables.

JavaScript can be written in a multitude of ways; it's an accommodating language.
For example, we have named vs anonymous functions, using `const` and `let` or var, and the use of *semicolons*.
We will continue to use semicolons here.
It is not a TypeScript-specific pattern but a general coding style decision taken when creating any kind of JavaScript project.
Whether to use them or not is usually in the hands of the programmer,
but here you'll be expected to use semicolons and adjust to the coding style in the exercises for this part.
This section may have some other differences in coding conventions compared to the rest of the course as well,
e.g. in the directory naming conventions.

To make our lives easier, let's have WebStorm help us with the semicolons.
Open up your settings (***Ctrl-Alt-S***), and navigate to ***Editor->Code Style->Typescript***.
From there, select the *Punctuation* tab and ensure that our use semicolon is set to always:

![WebStorm settings for always semicolons in typescript](../../images/teht/custom/semicolon.png)

Then from there type save in the search box, which should leave you down to ***Tools->Actions on Save***.
Make sure that the Reformat code option is checked.
It's up to you whether you want to have the other actions saved.
For me, I just have Run eslint --fix enabled from before.
Once those options have been enabled, click OK.
This now means that when we do an explicit save (like a ***Ctrl-S***), then semicolons will automatically be applied, so we let the IDE handle our new coding conventions.

#### Your first TypeScript program

Let's start by creating a simple Multiplier.
Start by making a new typescript file.
With your project folder highlighted, select ***File->New->TypeScript File***.
Name the file *multiplier* and then add the following code.

```js
const multiplicator = (a, b, printText) => {
  console.log(printText,  a * b);
}

multiplicator(2, 4, "Multiplied numbers 2 and 4, the result is:");
```

It looks exactly as it would in JavaScript.
As you can see, this is still ordinary basic JavaScript with no additional TS features.
It compiles and runs nicely with `npm run ts-node -- multiplier.ts`, as it would with Node.
  
But what happens if we end up passing the wrong ***types*** of arguments to the multiplicator function?

Let's replace the multiplicator call with this line.

```js
multiplicator("how about a string?", 4, "Multiplied a string and 4, the result is:");
```

Now when we run the code, the output is: `Multiplied a string and 4, the result is: NaN`.

Wouldn't it be nice if the language itself could prevent us from ending up in situations like this?
This is where we see the first benefits of TypeScript.
Let's add types to the parameters and see where it takes us.

TypeScript natively supports multiple types including `number`, `string` and `Array`.
See the [comprehensive list here](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).
More complex custom types can also be created.

The first two parameters of our function are the `number` and the `string`
[primitives](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean),
respectively.
Let's add the types to the parameters.

```js
const multiplicator = (a: number, b: number, printText: string) => { // highlight-line
  console.log(printText,  a * b);
}

multiplicator("how about a string?", 4, "Multiplied a string and 4, the result is:");
```

Now the code is no longer valid JavaScript but it is TypeScript.
When we try to run the code, we notice that it does not compile:

![terminal output showing error assigning string to number](../../images/8/2a.png)

One of the best things about TypeScript's editor support is that you don't necessarily need to even run the code to see the issues.
WebStorm informs you immediately when you are trying to use an incorrect type:

![vscode showing same error about string as number](../../images/8/2.png)

### Creating your first custom type

Let's modify our *multiplicator* into a slightly more versatile ***calculator*** that also supports addition and division.
To help drive this point home, I'm going to create a new file called *calculator.ts*.
The calculator should accept two numbers and one operation as arguments.
The operation:

- tells the calculator what to do with the two numbers;
- is one of these values:
    - `multiply`
    - `add`
    - `divide`

In JavaScript, the code would require additional validation to make sure the last argument is indeed a `string`.
TypeScript offers a way to define specific types for inputs.
Those definitions detail what type of input is acceptable.
Furthermore, TypeScript can show the info on the accepted values already at the editor level.

We can create a **type** using the TypeScript native keyword `type`.
Let's describe the `Operation` type:

```js
type Operation = "multiply" | "add" | "divide";
```

Now the `Operation` type accepts only those three strings we wanted.
Using the OR operator `|` we can define a variable to accept multiple values by creating a
[union type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types).
In this case, we used exact strings, AKA
[**string literal types**](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).
However, with unions, you could also make the compiler accept multiple general types.
For example, we could accept a string or a number by writing: `string | number`.

The `type` keyword defines a new name for a type:
[**a type alias**](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases).
Since the defined type is a union of three possible values, it is handy to name it appropriately.

Let's place this code into our *calculator.ts* file now:

```js
type Operation = "multiply" | "add" | "divide";

const calculator = (a: number, b: number, op: Operation) => {
  if (op === "multiply") {
    return a * b;
  } else if (op === "add") {
    return a + b;
  } else if (op === "divide") {
    if (b === 0) return "cannot divide by 0!";
    return a / b;
  }
}
```

Now, when we hover on top of the `Operation` type in the calculator function, we can immediately see suggestions on what to do with it:

![vs code suggestion operation 3 types](../../images/8/3.png)

And if we try to use a value that is not within the `Operation` type, we get the familiar red warning signal and extra info from our editor:

![vscode warning when trying to have "yolo" as Operation](../../images/8/4x.png)

This is already pretty nice, but one thing we haven't touched yet is typing the return value of a function.
Usually, you want to know what a function returns, and it would be nice to have a guarantee that it returns what it says it does.
Let's add a return value `number` to the calculator function:

```js
type Operation = "multiply" | "add" | "divide";

const calculator = (a: number, b: number, op: Operation): number => { // highlight-line

  if (op === "multiply") {
    return a * b;
  } else if (op === "add") {
    return a + b;
  } else if (op === "divide") {
    if (b === 0) return "this cannot be done";
    return a / b;
  }
}
```

The compiler complains straight away because, in one case, the function returns a string.
There are a couple of ways to fix this.
We could extend the return type to allow string values, like so:

```js
const calculator = (a: number, b: number, op: Operation): number | string =>  { 
  // ...
}
```

Or we could create a return type, which includes both possible types, much like our Operation type:

```js
type Result = string | number;

const calculator = (a: number, b: number, op: Operation): Result =>  {
  // ...
}
```

But now the question becomes... *is it **really** okay for the function to return a `string`*?

When your code can end up in a situation it tries to divide by 0,
something has probably gone wrong and an error should be thrown and handled where the function was called.
When you are deciding to return values you weren't originally expecting,
the warnings you see from TypeScript prevent you from making rushed decisions and help you to keep your code working as expected.

Remember that even though we have defined types for our parameters,
the generated JavaScript used at runtime does not contain the type checks.
So if, for example, the `Operation` parameter's value comes from an external interface,
***there is no definite guarantee that it will be one of the allowed values***.
Therefore, we should include error handling and be prepared for the unexpected to happen.
When our programs will accept many values but raise errors for anything else,
we should use the [`switch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)
statement over an `if`-`else`.

The code of our calculator should look something like this:

```js
type Operation = "multiply" | "add" | "divide";

const calculator = (a: number, b: number, op: Operation) : number => {  // highlight-line
  switch(op) {
    case "multiply":
      return a * b;
    case "divide":
      if (b === 0) throw new Error("Cannot divide by 0!");  // highlight-line
      return a / b;
    case "add":
      return a + b;
    default:
      throw new Error("Operation is not multiply, add, or divide!");  // highlight-line
  }
}

try {
  console.log(calculator(1, 5 , "divide"));
} catch (error: unknown) {
  let errorMessage = "Something went wrong: ";
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
```

### Type narrowing

The default type of the `catch` block parameter `error` is *`unknown`*.
Typescript version 3 introduced [`unknown`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)
to be the type-safe counterpart of `any`.
We can assign any variable with `unknown`.
However, we cannot assign an `unknown` variable to just any variable.
Variables with the `unknown` type are only assignable to other variables of type `unknown` and `any`;
unless there is a type assertion or a control flow-based type narrowing.
Likewise, no operations are permitted on an `unknown` without first asserting or narrowing it to a more specific type.

Both the possible causes of exception (wrong operator or division by zero)
will throw an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object with an error message,
that our program prints to the user.

If our code would be JavaScript, we could print the error message by just referring to the field
[`message`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message) of the object `error` as follows:

```js
try {
  console.log(calculator(1, 5 , "divide"));
} catch (error) {
  console.log('Something went wrong: ', error.message);  // highlight-line
}
```

Since the default type of the `error` object in TypeScript is `unknown`,
we have to [narrow](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) the type to access the field:

```ts
try {
  console.log(calculator(1, 5 , "divide"));
} catch (error: unknown) {
  let errorMessage = "Something went wrong: "
  // here we can not use error.message
  if (error instanceof Error) { // highlight-line 
    // the type is narrowed and we can refer to error.message
    errorMessage += error.message;  // highlight-line 
  }
  // here we can not use error.message

  console.log(errorMessage);
}
```

Here the narrowing was done with an [`instanceof` narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing),
which is just one of the many ways to narrow a type.
We shall see many others later in this part.

### Accessing command line arguments

We can improve our current program by using command-line arguments instead of always having to change the code to calculate stuff.

Let's try it out, as we would in a regular Node application, by accessing `process.argv`.
Since we are using a recent npm-version (7.0 or later),
there are no problems but with an older setup errors will be raised.

So what is the problem with older setups?

### @types/{npm_package}

Let's return to the basic idea of TypeScript.
TypeScript expects all globally-used code to be typed, as it does for your code when your project has a reasonable configuration.
The TypeScript library itself contains only typings for the code of the TypeScript package.
It is possible to write a custom typing for a library, but that is rarely needed - since the TypeScript community has done it for us!

As with npm, the TypeScript world also celebrates open-source code.
The community is active and continuously reacting to updates and changes in commonly used npm packages.
You can almost always find the typings for npm packages, so you don't have to create types for all of your thousands of dependencies alone.

Usually, types for existing packages can be found from the *`@types`* organization within npm,
and you can add the relevant types to your project by installing an npm package with
the name of your package with a *`@types/`* prefix.
For example:

```bash
npm i -D @types/react @types/express @types/lodash @types/jest @types/mongoose
```

and so on and so on.
The `@types/*` are maintained by [*Definitely typed*](https://github.com/DefinitelyTyped/DefinitelyTyped),
a community project to maintain types of everything in one place.

Sometimes, an npm package can also include its types within the code and,
in that case, installing the corresponding `@types/*` is not necessary.

> **Pertinent:** Since the typings are only used before compilation,
> the typings are *not* needed in the production build and they should **always** be in the *`devDependencies`* of the *package.json*.

Since the global variable `process` is defined by Node itself, we get its typings from the package *`@types/node`*.

Since version 10.0 *`ts-node`* has defined *`@types/node`* as a
[peer dependency](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies).
If the version of npm is at least 7.0, the peer dependencies of a project are automatically installed by npm.
If you have an older npm, the peer dependency must be installed explicitly:

```shell
npm i -D @types/node
```

When the package *`@types/node`* is installed, the compiler does not complain about the variable `process`.
Notice that there is **no need to `require` the types as a header in the code**, the installation of the package is enough!

### Improving the project

Next, let's add an npm script to run our ***calculator*** program:

```json
{
  "name": "fs-open",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "ts-node": "ts-node",
    "multiply": "ts-node multiplier.ts", // highlight-line
    "calculate": "ts-node calculator.ts" // highlight-line
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "ts-node": "^10.5.0",
    "typescript": "^4.5.5"
  }
}
```

We can get the multiplier to work with command-line parameters with the following changes:

```js
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText, a * b);
}

const a: number = Number(process.argv[2]);
const b: number = Number(process.argv[3]);
multiplicator(a, b, `Multiplied ${a} and ${b}, the result is:`);
```

And we can run it with:

```shell
npm run multiply 5 2
```

If the program is run with parameters that are not of the right type, e.g.

```shell
npm run multiply 5 lol
```

it *works* but gives us a potentially unexpected answer:

```shell
Multiplied 5 and NaN, the result is: NaN
```

The result is `NaN` because `Number("lol")` returns `NaN`,
***which is of type `number`***, so TypeScript has no power to rescue us from this kind of situation.

To prevent this kind of behavior, we have to ***validate the data given to us from the command line***.

The improved version of the multiplicator looks like this:

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error("Provided values were not numbers!");
  }
}

const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

try {
  const { value1, value2 } = parseArguments(process.argv);
  multiplicator(value1, value2, `Multiplied ${value1} and ${value2}, the result is:`);
} catch (error: unknown) {
  let errorMessage = "Something bad happened."
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
```

When we now run the program:

```shell
npm run multiply 1 lol
```

we get an error message:

```shell
Something bad happened. Error: Provided values were not numbers!
```

Let's examine the above code closely.
The most important addition is the function `parseArguments`.
The function ensures that the parameters given to `multiplicator` are of the right type.
If not, an exception is thrown with a descriptive error message.

Let's review the `parseArguments` function definition:

```js
const parseArguments = (args: string[]): MultiplyValues => {
  // ...
}
```

Notice the parameter `args` is an [array](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) of strings.

The return value of the function has the type `MultiplyValues`, which is defined as follows:

```js
interface MultiplyValues {
  value1: number;
  value2: number;
}
```

The definition utilizes TypeScript's [**Interface**](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces) keyword,
which is one way to define the *shape* an object should have.
In our case, it is quite obvious that the return value should be an object with the two properties `value1` and `value2`, both being of type `number`.

### The alternative array syntax

Notice that there is also an alternative syntax for [arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) in TypeScript.
Instead of writing

```js
let values: number[]; 
```

we could use the ***generics syntax*** and write

```js
let values: Array<number>; 
```

In this course, we shall mostly be following the convention enforced by the ESlint rule
[array-simple](https://typescript-eslint.io/rules/array-type/#array-simple)
that suggests to use `[]` syntax for simple arrays and `<>` syntax for the more complex ones.
See [the ESlint array-simple rule documentation](https://typescript-eslint.io/rules/array-type/#array-simple) for examples.

</div>

<div class="tasks">

### Exercises 8.1-8.3

#### setup

Exercises 8.1-8.7. will all be made in the same project folder.

Please start by visiting <http://go.djosv.com/227lab8> and importing the project into WebStorm.

Then, create the project in an empty directory with `npm init` and install the *ts-node* and *typescript* packages.
Also, create the file *tsconfig.json* in the directory with the following content:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "sourceMap": true,
    "noImplicitAny": false // highlight-line
  },
  "exclude": [
    "node_modules"
  ]
}
```

The compiler option [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) makes it mandatory to have types for all variables used.
This option is currently a default, but it lets us define it explicitly.

#### 8.1 Body mass index

Create the code of this exercise in the file *bmiCalculator.ts*.

Write a function `calculateBMI` that calculates a [BMI](https://en.wikipedia.org/wiki/Body_mass_index)
based on a given height (in centimeters) and weight (in kilograms) and then returns a message that suits the results.

Call the function in the same file with hard-coded parameters and print out the result.
The code

```js
console.log(calculateBMI(180, 74))
```

should print the following message:

```shell
Normal range
```

Create an npm script for running the program with the command `npm run calculateBMI`.

#### 8.2 Exercise calculator

Create the code of this exercise in file *exerciseCalculator.ts*.

Write a function `calculateExercises` that calculates the average time of ***daily exercise hours***,
compares it to the ***target amount*** of daily hours and returns an object that includes the following values:

- the number of days
- the number of training days
- the original target value
- the calculated average time
- boolean value describing if the target was reached
- a rating between the numbers 1-3 that tells how well the hours are met.
  You can decide on the metric on your own.
- a text value explaining the rating, you can come up with the explanations

The daily exercise hours are given to the function as an [array](https://www.typescriptlang.org/docs/handbook/basic-types.html#array)
that contains the number of exercise hours for each day in the training period.
E.g. a week with 3 hours of training on Monday, none on Tuesday, 2 hours on Wednesday, 4.5 hours on Thursday and so on
would be represented by the following array:

```js
[3, 0, 2, 4.5, 0, 3, 1]
```

For the Result object, you should create an [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html).

If you call the function with parameters `[3, 0, 2, 4.5, 0, 3, 1]` and `2`, it should return:

```js
{ 
  periodLength: 7,
  trainingDays: 5,
  success: false,
  rating: 2,
  ratingDescription: "not too bad but could be better",
  target: 2,
  average: 1.9285714285714286
}
```

Create an npm script, `npm run calculateExercises`, to call the function with hard-coded values.

#### 8.3 Command line

Change the previous exercises so that you can give the parameters of `bmiCalculator` and `exerciseCalculator` as command-line arguments.

Your program could work eg. as follows:

```shell
$ npm run calculateBmi 180 91

Overweight
```

and:

```shell
$ npm run calculateExercises 2 1 0 2 4.5 0 3 1 0 4

{
  periodLength: 9,
  trainingDays: 6,
  success: false,
  rating: 2,
  ratingDescription: "not too bad but could be better",
  target: 2,
  average: 1.7222222222222223
}
```

In the example, the *first argument* is the target value.

Handle exceptions and errors appropriately.
The *exerciseCalculator* should accept inputs of varied lengths.
Determine by yourself how you manage to collect all needed input.

A couple of things to notice:

If you define helper functions in other modules, you should use the
[JavaScript module system](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules),
that is, the one we have used with React where importing is done with

```js
import { isNotNumber } from "./utils";
```

and exporting

```js
export const isNotNumber = (argument: any): boolean =>
  isNaN(Number(argument));

default export "this is the default..."
```

> Pertinent: somehow surprisingly TypeScript does not allow to define the same variable in many files at a "block scope", that is, outside functions (or classes):
>
> ![browser showing pong from localhost:3000/ping](../../images/8/60new.png)
>
> This is not *quite* true.
> This ***rule applies only to files that are treated as scripts***.
> A file is a **script** if it does not contain any `export` or `import` statements.
> If a file has those, then the file is treated as a [**module**](https://www.typescriptlang.org/docs/handbook/modules.html),
> ***and*** the variables do not get defined in the block scope.

</div>

<div class="content">

### More about tsconfig

We have so far used only one tsconfig rule [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny).
It's a good place to start, but now it's time to look into the config file a little deeper.

As mentioned, the [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file
contains all your core configurations on how you want TypeScript to work in your project.

Let's specify the following configuration in our *tsconfig.json* file:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true, // highlight-line
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true, // highlight-line
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

Do not worry too much about the `compilerOptions`; they will be under closer inspection later on.

You can find explanations for each of the configurations from:

- the TypeScript documentation
- the really handy [tsconfig page](https://www.typescriptlang.org/tsconfig)
- the no-frills tsconfig [schema definition](http://json.schemastore.org/tsconfig)
    - it's no-frills because the page output is in JSON.

### Adding Express to the mix

Currently, our project is functional; it's set up and has two executable calculators in it.
However, since we aim to learn full-stack web development, let's begin working with HTTP Requests.

First, install Express:

```bash
npm i express
```

and add the ***start*** script to package.json:

```json
{
  // ..
  "scripts": {
    "ts-node": "ts-node",
    "multiply": "ts-node multiplier.ts",
    "calculate": "ts-node calculator.ts",
    "start": "ts-node index.ts" // highlight-line
  },
  // ..
}
```

Now we can create the file *index.ts*, and write the HTTP GET `ping` endpoint to it:

```js
const express = require("express");
const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Everything else seems to be working just fine but, as you'd expect, ***the `req` and `res` parameters of `app.get` need typing***.
Also, if you hover over the `require` statement on line 1 in WebStorm, you'll notice that WebStorm provides us with a message converting the line to an import.

![vscode warning to change require to import](../../images/8/6.png)

The subtle suggestion is that the `'require' call may be converted to an import`.
This suggestion is a suggestion to use a more modern call for typescript, and as such, this error is currently not being highlighted as a warning.
To turn it into a warning, we can open up the settings by using the ***Show Context Actions*** keyboard shortcut (or by right-clicking) and selecting the edit inspection setting.

![WebStorm using context actions to turn on errors](../../images/8/custom/quickfixinspection.png)

Once there, you are taken to WebStorm's settings, where in your case, you may see that all of the ES2015 migration aids category is mostly unselected.
WebStorm provides an explanation for why we would want the change in the upper right area.
On noticing that most of the inspections are not being raised as warnings, let's change that.
Click the category ***ES2015 Migration aids*** and change the severity to a weak warning, as we show in the column below.

![WebStorm inspection settings](../../images/8/custom/typescript_warnings.png)

Once you do that, you'll now see that the require statement in underlined with a weak warning indicator.
Let's again use the quick actions keyboard shortcut (make sure to practice this!) to select the first option.

![WebStorm using the context actions](../../images/8/custom/quickfiximport.png)

Completing the action replaces the first line with this:

```js
import express from "express";
```

> **FYI:**: Make sure to utilize the context actions and quick fixes that WebStorm provides.
Keep your eyes open for these helpers/quick fixes; listening to your editor usually makes your code better and easier to read.
The automatic fixes for issues can be a major time saver as well.

Now we run into another problem that WebStorm is not explicitly letting on, the compiler is complaining about the import statement.
Once again, the editor is our best friend when trying to find out what the issue is:

![vscode error about not finding express](../../images/8/7.png)

We haven't installed types for *express*.
Let's do what the suggestion says.
You can type this line from the terminal.
> *If you decided to run it from WebStorm, it may save it as a regular dependency instead of a dev dependency.*

```bash
npm i -D @types/express
```

And almost no more errors! Let's take a look at what changed.

At first, when we were using the `require` statement, and then we hovered over over `res`,
you'll notice that WebStorm interprets everything express-related to be of type `any`.

![ide showing problem of implicitly having any type](../../images/8/8a.png)

However, as soon as we used `import`, the editor knows the actual types:

![ide showing req is of type Request](../../images/8/9x.png)

Which import statement to use depends on the export method used in the imported package.

A good rule of thumb is to try importing a module using the `import` statement first.
We will always use this method in the *frontend*.
If `import` does not work, try a combined method: `import ... = require("...")`.

We strongly suggest you read more about [TypeScript modules here](https://www.typescriptlang.org/docs/handbook/modules.html).

There is one more problem with the code:

![vscode showing req declared but never read](../../images/8/9b.png)

This is because we banned unused parameters in our *tsconfig.json*:

```js
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true, // highlight-line
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

This configuration might create problems if you have *library-wide predefined functions*
that require declaring a variable even if it's not used at all, as is the case here.
Fortunately, this issue has already been solved on the configuration level.
Once again hovering over the issue gives us a solution.
This time we can just click the quick fix button:

![vscode quickfix to add underscore to variable](../../images/8/14a.png)

If it is absolutely impossible to get rid of an unused variable,
you can ***prefix it with an underscore*** to inform the compiler you have thought about it and there is nothing you can do.

Let's rename the `req` variable to `_req`.
Finally, we are ready to start the application.
It seems to work fine:

![browser result showing pong on /ping](../../images/8/11a.png)

#### Speeding up development

To speed up development, we should enable **auto-restarting** our server to improve our workflow.
In this course, we have already used *nodemon*, but *ts-node* has an alternative called ***ts-node-dev***.
It is meant to be used only with a development environment that takes care of recompilation on every change, so restarting the application won't be necessary.

Let's install ***ts-node-dev*** to our development dependencies:

```bash
npm i -D ts-node-dev
```

Add a script to *package.json*:

```json
{
  // ...
  "scripts": {
      // ...
      "dev": "ts-node-dev index.ts", // highlight-line
  },
  // ...
}
```

And now, by running `npm run dev`, we have an auto-restarting development environment for our project!
If you now make a change, you'll notice that the server restarts, which means we can make a change wait a second and then refresh our browser, and we'll see the changes.

</div>

<div class="tasks">

### Exercises 8.4-8.5

#### 8.4 Express

Add Express to your dependencies and create an HTTP GET endpoint **`hello`** that answers `"Hello COMP 227!"`

The web app should be started with the commands `npm start` in production mode and `npm run dev` in development mode.
The latter should also use ***`ts-node-dev`*** to run the app.

Replace also your existing *tsconfig.json* file with the following content:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "strictBindCallApply": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "declaration": true,
  }
}
```

Make sure there aren't any errors!

#### 8.5 WebBMI

Add an endpoint for the BMI calculator that can be used by doing an HTTP GET request to the endpoint ***`bmi`***
and specifying the input with [query string parameters](https://en.wikipedia.org/wiki/Query_string).
For example, to get the BMI of a person with a height of 180 and a weight of 72, the URL is <http://localhost:3002/bmi?height=180&weight=72>.

The response is a JSON of the form:

```js
{
  weight: 72,
  height: 180,
  bmi: "Normal range"
}
```

See the [Express documentation](https://expressjs.com/en/5x/api.html#req.query) for info on how to access the query parameters.

If the query parameters of the request are of the wrong type or missing, a response with proper status code and an error message is given:

```js
{
  error: "malformatted parameters"
}
```

Do not copy the calculator code to file *index.ts*;
instead, make it a [TypeScript module](https://www.typescriptlang.org/docs/handbook/modules.html) that can be imported into *index.ts*.

For `calculateBmi` to work correctly from both the command line and the endpoint, consider adding a check `require.main === module` to the file *bmiCalculator.ts*.
It tests whether the module is **`main`**, i.e. it is run directly from the command line (in our case, *`npm run calculateBmi`*),
or it is used by other modules that import functions from it (e.g. *index.ts*).
Parsing command-line arguments makes sense only if the module is `main`.
Without this condition, you might see argument validation errors when starting the application via *`npm start`* or *`npm run dev`*.

See the [Node documentation](https://nodejs.org/api/modules.html#accessing-the-main-module) for more.

</div>

<div class="content">

### The horrors of `any`

Now that we have our first endpoints completed, you may notice *we have used barely any TypeScript in these small examples*.
When examining the code a bit closer, we can see a few dangers lurking there.

Let's add the HTTP POST endpoint ***`calculate`*** to our app:

```js
import { calculator } from "./calculator";

app.use(express.json());

// ...

app.post("/calculate", (req, res) => {
  const { value1, value2, op } = req.body;

  const result = calculator(value1, value2, op);
  res.send({ result });
});
```

To get this working, we must add an `export` to the function `calculator`:

```js
export const calculator = (a: number, b: number, op: Operation) : number => {
```

When you hover over the `calculate` function, you can see the typing of the `calculator` even though the code itself does not contain any typing:

![vscode showing calculator types when mouse over the function](../../images/8/12a21.png)

But if you hover over the parameters which were parsed from the request, an issue arises:

![vscode problematically showing any when hovering over values parsed in to calculate](../../images/8/13a21.png)

***All of the variables have the type `any`.***
It is not all that surprising, as no one has given them a type yet.
There are a couple of ways to fix this, but first, we have to consider why this is accepted and where the type `any` came from.

In TypeScript, *every untyped variable whose type cannot be inferred implicitly becomes type*
[`any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any).
Any is *wild card* type which stands for **whatever** type.
Variables implicitly become an `any` type when one *forgets to type **functions***.

We can also explicitly type things `any`.
The only difference between the implicit and explicit any type is *how the code looks*; the compiler does not care about the difference.

Programmers however see the code differently when `any` is explicitly enforced than when it is implicitly inferred.
**Implicit `any` typings are usually considered problematic**.
Coders quite often use `any` as a placeholder and later forget to assign types (or they were just too lazy to do it).
Using `any` also means that the full power of TypeScript is not properly exploited.

This is why the configuration rule [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny) exists on the compiler level,
and it is highly recommended to keep it on at all times.
In the rare occasions when you truly cannot know what the type of a variable is, you should explicitly state that in the code:

```js
const a : any = /* no clue what the type will be! */.
```

We already have `noImplicitAny: true` configured in our example, so why does the compiler not complain about the implicit `any` types?
The reason is that the `body` field of an Express [Request](https://expressjs.com/en/5x/api.html#req) object **is explicitly typed `any`**.
The same is true for the `request.query` field that Express uses for the query parameters.

*What if we would like to restrict developers from using the `any` type?*
Fortunately, we have methods other than *tsconfig.json* to enforce a coding style.
What we can do is use ***ESlint*** to manage
our code.
Let's install ESlint and its TypeScript extensions:

```shell
npm i -D eslint @eslint/js @types/eslint__js typescript typescript-eslint
```

We will configure ESlint to [disallow explicit any]( https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md).
Write the following rules to *.eslintrc.cjs*:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
});
```

Let us also set up a **lint** npm script to inspect the files with *.ts* extension by modifying the *package.json* file:

```json
{
  // ...
  "scripts": {
      "start": "ts-node index.ts",
      "dev": "ts-node-dev index.ts",
      "lint": "eslint ." // highlight-line
      //  ...
  },
  // ...
}
```

Finally, we'll need to enable the eslint configuration in our settings (***Ctrl-Alt-S***).
Remember that the configuration to turn on in ***Languages & Frameworks->JavaScript->Code Quality Tools->ESLint***.
Select the option **Automatic ESLint configuration** and check ***Run eslint --fix on save***.
Now lint will complain if we try to define a variable of type `any`:

![vscode showing ESlint complaining about using the any type](../../images/8/13b.png)

[@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) has a lot of TypeScript-specific ESlint rules,
but you can also use all basic ESlint rules in TypeScript projects.
For now, we should probably go with the recommended settings,
and we will modify the rules as we go along whenever we find something we want to change the behavior of.

On top of the recommended settings, we should try to get familiar with the coding style required in this part and ***set the semicolon at the end of each line of code to `required`***.
For that, we should install and configure [@stylistic/eslint-plugin](https://eslint.style/packages/default):

```bash
npm i -D @stylistic/eslint-plugin
```

Our final *eslint.config.mjs* looks as follows:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    "@stylistic": stylistic,
  },
  rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { 'argsIgnorePattern': '^_' }
    ],
  },
});
```

You may have a few semicolons missing, but those are easy to add, and WebStorm should be able to add them when a file is saved.
We also have to solve the ESlint issues concerning the `any` type:

![vscode error unsafe assignment of any value](../../images/8/50x.png)

We should disable some ESlint rules to get the data from the request body.

Disabling *`@typescript-eslint/no-unsafe-assignment`* for the destructuring assignment
and calling the [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number) constructor to values is nearly enough:

```js
app.post("/calculate", (req, res) => {
  // highlight-start
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment 
  // highlight-end
  const { value1, value2, op } = req.body;

  const result = calculator(Number(value1), Number(value2), op); // highlight-line
  res.send({ result });
});
```

However this still leaves one problem to deal with, the last parameter in the function call (`op`) is not safe:

![vscode showing unsafe argument of any type assigned to the parameter of type Operation](../../images/8/51x.png)

One option is to just disable the ESlint rule to make the error disappear:
> *again you should be able to move your cursor to `op` and use the keyboard shortcut for context actions to disable the rule*

```js
app.post("/calculate", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // highlight-start
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  // highlight-end
  const result = calculator(Number(value1), Number(value2), op);
  res.send({ result });
});
```

We no longer have any ESLint errors but we don't have any validation.
Even though we are using TypeScript, we should not rely on the user to give us proper values.
We need to validate the post data and provide a proper error message when the data is invalid:

```js
app.post("/calculate", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // highlight-start
  if ( !value1 || isNaN(Number(value1)) ) {
    return res.status(400).send({ error: "..."});
  }
  // highlight-end

  // more validations here...

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(Number(value1), Number(value2), op);
  return res.send({ result }); //highlight-line
});
```

Notice that we also added the `return` syntax in the function for information we send.
We will revisit shortly some techniques for how the `any` typed data (eg. the input an app receives from the user) can be ***narrowed*** to a more specific type (such as `number`).
*When we properly narrow types, we won't need to silence the ESlint rules*.

### Type assertion

Using a [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
is a simple but [*unsafe way*](https://ts.dev/style/#type-and-non-nullability-assertions) to keep the TypeScript compiler and Eslint quiet.
Let us export the type Operation in *calculator.ts*:

```js
export type Operation = "multiply" | "add" | "divide";
```

Now we can import `Operation` and use a *type assertion* (***`as`***) to tell the TypeScript compiler what type `op` has:

```js
import { calculator, Operation } from "./calculator"; // highlight-line

app.post("/calculate", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // validate the data here

  // assert the type
  const operation = op as Operation;  // highlight-line 

  const result = calculator(Number(value1), Number(value2), operation); // highlight-line

  return res.send({ result });
});
```

The defined constant `operation` has now the type `Operation` and the compiler is perfectly happy.
Notice we removed the Eslint rule comment before the call to `calculator()`.
Furthermore, the type assertion can be done when an argument is passed to the function, removing the need for the `operation` variable:

```js
app.post("/calculate", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  // validate the data here

  const result = calculator(
    Number(value1), Number(value2), op as Operation // highlight-line
  ); 

  return res.send({ result });
});
```

Using a type assertion (or quieting an Eslint rule) is risky.
It leaves the TypeScript compiler off the hook, the compiler just trusts that we as developers know what we are doing.
If the asserted type ***does not*** have the right kind of value, the result will be a runtime error,
so one must be pretty careful when validating the data if a type assertion is used.

In the next chapter, we shall have a look at [type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html),
which will provide a safer way of specifying types for external data.

</div>

<div class="tasks">

### Exercises 8.6-8.7

#### 8.6 Eslint

Configure your project to use the above ESlint settings and fix all the warnings.

#### 8.7 WebExercises

Add an endpoint to your app for the exercise calculator.
It should be used by doing an HTTP POST request to the endpoint ***<http://localhost:3003/exercises>*** with the input in the request body:

```js
{
  "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
  "target": 2.5
}
```

The response is a JSON of the following form:

```js
{
    "periodLength": 7,
    "trainingDays": 4,
    "success": false,
    "rating": 1,
    "ratingDescription": "bad",
    "target": 2.5,
    "average": 1.2142857142857142
}
```

If the body of the request is not in the right form, a response with the proper status code and an error message are given.
The error message is either

```js
{
  error: "parameters missing"
}
```

or

```js
{
  error: "malformatted parameters"
}
```

depending on the error.
The latter happens if the input values do not have the right type, i.e. they are not numbers or convertible to numbers.

In this exercise, you might find it beneficial to use the **`explicit any`** type when handling the data in the request body.
Our ESlint configuration is preventing this but you may unset this rule for a particular line by inserting the following comment as the previous line:

```js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

You might also get in trouble with rules ***`no-unsafe-member-access`*** and ***`no-unsafe-assignment`***.
These rules may be ignored in this exercise.

Notice that you need to have a correct setup to get the request body; see [part 3](/part3/node_js_and_express#receiving-data).

</div>
