# Testing

Automated testing helps prevent regressions and reproduce complex failure
scenarios for bug fixing or feature implementation. This project comes with
support for both unit and integration testing with your Screeps code.

You can read more about [unit and integration testing on
Wikipedia](https://en.wikipedia.org/wiki/Test-driven_development).

This documentation will cover the testing setup for those already familiar with
the process of test driven design.

Tests are written via [Mocha](https://mochajs.org/) and executed as tests only
if they include `.test.ts` in their filename. If you have written a test file
but aren't seeing it executed, this is probably why. There are two separate test
commands and configurations, as unit tests don't need the complete Screeps
server run-time as integration tests do.

## Running Tests

The standard `npm test` will execute all unit and integration tests in sequence.
This is helpful for CI/CD and pre-publish checks, however during active
development it's better to run just a subset of interesting tests.

You can use `npm run test-unit` or `npm run test-integration` to run just one of
the test suites. Additionally you can supply Mocha options to these test
commands to further control the testing behavior. As an example, the following
command will only execute integration tests with the word `memory` in their
description:

```
npm run test-integration -- -g memory
```

Note that arguments after the initial `--` will be passed to `mocha` directly.

## Unit Testing

You can test code with simple run-time dependencies via the unit testing
support. Since unit testing is much faster than integration testing by orders of
magnitude, it is recommended to prefer unit tests wherever possible.

## Integration Testing

Integration testing is for code that depends heavily on having a full game
environment. Integration tests are completely representative of the real game
(in fact they run with an actual Screeps server). This comes at the cost of
performance and very involved setup when creating specific scenarios.

Server testing support is implmented via
[screeps-server-mockup](https://github.com/Hiryus/screeps-server-mockup). View
this repository for more information on the API.

By default the test helper will create a "stub" world with a 3x3 grid of rooms
with sources and controllers. Additionally it spawns a bot called "player"
running the compiled main.js file from this repository.

It falls on the user to properly set up preconditions using the
screeps-server-mockup API. Importantly, most methods exposed with this API are
asynchronous, so using them requires frequent use of the `await` keyword to get
a result and ensure order of execution. If you find that some of your
preconditions don't seem to take effect, or that you receive a Promise object
rather than an expected value, you're likely missing `await` on an API method.

Finally, please note that screeps-server-mockup, and this repo by extension,
come with a specific screeps server version at any given time. It's possible
that either your local package.json, or the screeps-server-mockup package itself
are out of date and pulling in an older version of the [screeps
server](https://github.com/screeps/screeps). If you notice that test environment
behavior differs from the MMO server, ensure that all of these dependencies are
correctly up to date.
