Kanso
============================================================

Kanso is a light-weight architecture for web applications. Kanso's philosophy is to provide simple systems that can be used at your own discretion. You can use these patterns in many ways. Kanso molds to the skill of the user.

["By removing the non-essential and ornate, we can express a bare and honest simplicity."](http://web.archive.org/web/20120225201014/http://aentan.com/design/wabi-sabi-and-japanese-aesthetics/)


Install
------------------------------------------------------------

    npm install --save @zenwolf/kanso

Overview
------------------------------------------------------------

Kanso focuses on encapsulating state and logic, separating them from the UI layer. Like a game, state is sent to the rendering layer to be transformed into something visible.

Kanso is inspired by various game architectures. Kanso applies these techniques to improve web application performance and rendering in ways unbound by convention.

Kanso's logic design is heavily-inspired by Domain Driven Design and CQRS.


Build
------------------------------------------------------------

Kanso is written in ES6 and uses Babel to generate ES5 JS code. You run a build command to generate the resulting library from `src` into the `lib` folder.

    npm run build
