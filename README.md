# rserve - Booking made easy

Requires mongodb server.

## Installing

### Node modules

Install all node modules and dependencies with ``npm install``

More information [https://npmjs.org/]

### Grunt

Install grunt with ``npm install -g grunt-cli``

More information [http://gruntjs.com/getting-started]


## Starting server

``npm start``

Note: Default port 3000, to change:

``PORT=3000 npm start``


## Grunt tasks

Run all tasks with ``grunt``, this will:

 * run jshint on browser and node js-files.
 * run jasmine spec runner for browser through phantomjs
 * run jasmine spec runner for node

### Jshint

[http://www.jshint.com/]

* ``grunt lint`` - browser and node
* ``grunt lint_browser`` - browser only
* ``grunt lint_node`` - node only

### Spec runner

* ``grunt spec`` - browser and node
* ``grunt spec_browser`` - browser only
* ``grunt spec_node`` - node only

