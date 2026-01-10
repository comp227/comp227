---
mainImage: ../../../images/part-7.svg
part: 7
letter: f
lang: en
---

<div class="content">

In addition to the eight exercises in the [React router](/part7/react_router)
and [custom hooks](/part7/custom_hooks) sections of this seventh part of the course material,
13 exercises continue our work on the Watchlist application that we worked on in parts four and five of the course material.
Some of the following exercises are "features" that are independent of one another,
meaning that there is no need to finish them in any particular order.
You are free to skip over a part of the exercises if you wish to do so.
A few of them are about applying some of the advanced state management techniques from Redux, React Query and Context covered in [part 6](/part6).

If you you need help with your original Watchlist application, you can reach out to me so that we can help you move forward and to establish a starting point for these exercises.

Many of the exercises in this part of the course material will require the refactoring of existing code.
This is a common reality of extending existing applications,
meaning that refactoring is an important and necessary skill even if it may feel difficult and unpleasant at times.

One good piece of advice for both refactoring and writing new code is to take ***baby steps***.
Panic is almost guaranteed if you leave the application in a completely broken state for long periods while refactoring.

</div>

<div class="tasks">

### Exercises 7.9-7.21

#### 7.9: Automatic Code Formatting

In the previous parts, we used ESLint to ensure that code follows the defined conventions.
[Prettier](https://prettier.io/) is yet another approach for the same.
According to the documentation, Prettier is *an opinionated code formatter*, that is,
Prettier not only controls the code style but also formats the code according to the definition.

Prettier is easy to integrate into the code editor so that when it is saved, it is automatically formatted.

Take Prettier to use in your app and configure it to work with your editor.

### State Management

For exercises 7.10-7.13, you can do the state management either by using:

- React Query and Context
- Redux

You can maximize your learning by doing both.

#### 7.10: State Management, Step 1

Refactor the application from using the internal React component state to using one of the above technologies for the application's state management.

For example, you can refactor the app to use the `useReducer` hook and context to manage the notification data.

Change the application's notifications to use the state management at this point of the exercise set.

#### 7.11: State Management, Step 2

> The next two exercises are quite laborious but incredibly educational.

Store the information about shows in one of the two state management solutions.
In this exercise, it is enough that you can see the shows in the backend and recommend a new show.

You are free to manage the state for logging in and creating new shows by using the internal state of React components.

#### 7.12: State Management, Step 3

Expand your solution so that it is again possible to like and delete a show.

#### 7.13: State Management, Step 4

Store the information about the signed-in user via State Management.

### Views

The rest of the tasks are common to both the Redux and React Query versions.

#### 7.14: Users view

Implement a view to the application that displays all of the basic information related to users:

![browser watchlist with users table showing shows recommended](../../images/7/41.png)

#### 7.15: Individual User View

Implement a view for individual users that displays all of the shows recommended by that user:

![browser watchlist showing users recommended new shows](../../images/7/44.png)

You can access this view by clicking the name of the user in the view that lists all users:

![browser watchlist showing clickable users](../../images/7/43.png)

> **Pertinent:** you will almost certainly stumble across the following error message during this exercise:
>
> ![browser TypeError cannot read property name of undefined](../../images/7/42ea.png)
>
> The error message will occur if you refresh the individual user's page.
>
> The cause of the issue is that, when we navigate directly to the individual user's page, the React application has not yet received the data from the backend.
One solution for this problem is to use conditional rendering:
>
> ```js
> const User = () => {
>   const user = ...
>   // highlight-start
>   if (!user) {
>     return null
>   }
>   // highlight-end
> 
>   return (
>     <div>
>       // ...
>     </div>
>   )
> }
> ```

#### 7.16: Single show view

Implement a separate view for show.
You can model the layout of your view after the following example:

![browser shows showing single show via URL /shows/number](../../images/7/45.png)

Users should be able to access this view by clicking the name of the show in the view that lists all of the shows.

![browser showing shows are clickable](../../images/7/46.png)

After you're done with this exercise, the functionality that was implemented in exercise 5.7 is no longer necessary.
Clicking a show no longer needs to expand the item in the list and display the details of the show.

#### 7.17: Navigation

Implement a navigation menu for the application:

![browser shows navigation navigation menu](../../images/7/47.png)

#### 7.18: Comments, Step 1

Implement the functionality for commenting on recommended shows:

![browser watchlist showing list of comments for a show](../../images/7/48.png)

Comments should be anonymous, meaning that they are not associated with the user who left the comment.

In this exercise, it is enough for the frontend to only display the comments that the application receives from the backend.

An appropriate mechanism for adding comments to a show would be an HTTP POST request to the ***api/shows/:id/comments*** endpoint.

#### 7.19: Comments, Step 2

Extend your application so that users can add comments to recommended shows from the frontend:

![browser showing comments added via frontend](../../images/7/49.png)

#### 7.20: Styles, Step 1

Improve the appearance of your application by applying one of the methods shown in the course material.

#### 7.21: Styles, Step 2

You can mark this exercise as finished if you use an hour or more for styling your application.

This was the last exercise for this part of the course and it's time to push your code to GitHub if you haven't already and mark the exercises that were completed on Canvas.

</div>
