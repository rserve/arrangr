# rserve - Booking made easy

[![Build Status](https://drone.io/github.com/rserve/rserve/status.png)](https://drone.io/github.com/rserve/rserve/latest)

Requires mongodb server.

## Installing

### MongoDB

[http://www.mongodb.org/](http://www.mongodb.org/)

MongoDB must be started for application to work.

### Node modules

Install all node modules and dependencies with ``npm install``

More information [https://npmjs.org/]

### Grunt

Install grunt with ``npm install -g grunt-cli``
cd ..

More information [http://gruntjs.com/getting-started]

## Starting server

``npm start``

Note: Default port 3000, to change:

``PORT=3000 npm start``

## Testing

``npm test``

Will:

* run jshint on browser and node js-files.
* run karma jasmine spec runner for browser through phantomjs
* run jasmine spec runner for node

### Browser watch

``grunt karma:watch``

Will start karma spec server and connect Chrome browser. Watches browser script or specs files for changes and executes specs.

## Build step

``grunt build``

Will create a build bundle in ``/build/client``
