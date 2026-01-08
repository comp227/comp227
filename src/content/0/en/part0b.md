---
mainImage: ../../../images/part-0.svg
part: 0
letter: b
lang: en
---

<div class="content">

Now that you read the syllabus.
Congratulations! This course is an introduction to modern web development with JavaScript.
The main focus is on single-page applications implemented with React and supporting them with RESTful web services implemented with Node.js.
The course also has parts on TypeScript, Redux, and React Native.

Other topics include debugging applications, container technology, configuration, managing runtime environments, and databases.

### Course material

The course material is meant to be read one part at a time and in order.

The material contains exercises, which are placed so that the preceding material provides enough information for solving each exercise.
You can do the exercises as you encounter them in the material,
but it can also be beneficial to read all of the material in the part before starting with the exercises.

In many parts of the course, the exercises build one larger application one small piece at a time.
Some of the exercise applications are developed through multiple parts.

The course material is based on incrementally expanding example applications, which change from part to part.
It's best to follow the code along while making small modifications independently.
The code of the example applications for each step of each part can be found on GitHub.

### Taking the course

The course contains 9 parts, the first of which is numbered 0 for consistency with past iterations.
One part corresponds loosely to around two weeks of studying since you'll have other activities attached as well.

For parts 0-5, You should not study part *n+1* without enough know-how of the topics in part *n*.
In pedagogic terms, the course uses [Mastery Learning](https://en.wikipedia.org/wiki/Mastery_learning).

In parts 0-4, you are expected to do *at least* all of the exercises that are not marked with an asterisk(*).
You should only proceed to the next part after doing enough of the previous part's exercises.
***Once you mark or open up the next section of exercises, we will not grade any additional exercises from the previous part.***
Exercises marked with an asterisk count towards your final grade, but skipping them does not prevent you from doing the compulsory exercises in the next parts.
Other parts do not have asterisk-marked exercises since there is no similar dependency on previous parts.

While there is no late penalty for not completing exercises for a given assignment,
there is a cap on how many exercises you can submit in a given week.
You are not superhuman, as such, you can only submit 110% of your average exercise workload for any given week.
This means that if you fall behind, while you will not be penalized for being late,
you'll need to address what you have learned in your assessments and meetings with me.
This is also done to encourage the idea of regular and consistent work throughout the semester, instead of **cramming**,
which leads to not paying attention to the work as you move forward.

### Studying the course in a nutshell

How to study the course – instructions in a nutshell:

- Do the exercises.
  You'll need to show your work on the exercises.  The exercises are submitted through GitHub and marking them as done on Canvas.
- You need to work regularly.
  The easiest way to fall behind in the course is to not work on it every couple of days.
  Set yourself an alarm...do anything! But make it a habit of working on it at least 2 times a week outside of class for a little bit of time.

### How to ask for help in Discord

When you ask for help on a problem in our Discord group your question should be as informative and precise as possible.
If your question looks like this:

> *Adding a new person does not work, could you help me with that?*

People will be reluctant to help because the bug can be *anywhere*!

A better question would be:

> *In the exercise 2.15 when I try to add a new person to the app, server responds with a 403, despite the request looking OK to me.*
>
> *The line of code looks like this*
>
> ```js
>   // the relevant part of code is pasted here
>   // code should contain several console.log statements for helping the debugging
> ```
>
> *When I run it, following gets printed to the console*
>
> ```bash
>   // data printed to console
> ```
>
> *The network tab looks like the following*
>
> [screen shot from the network or console]

If you are asking the teaching staff directly for help, then please also include a link to your GitHub repo, however, this should not be shared with your classmates.
Notice the details in the second response and a plan of action for what you've tried.
Both help you narrow down the possibilities.

### Submitting exercises

You will be submitting exercises via the GitHub Classroom repos that will be provided on Canvas.
**All of the exercises from this website must be submitted through GitHub.**
You will also be expected to submit your progress for exercises regularly, even if it is not finished.

Exercises are submitted according to **the marked canvas assignment**.
Once you have submitted exercises for an assignment, you can no longer submit any more exercises for those sections.

A system for detecting plagiarism is used to check exercises submitted to GitHub.
If code is found from model answers or multiple students hand in the same code,
the situation is handled according to the policy on plagiarism as outlined in the syllabus.

Many of the exercises build a larger application bit by bit.
You will be expected to commit often so that you show your work as you move through the course.
You will need to practice committing early and often.
It is the equivalent of showing your work in class.

### Full stack project

For the project, an application is implemented in React and/or Node, though implementing a mobile application in React Native is also possible.

Some of you will be working in pairs or groups on the final project.

More information about the project will be released via Canvas

### Before you start

Using a Chromium-based browser like [Chrome](https://www.google.com/chrome/) is recommended while developing because
it provides great tools for web development.
I will be showing you and providing screenshots of those tools.
Another alternative is the [Developer Edition of Firefox](https://www.mozilla.org/en-US/firefox/developer/),
which provides a similar range of features.

In [part 0d](/part0/configuring_your_machine_for_this_course) we'll provide detailed instructions for installing some of the tools that we will be using extensively:
[Git](https://git-scm.org) (via GitHub),
[WebStorm](https://www.jetbrains.com/webstorm/download/)
and [Node.js](https://nodejs.org/en/).

The course exercises will be submitted to GitHub, so Git must be installed and you should know how to use it.

### Typos in the material

If you find a typo in the material, grammar mistakes, a wordy paragraph, or an unclear explanation,
submit a *pull request* to the course material in the [repository](https://github.com/comp227/comp227).
For example, the markdown source code of this page can be found in the repository at <https://github.com/comp227/comp227/edit/source/src/content/0/en/part0a.md>

At the bottom of each part of the material is a link to **propose changes to the material**.
You can edit the source code of the page by clicking on the link.

There are also lots of links in the material for many kinds of background material.
If you notice that a link is broken (that happens too often...),
propose a change or ping us in Discord if you do not find a replacement for the broken link.

</div>
