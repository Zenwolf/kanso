Kanso
============================================================

Kanso is a light-weight architecture for thick-client
browser web applications. Kanso's philosophy is to
provide simple systems that can be used at your own 
discretion. You can use these patterns in many ways.
Kanso molds to the skill of the user.

["By removing the non-essential and ornate, we can express a bare and honest simplicity."](http://web.archive.org/web/20120225201014/http://aentan.com/design/wabi-sabi-and-japanese-aesthetics/)


Project Status
------------------------------------------------------------

Unstable; in development.


Overview
------------------------------------------------------------

Kanso is primarily composed of three layers:

1. UI Layer
2. Application Layer
3. Data Layer

Kanso's systems were heavily-inspired by various game architectures. Kanso applies these techniques to improve web application performance and rendering in ways unbound by convention.


UI Layer
------------------------------------------------------------

Kanso's UI layer consists of these:

1. Dual fixed-step-loop render and update system.
2. Composable UI Widgets.
3. Resource-PassiveView-Presenter model.
4. A configurable Entity system based on Behaviors and Attributes.
5. A Card-based UI paradigm.
6. Physics-based animations and scrolling.


Application Layer
------------------------------------------------------------

TBD.


Data Layer
------------------------------------------------------------

Kanso's data layer consists of the following:

1. Resource
2. Identity map
3. Data Mapper
4. Service client

_Resource_: A resource is a data model that also
encapsulates business logic directly related to the
contained data. This way, anyone who has a resource
also has access to commonly used logic that you would
normally need with that data. It is available in Evented and plain forms.

TBD
