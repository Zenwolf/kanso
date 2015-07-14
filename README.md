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

### No Defined UI layer
Kanso defines no specific UI, allowing you to use any UI technology you like. Your UI of choice will need to accept the entire state and use it as it sees fit. The UI will need to be able to create actions and dispatch them on the app object using the `App#dispatch` method.

### Inspiration
Kanso's logic design is heavily-inspired by Domain Driven Design and CQRS.


Responding to changes
------------------------------------------------------------

Kanso gives you different ways to respond to changes:

1. Intercept actions.
2. Intercept state changes.
3. Listen to data changes.

### Action Interceptors
An action interceptor allows you to receive an action before it is used to change state. The required function signature is:

    action => action

You can return the same action, you could return a different action, or you could return a modified version of the same action. This is an extremely flexible system, hopefully allowing you to perform any number of things in response to an action.

### State Interceptors
A state interceptor allows you to receive a new state before it is set. The required function signature is:

    state => state

Much like an action interceptor, you can return the same state, return a different state, or return a modified version of the same state.

### Data Change Listeners
A data change listener is a function that is called whenever the application's data has changed. The required function signature is:

    app => {}

The application object is passed into the listener, where it can get the current api, current state, or any other data it may need.


UI Strategies
------------------------------------------------------------

Since Kanso manages a single state for the entire application, your UI will need to accept this object and use it as you see fit. There are several ways you can do this.

### Leverage the App#render function
By default, the `App#render` function does nothing. You can override the `App#render` function to call your UI. This function is only called after app data has changed and all change listeners have completed.

_Example of overridding App#render and using app api:_

    class MyApp extends App {
        render(app) {
            myUI.render(app.api);
        }
    }

_Example of overridding App#render and using app state:_

    class MyApp extends App {
        render(app) {
            myUI.render(app.state);
        }
    }

### Single data change listener with top-level component
You can have a data change listener, as defined above, that pulls the application's API out of the app and passes it into a top-level component.

_Example of passing the api:_

    function myDataChangeListener(app) {
        topComponent.render(app.api);
    }

_Example of passing the raw state:_

    function myDataChangeListener(app) {
        topComponent.render(app.state);
    }

Your top-level component can then break down the state and pass in individual pieces of data to child components that need it.

### Multiple data change listeners with multiple top-level components
You could have several change listeners that each pull a different set of data from the state and pass it to their managed components.

_Example of multiple top-level listeners:_

    function listener1(app) {
        fooCmp.render(app.state.get('fooStuff'));
    }
    
    function listener2(app) {
        barCmp.render(app.state.get('barStuff'));
    }

### React JS
React is a UI library that makes authoring components very declarative and simple. It would be trivial to integrate a top-level React component with Kanso:

_Example using React with App#render and app api:_

    class MyApp extends App {
        render(app) {
            React.render(
                <TopLevel appApi={app.api} />,
                document.getElementById('app-container')
            );
        }
    }

_Example using React with App#render and app state:_

    class MyApp extends App {
        render(app) {
            React.render(
                <TopLevel appState={app.state} />,
                document.getElementById('app-container')
            );
        }
    }

_Example using React with a change listener and app api:_

    listener(app) {
        React.render(
            <TopLevel appApi={app.api} />,
            document.getElementById('app-container')
        );
    }

_Example using React with a change listener and app state:_

    listener(app) {
        React.render(
            <TopLevel appState={app.state} />,
            document.getElementById('app-container')
        );
    }

### Dispatching actions
The UI must dispatch actions in some way, ultimatly passing the action to `App#dispatch` method. There are many ways to do this, but here are a few examples.

_Example of passing a bound dispatch function into the UI:_

    class MyApp extends App {
        render(app) {
            React.render(
                <TopLevel
                    api={app.api}
                    dispatch={app.dispatch.bind(app)}
                />
            );
        }
    }

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
