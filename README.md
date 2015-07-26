Kanso
============================================================

Kanso is a light-weight architecture for web applications. Kanso's philosophy is to provide simple systems that can be used at your own discretion. You can use these patterns in many ways. Kanso molds to the skill of the user.

["By removing the non-essential and ornate, we can express a bare and honest simplicity."](http://web.archive.org/web/20120225201014/http://aentan.com/design/wabi-sabi-and-japanese-aesthetics/)


Install
------------------------------------------------------------

    npm install --save @zenwolf/kanso


Overview
------------------------------------------------------------

### Encapsulated state
Kanso focuses on encapsulating state and logic, separating them from the UI layer. State is maintained in a single place and can be passed into another system for processing
or rendering.

Kanso shapes the world: something else can render it into the visible realm.

### No Defined UI layer
Kanso defines no specific UI, allowing you to use any UI technology you like. Your UI of choice will need to accept the entire state and use it as it sees fit. The UI will need to be able to create actions and dispatch them on the app object using the `App#dispatch` method.

### Core concepts

1. Unidirectional data flow that operates solely on actions/commands.
2. Immutable state managed by state data stores.
3. Interceptors to extend the core system:
    * action interceptors -- allow you to act upon an action or change the action/replace it before it is passed to stores and used to modify state.
    * state interceptors -- allow you to act upon a new state before it is set, or change it/replace it, before change listeners are called.
4. Standard way to define state queries using `QueryApi` generator, which can be used statelessly(static methods) or statefully(bound to a specific state snapshot).



Responding to changes
------------------------------------------------------------

Kanso gives you different ways to respond to changes:

1. Intercept actions.
2. Listen to state changes.

### Interceptors
Interceptors are all composed into a single function call. The intial value is passed as the argument, and each function returns the same value type that is passed as the arugment to the next interceptor, until you end up with a single, resulting value which is then processed by the application.


### Action Interceptors
An action interceptor is a function that allows you to receive an action before it is used to change state. The required function signature is:

    action => action

You can return the same action, you could return a different action, or you could return a modified version of the same action. This is an extremely flexible system, hopefully allowing you to perform any number of things in response to an action.


### State Interceptors
A state interceptor is a function that allows you to receive a new state before it is set. The required function signature is:

    state => state

Much like an action interceptor, you can return the same state, return a different state, or return a modified version of the same state.


UI Strategies
------------------------------------------------------------
Here are [some strategies](docs/UIStrategies.md) related to working with UI. 


Build
------------------------------------------------------------

### Code generation
Kanso is written in ES6 and uses Babel to generate ES5 JS code. You run a build command to generate the resulting library from `src` into the `lib` folder.

    npm run build

### Code linting
Kanso uses eslint to lint code.

    npm run lint

### Run tests
Kanso uses mocha for unit tests.

    npm test

### Run verification (lint + test)

    npm run verify
