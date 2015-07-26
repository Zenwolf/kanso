UI Strategies
============================================================

Since Kanso manages a single state for the entire application, your UI will need to accept this object and use it as you see fit. There are several ways you can do this.


Leverage the App#render function
------------------------------------------------------------

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


Single data change listener with top-level component
------------------------------------------------------------

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


Multiple data change listeners with multiple top-level components
------------------------------------------------------------

You could have several change listeners that each pull a different set of data from the state and pass it to their managed components.

_Example of multiple top-level listeners:_

    function listener1(app) {
        fooCmp.render(app.state.get('fooStuff'));
    }
    
    function listener2(app) {
        barCmp.render(app.state.get('barStuff'));
    }


React JS
------------------------------------------------------------

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


Dispatching actions
------------------------------------------------------------

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
