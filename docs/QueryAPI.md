QueryAPI
============================================================

Creates an API object that queries a specific state for data.

Queries
------------------------------------------------------------

Queries are functions that query data from a particular state. Each query function has a basic signature:

    state => data

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

    const MyAPI = QueryAPI({
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
            if (state !== myState) {
                throw new Error('Invalid state.');
            }
        }
    });

Now you are ready to use it, as explained in the section below.


How to use your new API
------------------------------------------------------------

You can use the API is two ways:

1. _Stateless with pure static functions._ This is useful when the state is owned externally and will be passed into the query functions.
2. _Stateful with functions bound to a specific state instance._ This is useful if you want to create a specific instance of the API bound to a specific state snapshot, and pass it to some other part of the app without worrying about it changing or being effected in any way. For example, passing the current state+API to the rendering layer.

The examples below build upon the `MyAPI` we built above.

### Using a stateless API

    const name = MyAPI.getName(myState);
    const thing1 = MyAPI.getThingById(myState, '1');

### Using a stateful API

    const api = MyAPI(myState);
    const name = api.getName();
    const thing1 = api.getThingById('1');
