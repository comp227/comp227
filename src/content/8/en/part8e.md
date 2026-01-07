---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: en
---

<div class="content">

### Working with an existing codebase

When you dive into an existing codebase for the first time, you should seek an overview of its conventions and structures.
You can start this research by reading the *README.md* in the root of the repository.
Usually, the README contains a brief description of the application and the requirements for using it, as well as how to start it for development.
If the README is not available or poorly written, you can take a peek at the *package.json*.
You also should start the application and click around to verify you have a functional development environment.

You can also browse the folder structure to get some insight into the application's functionality and/or the architecture used.
These are not always clear, and the developers might have chosen a way to organize code that is not familiar to you.
The patientia frontend you cloned [previously](/part8/typing_an_express_app#exercises-8-8-8-9) will be used in the rest of this part and is organized, feature-wise.
You can see what pages the application has, and some general components, e.g. modals and state.
Keep in mind that the features may have different scopes.
For example, ***modals*** are visible UI-level components
whereas the ***state*** is comparable to business logic and keeps the data organized under the hood for the rest of the app to use.

TypeScript provides types for what kind of data structures, functions, components, and state to expect.
You can try looking for *types.ts* or something similar to get started.
IDEs can be a big help and simply highlighting variables and parameters can provide quite a lot of insight.
All this naturally depends on how types are used in the project.

If the project has unit, integration or end-to-end tests, reading those is most likely beneficial.
*Test cases are your most important tool when refactoring or adding new features to the application.*
You want to make sure not to break any existing features when hammering around the code.
TypeScript can also give you guidance with argument and return types when changing the code.

Remember that reading code is a skill in itself, so don't worry if you don't understand the code on your first readthrough.
The code may have a lot of corner cases, and pieces of logic may have been added here and there throughout its development cycle.
It is hard to imagine what kind of problems the previous developer has wrestled with.
Think of it all like [growth rings in trees](https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings).
Understanding everything requires digging deep into the code and business domain requirements.
The more code you read, the better you will be at understanding it.
You will most likely read far more code than you are going to produce throughout your life.

### Patientia frontend

It's time to get our hands dirty finalizing the frontend for the backend we built in [exercises 8.8.-8.13](/part8/typing_an_express_app#exercises-8-8-8-9).
We will also add some new features to the backend for finishing the app.

Before diving into the code, let's start both the frontend and the backend.

If all goes well, you should see a patient listing page.
It fetches a list of patients from our backend, and renders it to the screen as a simple table.
There is also a button for creating new patients on the backend.
As we are using mock data instead of a database, the data will not persist - closing the backend will delete all the data we have added.
UI design has not been a strong point of the creators, so let's disregard the UI for now.

After verifying that everything works, we can start studying the code.
All of the interesting stuff resides in the *src* folder.
For your convenience, there is already a *types.ts* file for basic types used in the app, which you will have to extend or refactor in the exercises.

In principle, we could use the same types for both the backend and the frontend,
but usually, *the frontend has different data structures and use cases for the data*, which causes the types to be different.
For example, the frontend has a state and may want to keep data in objects or maps whereas the backend uses an array.
The frontend might also not need all the fields of a data object saved in the backend, and it may need to add some new fields to use for rendering.

The folder structure looks as follows:

![vscode folder structure for patientia](../../images/8/34new.png)

Besides the component `App`, there are currently three main components:
`AddPatientModal` and `PatientListPage` which are both defined in a directory, and a component `HealthRatingBar` defined in a file.
If a component has some subcomponents not used elsewhere in the app, some suggest defining that component and its subcomponents in a directory.
For example, the *src/AddPatientModal* folder currently houses two components:

- `AddPatientModal` defined in *index.tsx*
- `AddPatientForm` a subcomponent of `AddPatientModal` defined in *AddPatientForm.tsx*.

There is nothing too surprising in the code.
The state and communication with the backend are implemented with the `useState` hook and Axios, similar to the tasks app in the previous section.
[Material UI](/part7/more_about_styles#material-ui) is used to style the app and the navigation structure is implemented with
[React Router](/part7/react_router),
both familiar to us from part 7 of the course.

From the typing point of view, there are a couple of interesting things.
Component `App` passes the function `setPatients` as a prop to the component `PatientListPage`:

```js
const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]); // highlight-line

  // ...
  
  return (
    <div className="App">
      <Router>
        <Container>
          <Routes>
            // ...
            <Route path="/" element={
              <PatientListPage
                patients={patients}
                setPatients={setPatients} // highlight-line
              />} 
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};
```

To keep the TypeScript compiler happy, the props are typed as follows in *src/PatientListPage/index.tsx*:

```js
interface Props {
  patients : Patient[]
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}

const PatientListPage = ({ patients, setPatients } : Props ) => { 
  // ...
}
```

So the function `setPatients` has type *React.Dispatch<React.SetStateAction<Patient[]>>*.
We can see the type in the editor when we hover over the function:

![vscode showing Patient array as type for setPatients](../../images/8/73new.png)

> The [React TypeScript cheatsheet's code blocks for `AppProps`](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example#basic-prop-types-examples)
have some nice lists for typical prop types.
Use that cheatsheet later to help find the correct types for props that are not obvious.

`PatientListPage` passes four props to the component `AddPatientModal`
Two of these props are functions.
Here's the relevant code.

```js
const PatientListPage = ({ patients, setPatients } : Props ) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // ...

  const closeModal = (): void => { // highlight-line
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => { // highlight-line
    // ...
  };
  // ...

  return (
    <div className="App">
      // ...
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient} // highlight-line
        error={error}
        onClose={closeModal} // highlight-line
      />
    </div>
  );
};
```

Let us have a look how these are typed.
The types, in *AddPatientModal/index.tsx* look like this:

```js
interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => Promise<void>;
  error?: string;
}

const AddPatientModal = ({ modalOpen, onClose, onSubmit, error }: Props) => {
  // ...
}
```

`onClose` is just a function that takes no parameters, and does not return anything, so the type is:

```js
() => void
```

The type of `onSubmit` is a bit more interesting, it has one parameter that has the type `PatientFormValues`.
The return value of the function is `Promise<void>`.
So again the function type is written with the arrow syntax:

```js
(values: PatientFormValues) => Promise<void>
```

The return value of an `async` function is a
[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#return_value)
with the value that the function returns.
Our function does not return anything so the correct return type is just `Promise<void>`.

</div>

<div class="tasks">

### Exercises 8.21-8.22

We will soon add a new type for our app, `Entry`, which represents a lightweight patient journal entry.
It consists of a journal text, i.e. a `description`, a creation date, information regarding the specialist who created it and possible diagnosis codes.
Diagnosis codes map to the ICD-10 codes returned from the ***/api/diagnoses*** endpoint.
Our naive implementation will be that a patient has an array of entries.

Before going into this, we need some preparatory work.

#### 8.21: Patientia, step 1

Create an endpoint ***/api/patients/:id*** to the backend that returns all of the patient information for one patient,
including the array of patient entries that is still empty for all the patients.
For the time being, expand the backend types as follows:

```js
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[]; // highlight-line
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;  // highlight-line
```

The response should look as follows:

![browser showing entries blank array when accessing patient](../../images/8/38a.png)

#### 8.22: Patientia, step 2

Create a page for showing a patient's full information in the frontend.

The user should be able to access a patient's information by clicking the patient's name.

Fetch the data from the endpoint created in the previous exercise.

You may use [MaterialUI](https://material-ui.com/) for the new components but that is up to you since our main focus now is TypeScript.

You might want to have a look at [part 7](/part7/react_router) if you don't yet have a grasp on how the [React Router](https://reactrouter.com/en/main/start/tutorial) works.

The result could look like this:

![browser showing patientia with one patient](../../images/8/39x.png)

The example uses [Material UI Icons](https://mui.com/components/material-icons/) to represent genders.

</div>

<div class="content">

### Full entries

In [exercise 8.10](/part8/typing_an_express_app#exercises-8-10-8-11)
we implemented an endpoint for fetching information about various diagnoses, but we are still not using that endpoint at all.
Since we now have a page for viewing a patient's information, it would be nice to expand our data a bit.
Let's add an `Entry` field to our patient data so that a patient's data contains their medical entries, including possible diagnoses.

Let's ditch our old patient seed data from the backend and start using [this expanded format](https://github.com/comp227/misc/blob/main/patients-full.ts).

Let's also start fleshing out our empty `Entry` in *types.ts* based on the data we have.

If we take a closer look at the data, we can see that the entries are quite different from one another.
For example, let's take a look at the first two entries:

```js
{
  id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
  date: '2015-01-02',
  type: 'Hospital',
  specialist: 'Eggman',
  diagnosisCodes: ['S62.5'],
  description:
    "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
  discharge: {
    date: '2015-01-16',
    criteria: 'Hand has healed.',
  }
}
...
{
  id: 'fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62',
  date: '2019-08-05',
  type: 'OccupationalHealthcare',
  specialist: 'Eggman',
  employerName: 'SNPP',
  diagnosisCodes: ['Z57.1', 'Z74.3', 'M51.2'],
  description:
    'Patient mistakenly found himself in a nuclear plant waste site without protection gear. Very minor radiation poisoning. ',
  sickLeave: {
    startDate: '2019-08-05',
    endDate: '2019-08-28'
  }
}
```

Immediately, we can see that while the first few fields are the same, the first entry has a `discharge` field and the second entry has `employerName` and `sickLeave` fields.
All the entries seem to have some fields in common, but some fields are entry-specific.

When looking at the `type`, we can see that there are three kinds of entries:

1. `OccupationalHealthcare`
2. `Hospital`
3. `HealthCheck`

This indicates we need three separate types.
Since they all have some fields in common, we might just want to create a base entry interface that we can extend with the different fields in each type.

When looking at the data, it seems that the fields `id`, `description`, `date` and `specialist` are something that can be found in each entry.
On top of that, it seems that `diagnosisCodes` is only found in one `OccupationalHealthcare` and one `Hospital` type entry.
Since it is not always used even in those types of entries, it is safe to assume that the field is optional.
We could consider adding it to the `HealthCheck` type as well
since it might just not be used in these specific entries.

So our `BaseEntry` from which each type could be extended would be the following:

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}
```

If we want to finetune it a bit further, since we already have a `Diagnosis` type defined in the backend,
we may want to refer to the code field of the `Diagnosis` type directly in case its type ever changes.
We can do that like so:

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Diagnosis['code'][];
}
```

We could define an array with the syntax `Array<Type>` instead of defining it `Type[]`
(as mentioned [earlier](/part8/first_steps_with_type_script/#the-alternative-array-syntax).
In this particular case, writing `Diagnosis['code'][]` starts to look a bit strange so we will decide to use the alternative syntax
(that is also recommended by the ESlint rule [array-simple](https://typescript-eslint.io/rules/array-type/#array-simple)):

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>; // highlight-line
}
```

Now that we have the `BaseEntry` defined in *types.ts*, we can start creating the extended entry types we will actually be using.
Let's start by creating the `HealthCheckEntry` type.

Entries of type `HealthCheck` contain the field `HealthCheckRating`, which is an integer from 0 to 3, zero meaning `Healthy` and 3 meaning `CriticalRisk`.
This is a perfect case for an enum definition.
With these specifications, we could write a `HealthCheckEntry` type definition like so:

```js
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
```

Now we only need to create the `OccupationalHealthcareEntry` and `HospitalEntry` types so we can combine them in a union and export them as an Entry type like this:

```js
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
```

### Omit with unions

An important point concerning unions is that, when you use them with `Omit` to exclude a property, it works in a possibly unexpected way.
Suppose we want to remove the `id` from each `Entry`.
We could think of using

```js
Omit<Entry, 'id'>
```

but [it wouldn't work as we might expect](https://github.com/microsoft/TypeScript/issues/42680).
In fact, the *resulting type would only contain the common properties, **but not the ones they don't share***.
A possible workaround is to define a special `Omit`-like function to deal with such situations:

```ts
// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
type EntryWithoutId = UnionOmit<Entry, 'id'>;
```

</div>

<div class="tasks">

### Exercises 8.23-8.30

Now we are ready to put the finishing touches to the app!

#### 8.23: Patientia, step 3

Define the types `OccupationalHealthcareEntry` and `HospitalEntry` so that those conform with the example data.
Ensure that your backend returns the entries properly when you go to an individual patient's route:

![browser showing entries json data properly for patient](../../images/8/40.png)

Use types properly in the backend!
For now, there is no need to do a proper validation for all the fields of the entries in the backend,
it is enough e.g. to check that the field `type` has a correct value.

#### 8.24: Patientia, step 4

Extend a patient's page in the frontend to list the `date`, `description` and `diagnoseCodes` of the patient's entries.

You can use the same type definition for an `Entry` in the frontend.
For these exercises, it is enough to just copy/paste the definitions from the backend to the frontend.

Your solution could look like this:

![browser showing list of diagnosis codes for patient](../../images/8/41.png)

#### 8.25: Patientia, step 5

Fetch and add diagnoses to the application state from the ***/api/diagnoses*** endpoint.
Use the new diagnosis data to show the descriptions for patient's diagnosis codes:

![browser showing list of codes and their descriptions for patient ](../../images/8/42.png)

#### 8.26: Patientia, step 6

Extend the entry listing on the patient's page to include the Entry's details with a new component
that shows the rest of the information of the patient's entries distinguishing different types from each other.

You could use eg. [Icons](https://mui.com/components/material-icons/) or some other [Material UI](https://mui.com/) component to get appropriate visuals for your listing.

You should use a *switch case*-based rendering and **exhaustive type checking** so that no cases can be forgotten.

Like this:

![vscode showing error for healthCheckEntry not being assignable to type never](../../images/8/35c.png)

The resulting entries in the listing *could* look something like this:

![browser showing list of entries and their details in a nicer format](../../images/8/36x.png)

#### 8.27: Patientia, step 7

We have established that patients can have different kinds of entries.
We don't yet have any way of adding entries to patients in our app, so, at the moment, it is pretty useless as an electronic medical record.

Your next task is to add endpoint ***/api/patients/:id/entries*** to your backend, through which you can POST an entry for a patient.

Remember that we have different kinds of entries in our app, so our backend should support all those types and check that at least all required fields are given for each type.

In this exercise you quite likely need to remember [this trick](/part8/working_with_an_existing_codebase#omit-with-unions).

You may assume that the diagnostic codes are sent in the correct form and *use the following kind of parser to extract those from the request body*:

```js
const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};
```

#### 8.28: Patientia, step 8

Now that our backend supports adding entries, we want to add the corresponding functionality to the frontend.
In this exercise, you should add a form for adding an entry to a patient.
An intuitive place for accessing the form would be on a patient's page.

In this exercise, it is enough to **support *one* entry type**.
All the fields in the form can be just plain text inputs, so it is up to the user to enter valid values.

Upon a successful submission the new entry should be added to the correct patient and the patient's entries on the patient page should be updated to contain the new entry.

Your form might look something like this:

![Patientia new healthcheck entry form](../../images/8/74new.png)

If a user enters invalid values to the form and backend rejects the addition, show a proper error message to the user.

![browser showing healthCheckRating incorrect 15 error](../../images/8/75new.png)

#### 8.29: Patientia, step 9

Extend your solution so that it supports **all the entry types**.

#### 8.30: Patientia, step 10

Improve the entry creation forms so that it makes it hard to enter incorrect dates, diagnosis codes and health rating.

Your improved form might look something like this:

![patientia showing fancy calendar ui](../../images/8/76new.png)

Diagnosis codes are now set with Material UI
[multiple select](https://mui.com/material-ui/react-select/#multiple-select) and dates with
[a Native Picker](https://mui.com/x/react-date-pickers/getting-started/#NativePickers.tsx) or the HTML
[`input`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) tag.

</div>
