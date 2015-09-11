UI Strategies
============================================================

Since Kanso manages a single state, your UI will need to accept this object and use it as you see fit. There are several ways you can do this.


Single data change listener with top-level component
------------------------------------------------------------

You can have a data change listener, as defined above, that pulls the application's API out of the app and passes it into a top-level component.

_Example of passing the api:_

    function myDataChangeListener(kanso) {
        topComponent.render(kanso.api());
    }

_Example of passing the raw state:_

    function myDataChangeListener(kanso) {
        topComponent.render(kanso.state());
    }

Your top-level component can then break down the state and pass in individual pieces of data to child components that need it.


Multiple data change listeners with multiple top-level components
------------------------------------------------------------

You could have several change listeners that each pull a different set of data from the state and pass it to their managed components.

_Example of multiple top-level listeners:_

    function listener1(kanso) {
        fooCmp.render(kanso.state().get('fooStuff'));
    }
    
    function listener2(kanso) {
        barCmp.render(kanso.state().get('barStuff'));
    }


React JS
------------------------------------------------------------

React is a UI library that makes authoring components very declarative and simple. It would be trivial to integrate a top-level React component with Kanso:

_Example using React with a change listener and app api:_

    listener(kanso) {
        React.render(
            <TopLevel api={kanso.api()} />,
            document.getElementById('app-container')
        );
    }

_Example using React with a change listener and app state:_

    listener(kanso) {
        React.render(
            <TopLevel appState={kanso.state()} />,
            document.getElementById('app-container')
        );
    }


Dispatching actions
------------------------------------------------------------

The UI must dispatch actions in some way, ultimatly passing the action to `kanso#dispatch` method.
