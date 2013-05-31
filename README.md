Kanso
============================================================

Kanso is a light-weight architecture for thick-client
browser web applications. Kanso's philosophy is to
provide simple systems that can be used at your own 
discretion. You can use these patterns in many ways.
Kanso molds to the skill of the user.

["By removing the non-essential and ornate, we can express a bare and honest simplicity."](http://aentan.com/design/wabi-sabi-and-japanese-aesthetics/)


Project Status
------------------------------------------------------------

Unstable; in development.


Overview
------------------------------------------------------------

Kanso is primarily composed of three layers:

1. UI Layer
2. Application Layer
3. Data Layer


UI Layer
------------------------------------------------------------

Kanso's UI layer consists of four parts:

1. Page
2. Director
3. Widget
4. View

_Page_: A page is the highest level of UI where
application intersects with UI. The page has a view, which
is the top-level view. A page creates widgets and
indicates where they should render in its view.

_Director_: An optional object whose sole purpose is to
encapsulate UI logic between a set of widgets. Director
is a mediator for the widgets that you add to it. Director
can bridge events from widget event emitters to another
event emitter.

_Widget_: Widget is a Presenter that encapsulates UI logic.
Widget is responsible for controlling a view. Usually, a
widget operates on a resource (see application layer for
details on resources).

_View_: The view is a passive view controlled by
the widget. It should only handle logic that is directly
associated with that rendered output.
For example, if the view renders a DOM, then the
view is responsible for handling the DOM events. Views
can choose to emit render-agnostic UI events so that a
widget can decide to act.


Application Layer
------------------------------------------------------------

Kanso's application layer consists of three parts:

1. App
2. App State
3. Resource

_App_: The highest level object. It contains all other
objects and any generic procedures and business logic.

_App State_: An application can have one or more states
to clearly delineate its logic.

_Resource_: A resource is a data model that also
encapsulates business logic directly related to the
contained data. This way, anyone who has a resource
also has access to commonly used logic that you would
normally need with that data.


Data Layer
------------------------------------------------------------

Kanso's data layer consists of three parts:

1. Identity map
2. Data Mapper
3. Service client

// TODO
