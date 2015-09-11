queryApi
============================================================

Creates an API factory function that queries a specific state for values.

Queries
------------------------------------------------------------

Queries are functions that query data from a particular state. Each query function has a basic signature:

    state => value

The `state` must always be the first argument to a query function. You can always add additional args after the state if you need them.

_Example of a simple state query function:_

    function getName(state) {
        return state.name
    }


How to create your own API
------------------------------------------------------------

Given some example state like this:

    const myState = {
        name: 'Foo',
        things: [
            { id: 1 },
            { id: 2 }
        ]
    };

We create an API:

    const myApi = queryApi({
        queries: {
            getName(state) {
                return state.name;
            },
            
            getThingById(state, id) {
                let thing = null;
                
                state.things.some(obj => {
                    if (obj.id === id) {
                        thing = obj;
                        return true;
                    }
                    return false;
                });
                
                return thing;
            }
        },
        
        validateState(state) {
            if (!state.name || !Array.isArray(state.things)) {
                throw new Error('Invalid state.');
            }
        }
    });

Now you are ready to use it, as explained in the section below.


How to use your new API
------------------------------------------------------------

You can use the API is two ways:

1. _Stateless with pure static functions._ This is useful when the state is owned externally and will be passed into the query functions.
2. _Stateful with functions bound to a specific state instance._ This is useful if you want to create a specific instance of the API bound to a specific state snapshot, and pass it to some other part of the app without worrying about it changing or being effected in any way(this is easy if you are using immutable data structures). For example, passing the current state+API to the rendering layer.

The examples below build upon the `MyApi` we built above.

### Using a stateless API

    const name = myApi.getName(myState);
    const thing1 = myApi.getThingById(myState, '1');

### Using a stateful API

    const api = myApi(myState);
    const name = api.getName();
    const thing1 = api.getThingById('1');
