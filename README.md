# rserve - Booking made easy

## Installing

### Node modules

Install all node modules and dependencies with ``npm install``

More information [https://npmjs.org/]

### Grunt

Install grunt with ``npm install -g grunt-cli``

More information [http://gruntjs.com/getting-started]


## Starting server

Run server on default port 3000:

``node server/server``


## Grunt tasks

Run all tasks with ``grunt``, this will

 * run jshint on browser and node js-files.
 * run jasmine spec runner for browser through phantomjs
 * run jasmine spec runner for node

## Jshint

Run jshint for:

* ``grunt lint`` - browser and node
* ``grunt lint_browser`` - browser only
* ``grunt lint_node`` - node only

## Spec runner

Run spec runner for:
* ``grunt spec`` - browser and node
* ``grunt spec_browser`` - browser only
* ``grunt spec_node`` - node only

